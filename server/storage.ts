import { type User, type InsertUser, type Product, type InsertProduct, type Request, type InsertRequest, type Suggestion, type InsertSuggestion } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  markProductAsSold(id: string): Promise<Product | undefined>;

  // Request methods
  getAllRequests(): Promise<Request[]>;
  getApprovedRequests(): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  approveRequest(id: string): Promise<Request | undefined>;
  deleteRequest(id: string): Promise<boolean>;

  // Suggestion methods
  getAllSuggestions(): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  deleteSuggestion(id: string): Promise<boolean>;

  // Statistics
  getStats(): Promise<{
    totalProducts: number;
    pendingRequests: number;
    activeSellers: number;
    totalValue: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private requests: Map<string, Request>;
  private suggestions: Map<string, Suggestion>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.requests = new Map();
    this.suggestions = new Map();

    // Add some sample data for testing
    this.seedData();
  }

  private seedData() {
    // Add sample products
    const sampleProducts: Product[] = [
      {
        id: randomUUID(),
        name: "Study Desk",
        description: "Perfect condition desk for studying with drawers",
        price: 250000, // ₹2,500
        originalPrice: 350000,
        category: "furniture",
        brand: "IKEA",
        technicalSpecs: "120cm x 60cm, wooden",
        condition: "good",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        sellerName: "Rahul Kumar",
        sellerPhone: "9876543210",
        priceNegotiable: true,
        deliveryAvailable: true,
        isSold: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Engineering Books Set",
        description: "Complete set for 3rd semester mechanical engineering",
        price: 120000, // ₹1,200
        originalPrice: 300000,
        category: "books",
        brand: "Various",
        technicalSpecs: "10 books, latest edition",
        condition: "like-new",
        images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        sellerName: "Priya Sharma",
        sellerPhone: "9876543211",
        priceNegotiable: false,
        deliveryAvailable: false,
        isSold: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Gaming Chair",
        description: "Ergonomic gaming chair with lumbar support",
        price: 800000, // ₹8,000
        originalPrice: 1200000,
        category: "furniture",
        brand: "DXRacer",
        technicalSpecs: "Adjustable height, 150kg capacity",
        condition: "good",
        images: ["https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        sellerName: "Amit Singh",
        sellerPhone: "9876543212",
        priceNegotiable: true,
        deliveryAvailable: true,
        isSold: false,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
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

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => !p.isSold);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      ...product,
      id,
      isSold: false,
      createdAt: new Date(),
      brand: product.brand || null,
      technicalSpecs: product.technicalSpecs || null,
      originalPrice: product.originalPrice || null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async markProductAsSold(id: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, isSold: true };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getAllRequests(): Promise<Request[]> {
    return Array.from(this.requests.values());
  }

  async getApprovedRequests(): Promise<Request[]> {
    return Array.from(this.requests.values()).filter(r => r.isApproved);
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const id = randomUUID();
    const newRequest: Request = {
      ...request,
      id,
      isApproved: false,
      createdAt: new Date(),
    };
    this.requests.set(id, newRequest);
    return newRequest;
  }

  async approveRequest(id: string): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, isApproved: true };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteRequest(id: string): Promise<boolean> {
    return this.requests.delete(id);
  }

  async getAllSuggestions(): Promise<Suggestion[]> {
    return Array.from(this.suggestions.values());
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    const id = randomUUID();
    const newSuggestion: Suggestion = {
      ...suggestion,
      id,
      createdAt: new Date(),
    };
    this.suggestions.set(id, newSuggestion);
    return newSuggestion;
  }

  async deleteSuggestion(id: string): Promise<boolean> {
    return this.suggestions.delete(id);
  }

  async getStats(): Promise<{
    totalProducts: number;
    pendingRequests: number;
    activeSellers: number;
    totalValue: number;
  }> {
    const products = Array.from(this.products.values()).filter(p => !p.isSold);
    const requests = Array.from(this.requests.values()).filter(r => !r.isApproved);
    const sellers = new Set(products.map(p => p.sellerPhone));
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    return {
      totalProducts: products.length,
      pendingRequests: requests.length,
      activeSellers: sellers.size,
      totalValue: totalValue,
    };
  }
}

export const storage = new MemStorage();
