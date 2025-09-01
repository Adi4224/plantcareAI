import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { PlantAnalysis } from "@/components/PlantAnalysis";
import { TreatmentRecommendations } from "@/components/TreatmentRecommendations";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share } from "lucide-react";
import { Link } from "wouter";
import type { PlantAnalysis as PlantAnalysisType } from "@shared/schema";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();

  const { data: analysis, isLoading, error } = useQuery<PlantAnalysisType>({
    queryKey: ['/api/plant-analyses', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="pulse-loader w-8 h-8 bg-primary rounded-full"></div>
            <span className="ml-4 text-muted-foreground">Loading analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested plant analysis could not be found.
            </p>
            <Link href="/history">
              <Button data-testid="button-back-to-history">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PlantCare AI - ${analysis.commonName}`,
          text: `Check out my ${analysis.commonName} plant analysis from PlantCare AI!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Header Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/history">
                <Button variant="outline" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleShare} data-testid="button-share">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" data-testid="button-download">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {analysis.commonName}
              </h1>
              {analysis.scientificName && (
                <p className="text-lg text-muted-foreground italic">
                  {analysis.scientificName}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Analysis Results */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PlantAnalysis analysis={analysis} />
          </div>
        </section>

        {/* Treatment Recommendations */}
        <TreatmentRecommendations analysis={analysis} />

        {/* Weather Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <WeatherWidget />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
