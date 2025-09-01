import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { PlantAnalysis } from "@shared/schema";

interface PlantAnalysisProps {
  analysis: PlantAnalysis | null;
}

export function PlantAnalysis({ analysis }: PlantAnalysisProps) {
  if (!analysis) {
    return (
      <div className="text-center py-16">
        <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Analysis</h3>
        <p className="text-muted-foreground">Upload a plant photo to get started</p>
      </div>
    );
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'issues detected':
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      default:
        return <XCircle className="w-6 h-6 text-destructive" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'bg-success/10 text-success';
      case 'issues detected':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-destructive/10 text-destructive';
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 fade-in">
      {/* Plant Identification Card */}
      <Card className="card-hover transition-all duration-300">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Plant Identification</CardTitle>
              <p className="text-muted-foreground">AI-powered species recognition</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-card-foreground" data-testid="text-plant-common-name">
              {analysis.commonName}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="text-plant-scientific-name">
              {analysis.scientificName}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <Progress value={(analysis.confidence || 0) * 100} className="flex-1" />
            <span className="text-sm font-medium text-success" data-testid="text-plant-confidence">
              {Math.round((analysis.confidence || 0) * 100)}%
            </span>
          </div>
          
          {analysis.imageUrl && (
            <div className="pt-4 border-t border-border">
              <img 
                src={analysis.imageUrl} 
                alt={analysis.commonName || 'Plant image'}
                className="w-full h-32 object-cover rounded-lg"
                data-testid="img-analyzed-plant"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Assessment Card */}
      <Card className="card-hover transition-all duration-300">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              {getHealthStatusIcon(analysis.healthStatus || 'unknown')}
            </div>
            <div>
              <CardTitle className="text-xl">Health Status</CardTitle>
              <p className="text-muted-foreground">Overall plant condition</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-card-foreground font-medium">Overall Health</span>
            <Badge className={getHealthStatusColor(analysis.healthStatus || 'unknown')} data-testid="badge-health-status">
              {analysis.healthStatus}
            </Badge>
          </div>
          
          {Array.isArray(analysis.healthIssues) && analysis.healthIssues.length > 0 && (
            <div className="space-y-3">
              {analysis.healthIssues.map((issue: any, index: number) => (
                <div key={index} className="flex items-start space-x-3" data-testid={`health-issue-${index}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    issue.probability > 0.7 ? 'bg-destructive' : 
                    issue.probability > 0.4 ? 'bg-warning' : 'bg-success'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {issue.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round(issue.probability * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Analyzed:</span>
              <span className="text-card-foreground" data-testid="text-analysis-date">
                {analysis.analysisDate ? new Date(analysis.analysisDate).toLocaleString() : 'Just now'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card className="card-hover transition-all duration-300">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl">Weather Insights</CardTitle>
              <p className="text-muted-foreground">Local conditions & care tips</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.weatherData ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current</span>
                <div className="text-right">
                  <p className="font-medium text-card-foreground" data-testid="text-weather-temp">
                    {Math.round((analysis.weatherData as any)?.main?.temp || 0)}°F
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-weather-condition">
                    {(analysis.weatherData as any)?.weather?.[0]?.description || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-chart-4/20 rounded"></div>
                  <span className="text-sm text-muted-foreground">Humidity:</span>
                  <span className="text-sm font-medium text-card-foreground" data-testid="text-weather-humidity">
                    {(analysis.weatherData as any)?.main?.humidity || 0}%
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Care Recommendation:</p>
                <p className="text-sm text-card-foreground" data-testid="text-weather-advice">
                  {generateWeatherAdvice(analysis.weatherData, analysis.commonName || 'your plant')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Weather data not available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Enable location services for personalized care tips
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function generateWeatherAdvice(weatherData: any, plantName: string): string {
  const temp = weatherData.main?.temp || 70;
  const humidity = weatherData.main?.humidity || 50;
  
  if (humidity > 70) {
    return `High humidity (${humidity}%) is great for tropical plants like ${plantName}. Ensure good air circulation.`;
  } else if (humidity < 40) {
    return `Low humidity (${humidity}%) detected. Consider misting ${plantName} or using a humidifier.`;
  } else {
    return `Current humidity (${humidity}%) is ideal for ${plantName}. Maintain regular watering schedule.`;
  }
}
