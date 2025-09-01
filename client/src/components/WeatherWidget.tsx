import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, MapPin, Thermometer, Droplets, Sun, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  compact?: boolean;
}

export function WeatherWidget({ compact = false }: WeatherWidgetProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationError('Location access denied');
        }
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  }, []);

  const { data: weatherData, isLoading, error } = useQuery<any>({
    queryKey: ['/api/weather', coordinates?.lat, coordinates?.lon],
    enabled: !!coordinates,
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  if (compact && (locationError || error || !weatherData)) {
    return null;
  }

  if (locationError || error) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <MapPin className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Weather unavailable</p>
        </div>
      </Card>
    );
  }

  if (isLoading || !coordinates) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <div className="pulse-loader w-6 h-6 bg-primary/20 rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading weather...</p>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weatherData.weather?.[0]?.main || '')}
            <span className="font-medium text-card-foreground" data-testid="text-compact-temp">
              {Math.round(weatherData.main?.temp || 0)}°F
            </span>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Humidity</p>
            <p className="font-medium text-card-foreground" data-testid="text-compact-humidity">
              {weatherData.main?.humidity || 0}%
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-hover transition-all duration-300">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
            {getWeatherIcon(weatherData.weather?.[0]?.main || '')}
          </div>
          <div>
            <CardTitle className="text-xl">Current Weather</CardTitle>
            <p className="text-muted-foreground">Local conditions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Thermometer className="w-6 h-6 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-card-foreground" data-testid="text-weather-temperature">
              {Math.round(weatherData.main?.temp || 0)}°F
            </p>
            <p className="text-sm text-muted-foreground">Temperature</p>
          </div>
          
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-card-foreground" data-testid="text-weather-humidity">
              {weatherData.main?.humidity || 0}%
            </p>
            <p className="text-sm text-muted-foreground">Humidity</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-center text-sm text-muted-foreground capitalize" data-testid="text-weather-description">
            {weatherData.weather?.[0]?.description || 'Unknown conditions'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
