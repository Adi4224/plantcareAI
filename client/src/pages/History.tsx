import { Header } from "@/components/Header";
import { PlantHistory } from "@/components/PlantHistory";

export default function History() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Plant History</h1>
            <p className="text-muted-foreground">Your previously analyzed plants and their care progress</p>
          </div>
          
          <PlantHistory />
        </div>
      </main>
    </div>
  );
}
