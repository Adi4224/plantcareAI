export interface PlantIdIdentificationRequest {
  images: string[];
  modifiers: string[];
  plant_language: string;
  plant_details: string[];
}

export interface PlantIdHealthRequest {
  images: string[];
  modifiers: string[];
  disease_details: string[];
}

export interface PlantIdSuggestion {
  plant_name: string;
  plant_details: {
    common_names: string[];
    scientific_name: string;
    structured_name: {
      genus: string;
      species: string;
    };
    url: string;
    wiki_description?: {
      value: string;
      citation: string;
    };
  };
  probability: number;
}

export interface PlantIdIdentificationResponse {
  suggestions: PlantIdSuggestion[];
  is_plant: {
    probability: number;
    binary: boolean;
  };
}

export interface PlantIdHealthResponse {
  health_assessment: {
    is_healthy: {
      probability: number;
      binary: boolean;
    };
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

class PlantIdApiService {
  private apiKey: string;
  private baseUrl = 'https://api.plant.id/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async identifyPlant(base64Image: string): Promise<PlantIdIdentificationResponse> {
    const response = await fetch(`${this.baseUrl}/identification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        images: [base64Image],
        modifiers: ['crops_fast', 'similar_images'],
        plant_language: 'en',
        plant_details: [
          'common_names',
          'url',
          'name_authority',
          'wiki_description',
          'taxonomy'
        ],
      } as PlantIdIdentificationRequest),
    });

    if (!response.ok) {
      throw new Error(`Plant identification failed: ${response.status}`);
    }

    return response.json();
  }

  async assessHealth(base64Image: string): Promise<PlantIdHealthResponse> {
    const response = await fetch(`${this.baseUrl}/health_assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        images: [base64Image],
        modifiers: ['crops_fast', 'similar_images'],
        disease_details: ['description', 'treatment'],
      } as PlantIdHealthRequest),
    });

    if (!response.ok) {
      throw new Error(`Health assessment failed: ${response.status}`);
    }

    return response.json();
  }
}

export default PlantIdApiService;
