import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlantAnalysisSchema } from "@shared/schema";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Plant analysis routes
  app.get("/api/plant-analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllPlantAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant analyses" });
    }
  });

  app.get("/api/plant-analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getPlantAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Plant analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant analysis" });
    }
  });

  app.delete("/api/plant-analyses/:id", async (req, res) => {
    try {
      const success = await storage.deletePlantAnalysis(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Plant analysis not found" });
      }
      res.json({ message: "Plant analysis deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plant analysis" });
    }
  });

  // Image upload and analysis route
  app.post("/api/analyze-plant", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Process image with Sharp
      const processedImageBuffer = await sharp(req.file.buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Convert to base64 for Plant.id API
      const base64Image = processedImageBuffer.toString('base64');

      // Call Plant.id API for identification and health assessment
      const plantIdApiKey = process.env.PLANT_ID_API_KEY || process.env.VITE_PLANT_ID_API_KEY;
      if (!plantIdApiKey) {
        return res.status(500).json({ message: "Plant.id API key not configured" });
      }

      // Combined identification and health assessment request
      const plantIdResponse = await fetch('https://api.plant.id/v3/identification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': plantIdApiKey,
        },
        body: JSON.stringify({
          images: [`data:image/jpeg;base64,${base64Image}`],
          similar_images: true,
          health: 'all',
          classification_level: 'species'
        }),
      });

      if (!plantIdResponse.ok) {
        const errorText = await plantIdResponse.text();
        console.error('Plant.id API error response:', errorText);
        throw new Error(`Plant.id API error: ${plantIdResponse.status} - ${errorText}`);
      }

      const plantData = await plantIdResponse.json();
      console.log('Plant.id response:', JSON.stringify(plantData, null, 2));

      // Get weather data if location is provided
      let weatherData = null;
      if (req.body.latitude && req.body.longitude) {
        const weatherApiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
        if (weatherApiKey) {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=${weatherApiKey}&units=imperial`
          );
          
          if (weatherResponse.ok) {
            weatherData = await weatherResponse.json();
          }
        }
      }

      // Process and structure the response
      const topSuggestion = plantData.result?.classification?.suggestions?.[0];
      const healthAssessment = plantData.result?.disease;
      const isHealthy = plantData.result?.is_healthy?.binary;

      const analysisData = {
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
        commonName: topSuggestion?.name || "Unknown Plant",
        scientificName: topSuggestion?.details?.name_authority || topSuggestion?.name || "",
        confidence: topSuggestion?.probability || 0,
        healthStatus: isHealthy ? "Healthy" : 
                     (healthAssessment?.suggestions?.length > 0 ? "Issues Detected" : "Unknown"),
        healthIssues: healthAssessment?.suggestions || [],
        treatmentRecommendations: generateTreatmentRecommendations(healthAssessment, topSuggestion),
        weatherData: weatherData,
        userId: null,
      };

      // Save to storage
      const savedAnalysis = await storage.createPlantAnalysis(analysisData);

      res.json(savedAnalysis);
    } catch (error) {
      console.error('Plant analysis error:', error);
      res.status(500).json({ message: "Failed to analyze plant image" });
    }
  });

  // Weather data route
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const weatherApiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
      if (!weatherApiKey) {
        return res.status(500).json({ message: "Weather API key not configured" });
      }

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Clear all plant analyses
  app.delete("/api/plant-analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllPlantAnalyses();
      for (const analysis of analyses) {
        await storage.deletePlantAnalysis(analysis.id);
      }
      res.json({ message: "All plant analyses cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear plant analyses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateTreatmentRecommendations(healthAssessment: any, plantSuggestion: any) {
  const recommendations = {
    immediate: [],
    organic: {
      description: "Natural, eco-friendly treatment options",
      steps: [],
      timeline: "2-4 weeks for visible improvement"
    },
    chemical: {
      description: "Fast-acting treatment for severe cases",
      steps: [],
      timeline: "1-2 weeks for visible improvement"
    }
  };

  // Basic care recommendations based on plant type
  if (plantSuggestion?.name) {
    const plantName = plantSuggestion.name.toLowerCase();
    
    if (plantName.includes('monstera')) {
      recommendations.immediate = [
        "Water when top inch of soil is dry",
        "Provide bright, indirect light",
        "Maintain 60-70% humidity",
        "Clean leaves weekly for optimal photosynthesis"
      ];
      recommendations.organic.steps = [
        "Use neem oil spray for pest prevention",
        "Apply compost-based fertilizer monthly",
        "Mist leaves regularly for humidity"
      ];
      recommendations.chemical.steps = [
        "Balanced liquid fertilizer (20-20-20) bi-weekly",
        "Systemic insecticide if pests detected"
      ];
    } else {
      // General plant care recommendations
      recommendations.immediate = [
        "Check soil moisture regularly",
        "Ensure proper drainage",
        "Monitor for pests and diseases",
        "Provide appropriate lighting for your plant species"
      ];
      recommendations.organic.steps = [
        "Use organic compost for fertilization",
        "Apply neem oil for natural pest control",
        "Maintain proper humidity levels",
        "Prune dead or damaged parts"
      ];
      recommendations.chemical.steps = [
        "Use balanced NPK fertilizer as needed",
        "Apply fungicide if disease symptoms appear",
        "Use appropriate pesticides for specific pest problems"
      ];
    }
  }

  // Add disease-specific recommendations
  if (healthAssessment?.suggestions?.length > 0) {
    healthAssessment.suggestions.forEach((disease: any) => {
      if (disease.details?.treatment) {
        const treatment = disease.details.treatment;
        if (treatment.biological) {
          recommendations.organic.steps.push(...treatment.biological);
        }
        if (treatment.chemical) {
          recommendations.chemical.steps.push(...treatment.chemical);
        }
        if (treatment.prevention) {
          recommendations.immediate.push(...treatment.prevention.slice(0, 2)); // Add first 2 prevention tips
        }
      }
    });
  }

  return recommendations;
}
