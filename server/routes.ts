import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertInventoryItemSchema,
  insertInventoryActivitySchema,
  insertMenuItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertStaffSchema,
  insertStaffShiftSchema,
  insertStaffPerformanceSchema,
  insertEventSchema,
  insertCustomerSchema,
  insertReservationSchema,
  insertFinancialTransactionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const dailySales = await storage.getDailySales();
      const lowStockItems = await storage.getLowStockItems();
      
      // For now using mock data for customers count, will be implemented when customers are tracked
      const customersToday = 237;
      
      res.json({
        dailySales,
        customersToday,
        lowStockCount: lowStockItems.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/sales-performance", async (req, res) => {
    try {
      const period = req.query.period as 'day' | 'week' | 'month' | 'year' || 'week';
      const salesData = await storage.getSalesByPeriod(period);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales performance data" });
    }
  });

  app.get("/api/dashboard/popular-items", async (req, res) => {
    try {
      // In a real implementation, this would use order data to calculate popularity
      // For now returning the menu items as popular items
      const menuItems = await storage.getMenuItems();
      const popularItems = menuItems.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        soldToday: Math.floor(Math.random() * 150) + 50, // Mock data for now
        price: item.price
      }));
      res.json(popularItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular items" });
    }
  });

  app.get("/api/dashboard/recent-transactions", async (req, res) => {
    try {
      const recentOrders = await storage.getRecentOrders(5);
      const staffMembers = await storage.getStaffMembers();
      
      const transactions = recentOrders.map(order => {
        const bartender = staffMembers.find(staff => staff.id === order.bartenderId);
        return {
          id: order.id,
          transactionId: `#TRX-${4000 + order.id}`,
          time: order.createdAt,
          amount: order.totalAmount,
          status: order.status,
          bartender: bartender ? bartender.name.split(' ')[0] + ' ' + bartender.name.split(' ')[1].charAt(0) + '.' : 'Unknown'
        };
      });
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });

  app.get("/api/dashboard/upcoming-events", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents(3);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  // Inventory routes
  app.get("/api/inventory/items", async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getInventoryItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory/items", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInventoryItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const lowStockItems = await storage.getLowStockItems();
      res.json(lowStockItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  app.get("/api/inventory/activities", async (req, res) => {
    try {
      const activities = await storage.getInventoryActivities();
      
      // Get staff member information
      const staffMembers = await storage.getStaffMembers();
      
      // Get inventory items for activity context
      const inventoryItems = await storage.getInventoryItems();
      
      const enrichedActivities = activities.map(activity => {
        const staff = staffMembers.find(s => s.id === activity.performedBy);
        const item = inventoryItems.find(i => i.id === activity.itemId);
        
        return {
          ...activity,
          staffName: staff ? staff.name : 'Unknown',
          itemName: item ? item.name : 'Unknown'
        };
      });
      
      res.json(enrichedActivities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory activities" });
    }
  });

  app.post("/api/inventory/activities", async (req, res) => {
    try {
      const validatedData = insertInventoryActivitySchema.parse(req.body);
      const newActivity = await storage.createInventoryActivity(validatedData);
      
      // If it's a restock or remove activity, update the inventory item stock level
      if ((validatedData.action === 'restock' || validatedData.action === 'remove') && validatedData.quantity) {
        const item = await storage.getInventoryItem(validatedData.itemId);
        if (item) {
          const newStock = validatedData.action === 'restock' 
            ? item.stock + validatedData.quantity 
            : item.stock - validatedData.quantity;
          
          await storage.updateInventoryItem(item.id, { stock: newStock });
        }
      }
      
      res.status(201).json(newActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory activity" });
    }
  });

  // Menu and POS routes
  app.get("/api/menu/items", async (req, res) => {
    try {
      const category = req.query.category as string;
      let items;
      
      if (category && category !== 'all') {
        items = await storage.getMenuItemsByCategory(category);
      } else {
        items = await storage.getMenuItems();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/menu/items", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const newItem = await storage.createMenuItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.put("/api/menu/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMenuItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateMenuItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(orderData);
      
      // If order items are included, create them
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const orderItemData = {
            orderId: newOrder.id,
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          };
          await storage.createOrderItem(orderItemData);
        }
      }

      // Add to financial transactions
      if (newOrder.status === 'completed') {
        await storage.createFinancialTransaction({
          transactionType: "income",
          amount: newOrder.grandTotal,
          description: `Order #${newOrder.id}`,
          category: "sales",
          paymentMethod: "card",
          relatedOrderId: newOrder.id
        });
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const orderItems = await storage.getOrderItems(orderId);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staffMembers = await storage.getStaffMembers();
      
      // Get performance data for each staff member
      const staffPerformance = await storage.getStaffPerformance();
      
      const enrichedStaff = staffMembers.map(member => {
        const performance = staffPerformance.find(p => p.staffId === member.id);
        
        // Calculate hours this week
        let hoursThisWeek = 0;
        if (performance) {
          hoursThisWeek = performance.hoursWorked;
        }
        
        return {
          ...member,
          hoursThisWeek,
          avgRating: performance ? performance.customerRating : 0
        };
      });
      
      res.json(enrichedStaff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff members" });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getStaffMember(id);
      
      if (!member) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      // Get performance data
      const performances = await storage.getStaffPerformanceByStaffId(id);
      const performance = performances.length > 0 ? performances[0] : null;
      
      // Get shifts
      const shifts = await storage.getStaffShiftsByStaffId(id);
      
      const staffData = {
        ...member,
        performance,
        shifts
      };
      
      res.json(staffData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff member" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const validatedData = insertStaffSchema.parse(req.body);
      const newMember = await storage.createStaffMember(validatedData);
      res.status(201).json(newMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertStaffSchema.partial().parse(req.body);
      const updatedMember = await storage.updateStaffMember(id, validatedData);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(updatedMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update staff member" });
    }
  });

  app.get("/api/staff/shifts", async (req, res) => {
    try {
      const shifts = await storage.getStaffShifts();
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff shifts" });
    }
  });

  app.post("/api/staff/shifts", async (req, res) => {
    try {
      const validatedData = insertStaffShiftSchema.parse(req.body);
      const newShift = await storage.createStaffShift(validatedData);
      res.status(201).json(newShift);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shift data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create staff shift" });
    }
  });

  app.get("/api/staff/performance/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topPerformers = await storage.getTopPerformers(limit);
      res.json(topPerformers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top performers" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, validatedData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // Financial routes
  app.get("/api/finances/transactions", async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial transactions" });
    }
  });

  app.post("/api/finances/transactions", async (req, res) => {
    try {
      const validatedData = insertFinancialTransactionSchema.parse(req.body);
      const newTransaction = await storage.createFinancialTransaction(validatedData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create financial transaction" });
    }
  });

  app.get("/api/finances/expenses-by-category", async (req, res) => {
    try {
      const expenses = await storage.getExpensesByCategory();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses by category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
