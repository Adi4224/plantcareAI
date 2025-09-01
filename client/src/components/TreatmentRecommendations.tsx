import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Beaker, Clock } from "lucide-react";
import type { PlantAnalysis } from "@shared/schema";

interface TreatmentRecommendationsProps {
  analysis: PlantAnalysis | null;
}

export function TreatmentRecommendations({ analysis }: TreatmentRecommendationsProps) {
  if (!analysis || !analysis.treatmentRecommendations) {
    return null;
  }

  const recommendations = analysis.treatmentRecommendations as any;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Treatment Recommendations</h2>
          <p className="text-muted-foreground">Personalized care instructions for optimal plant health</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Care Instructions */}
          <Card className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl">Immediate Care Steps</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {recommendations.immediate && recommendations.immediate.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.immediate.map((step: string, index: number) => (
                    <div key={index} className="flex space-x-4" data-testid={`care-step-${index}`}>
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-card-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Monitor Water Levels</h4>
                      <p className="text-muted-foreground">
                        Check soil moisture regularly and adjust watering schedule based on plant needs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Optimize Light Exposure</h4>
                      <p className="text-muted-foreground">
                        Ensure your plant receives appropriate light levels for its species requirements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Maintain Proper Environment</h4>
                      <p className="text-muted-foreground">
                        Keep temperature and humidity levels within the optimal range for healthy growth.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Treatment Options */}
          <Card className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl">Treatment Options</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              {/* Organic Treatment */}
              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-success" />
                  </div>
                  <h4 className="text-lg font-medium text-card-foreground">Organic Treatment</h4>
                  <Badge className="bg-success/10 text-success" data-testid="badge-organic-recommended">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4" data-testid="text-organic-description">
                  {recommendations.organic?.description || "Use natural, eco-friendly treatments to maintain plant health safely."}
                </p>
                {recommendations.organic?.steps && recommendations.organic.steps.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    {recommendations.organic.steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-success">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground" data-testid="text-organic-timeline">
                    {recommendations.organic?.timeline || "2-4 weeks for improvement"}
                  </span>
                </div>
              </div>
              
              {/* Chemical Treatment */}
              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Beaker className="w-5 h-5 text-warning" />
                  </div>
                  <h4 className="text-lg font-medium text-card-foreground">Chemical Treatment</h4>
                  <Badge variant="secondary" data-testid="badge-chemical-ifneeded">
                    If needed
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4" data-testid="text-chemical-description">
                  {recommendations.chemical?.description || "Fast-acting synthetic treatments for severe plant health issues."}
                </p>
                {recommendations.chemical?.steps && recommendations.chemical.steps.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    {recommendations.chemical.steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-warning">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground" data-testid="text-chemical-timeline">
                    {recommendations.chemical?.timeline || "1-2 weeks for improvement"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
