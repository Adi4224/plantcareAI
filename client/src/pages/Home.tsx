import { useState } from "react";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantAnalysis } from "@/components/PlantAnalysis";
import { TreatmentRecommendations } from "@/components/TreatmentRecommendations";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, BookOpen, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PlantAnalysis as PlantAnalysisType } from "@shared/schema";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<PlantAnalysisType | null>(null);

  const handleImageAnalyzed = (analysis: PlantAnalysisType) => {
    setCurrentAnalysis(analysis);
    // Scroll to analysis results
    setTimeout(() => {
      document.getElementById('analysis-results')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                AI-Powered Plant
                <span className="text-primary block">Health Analysis</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Upload a photo of your plant to get instant identification, health assessment, 
                and personalized care recommendations powered by advanced AI technology.
              </p>
            </div>

            <ImageUpload onImageAnalyzed={handleImageAnalyzed} />
          </div>
        </section>

        {/* Analysis Results */}
        <section id="analysis-results" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Plant Analysis Results</h2>
              <p className="text-muted-foreground">Detailed insights about your plant's health and care needs</p>
            </div>

            <PlantAnalysis analysis={currentAnalysis} />
          </div>
        </section>

        {/* Treatment Recommendations */}
        {currentAnalysis && <TreatmentRecommendations analysis={currentAnalysis} />}

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Smart Garden?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Advanced AI technology combined with expert botanical knowledge to give your plants the best care
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Analysis</h3>
                  <p className="text-muted-foreground text-sm">
                    Get plant identification and health assessment in seconds with our advanced AI
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">94% Accuracy</h3>
                  <p className="text-muted-foreground text-sm">
                    Industry-leading plant identification accuracy backed by extensive botanical databases
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-chart-2/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-chart-2" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Expert Care Guide</h3>
                  <p className="text-muted-foreground text-sm">
                    Detailed treatment recommendations from certified plant care specialists
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-chart-4/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-chart-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Track Progress</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor your plant's health over time with detailed history and progress tracking
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Weather Widget Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <WeatherWidget />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 text-2xl">🌱</div>
                <h3 className="text-lg font-bold text-primary">Smart Garden</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                AI-powered plant identification and health analysis for smarter gardening.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Plant Identification</li>
                <li>Health Analysis</li>
                <li>Care Recommendations</li>
                <li>Weather Integration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>API Documentation</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get plant care tips and updates delivered to your inbox.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="text-sm"
                  data-testid="input-newsletter-email"
                />
                <Button size="sm" data-testid="button-newsletter-subscribe">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Smart Garden. All rights reserved. Powered by Plant.id API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
