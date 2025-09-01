import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { PlantAnalysis } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function PlantHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: plantHistory = [], isLoading } = useQuery<PlantAnalysis[]>({
    queryKey: ['/api/plant-analyses'],
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', '/api/plant-analyses'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plant-analyses'] });
      toast({
        title: "History Cleared",
        description: "All plant analysis history has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/plant-analyses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plant-analyses'] });
      toast({
        title: "Plant Removed",
        description: "Plant analysis has been deleted from history",
      });
    },
  });

  const getHealthStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'bg-success/10 text-success';
      case 'issues detected':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-destructive/10 text-destructive';
    }
  };

  const filteredHistory = plantHistory.filter(plant => 
    plant.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="w-full h-48 bg-muted animate-pulse"></div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-plants"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => clearHistoryMutation.mutate()}
          disabled={clearHistoryMutation.isPending || plantHistory.length === 0}
          data-testid="button-clear-history"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </Button>
      </div>

      {/* Plant History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 text-4xl">🌿</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm ? 'No matching plants found' : 'No plant history yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Upload your first plant photo to get started with AI analysis'
            }
          </p>
          {!searchTerm && (
            <Link href="/">
              <Button data-testid="button-start-analysis">
                Start Plant Analysis
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((plant) => (
            <Card 
              key={plant.id} 
              className="card-hover overflow-hidden transition-all duration-300"
              data-testid={`plant-card-${plant.id}`}
            >
              {plant.imageUrl && (
                <img 
                  src={plant.imageUrl}
                  alt={plant.commonName || 'Plant image'}
                  className="w-full h-48 object-cover"
                  data-testid={`img-plant-${plant.id}`}
                />
              )}
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-card-foreground truncate" data-testid={`text-plant-name-${plant.id}`}>
                    {plant.commonName || 'Unknown Plant'}
                  </h3>
                  <Badge 
                    className={getHealthStatusColor(plant.healthStatus || 'unknown')}
                    data-testid={`badge-health-${plant.id}`}
                  >
                    {plant.healthStatus || 'Unknown'}
                  </Badge>
                </div>
                
                {plant.scientificName && (
                  <p className="text-sm text-muted-foreground italic mb-3" data-testid={`text-scientific-name-${plant.id}`}>
                    {plant.scientificName}
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground mb-4" data-testid={`text-analysis-date-${plant.id}`}>
                  Analyzed {plant.analysisDate ? new Date(plant.analysisDate).toLocaleDateString() : 'Unknown date'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground" data-testid={`text-confidence-${plant.id}`}>
                      {plant.confidence ? `${Math.round(plant.confidence * 100)}% match` : 'Unknown confidence'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link href={`/analysis/${plant.id}`}>
                      <Button size="sm" variant="outline" data-testid={`button-view-details-${plant.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePlantMutation.mutate(plant.id)}
                      disabled={deletePlantMutation.isPending}
                      data-testid={`button-delete-${plant.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
