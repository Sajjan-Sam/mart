import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertRequestSchema, insertSuggestionSchema } from "@shared/schema";
import { z } from "zod";

const adminPassword = "iiserhostel2025";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Requests routes
  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await storage.getApprovedRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const requestData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create request" });
      }
    }
  });

  // Suggestions routes
  app.post("/api/suggestions", async (req, res) => {
    try {
      const suggestionData = insertSuggestionSchema.parse(req.body);
      const suggestion = await storage.createSuggestion(suggestionData);
      res.status(201).json(suggestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid suggestion data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create suggestion" });
      }
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === adminPassword) {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin routes
  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = Array.from((await storage.getAllProducts()));
      // Also include sold products for admin
      const allProducts = await Promise.all(
        Array.from((storage as any).products.values())
      );
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/requests", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/admin/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAllSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.patch("/api/admin/products/:id/sold", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.markProductAsSold(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark product as sold" });
    }
  });

  app.patch("/api/admin/requests/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.approveRequest(id);
      if (request) {
        res.json(request);
      } else {
        res.status(404).json({ message: "Request not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to approve request" });
    }
  });

  app.delete("/api/admin/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSuggestion(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Suggestion not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete suggestion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
