import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const plantAnalyses = pgTable("plant_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  commonName: text("common_name"),
  scientificName: text("scientific_name"),
  confidence: real("confidence"),
  healthStatus: text("health_status"),
  healthIssues: jsonb("health_issues"),
  treatmentRecommendations: jsonb("treatment_recommendations"),
  weatherData: jsonb("weather_data"),
  analysisDate: timestamp("analysis_date").defaultNow(),
  userId: varchar("user_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlantAnalysisSchema = createInsertSchema(plantAnalyses).omit({
  id: true,
  analysisDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PlantAnalysis = typeof plantAnalyses.$inferSelect;
export type InsertPlantAnalysis = z.infer<typeof insertPlantAnalysisSchema>;

// Additional types for API responses
export interface PlantIdResponse {
  suggestions: Array<{
    plant_name: string;
    plant_details: {
      common_names: string[];
      scientific_name: string;
    };
    probability: number;
  }>;
}

export interface PlantHealthResponse {
  health_assessment: {
    is_healthy: boolean;
    diseases: Array<{
      name: string;
      probability: number;
      disease_details: {
        description: string;
        treatment: {
          biological: string[];
          chemical: string[];
          prevention: string[];
        };
      };
    }>;
  };
}

export interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  uv?: number;
}
