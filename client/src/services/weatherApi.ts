export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherForecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

class WeatherApiService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  async getForecast(lat: number, lon: number): Promise<WeatherForecast> {
    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`Weather forecast error: ${response.status}`);
    }

    return response.json();
  }

  generateCareAdvice(weatherData: WeatherData, plantType?: string): string {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0]?.main.toLowerCase();
    
    if (condition.includes('rain')) {
      return "Rainy conditions mean reduced watering needs. Check soil moisture before next watering.";
    }
    
    if (temp > 85) {
      return "High temperatures detected. Increase watering frequency and provide shade during peak hours.";
    }
    
    if (temp < 50) {
      return "Cool weather slows plant growth. Reduce watering and bring sensitive plants indoors.";
    }
    
    if (humidity < 30) {
      return "Low humidity can stress plants. Consider grouping plants together or using a humidifier.";
    }
    
    if (humidity > 80) {
      return "High humidity is great for tropical plants but ensure good air circulation to prevent fungal issues.";
    }
    
    return "Current weather conditions are favorable for plant growth. Maintain regular care routine.";
  }
}

export default WeatherApiService;
