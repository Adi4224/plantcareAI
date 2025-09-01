import { type User, type InsertUser, type PlantAnalysis, type InsertPlantAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPlantAnalysis(id: string): Promise<PlantAnalysis | undefined>;
  getAllPlantAnalyses(): Promise<PlantAnalysis[]>;
  createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis>;
  deletePlantAnalysis(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plantAnalyses: Map<string, PlantAnalysis>;

  constructor() {
    this.users = new Map();
    this.plantAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPlantAnalysis(id: string): Promise<PlantAnalysis | undefined> {
    return this.plantAnalyses.get(id);
  }

  async getAllPlantAnalyses(): Promise<PlantAnalysis[]> {
    return Array.from(this.plantAnalyses.values()).sort(
      (a, b) => new Date(b.analysisDate!).getTime() - new Date(a.analysisDate!).getTime()
    );
  }

  async createPlantAnalysis(insertAnalysis: InsertPlantAnalysis): Promise<PlantAnalysis> {
    const id = randomUUID();
    const analysis: PlantAnalysis = {
      id,
      imageUrl: insertAnalysis.imageUrl,
      commonName: insertAnalysis.commonName ?? null,
      scientificName: insertAnalysis.scientificName ?? null,
      confidence: insertAnalysis.confidence ?? null,
      healthStatus: insertAnalysis.healthStatus ?? null,
      healthIssues: insertAnalysis.healthIssues ?? null,
      treatmentRecommendations: insertAnalysis.treatmentRecommendations ?? null,
      weatherData: insertAnalysis.weatherData ?? null,
      analysisDate: new Date(),
      userId: insertAnalysis.userId ?? null,
    };
    this.plantAnalyses.set(id, analysis);
    return analysis;
  }

  async deletePlantAnalysis(id: string): Promise<boolean> {
    return this.plantAnalyses.delete(id);
  }
}

export const storage = new MemStorage();
