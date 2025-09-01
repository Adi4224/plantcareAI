import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageAnalyzed: (analysis: any) => void;
}

export function ImageUpload({ onImageAnalyzed }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WEBP image file.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Get user's location for weather data
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            formData.append('latitude', position.coords.latitude.toString());
            formData.append('longitude', position.coords.longitude.toString());
          },
          (error) => {
            console.warn('Geolocation error:', error);
          }
        );
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/analyze-plant', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze plant');
      }

      const analysisData = await response.json();
      
      toast({
        title: "Analysis Complete",
        description: `Successfully identified: ${analysisData.commonName}`,
      });

      onImageAnalyzed(analysisData);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-upload"
      />
      
      {!isUploading ? (
        <Card 
          className={`upload-area border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer hover:border-primary ${
            isDragging ? 'drag-over border-primary bg-accent' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          data-testid="upload-area"
        >
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto text-6xl">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Upload Plant Photo
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP up to 5MB
              </p>
            </div>
            <Button className="inline-flex items-center" data-testid="button-choose-file">
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border border-border">
          <div className="flex items-center space-x-4 mb-4">
            <div className="pulse-loader w-8 h-8 bg-primary rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-foreground" data-testid="text-upload-status">
                Analyzing your plant...
              </p>
              <p className="text-sm text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          </div>
          <Progress value={uploadProgress} className="w-full" data-testid="progress-upload" />
        </Card>
      )}
    </div>
  );
}
