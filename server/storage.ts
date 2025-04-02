import { 
  type User, type InsertUser, users,
  type InventoryItem, type InsertInventoryItem, inventoryItems,
  type InventoryActivity, type InsertInventoryActivity, inventoryActivities,
  type MenuItem, type InsertMenuItem, menuItems,
  type Order, type InsertOrder, orders,
  type OrderItem, type InsertOrderItem, orderItems,
  type Staff, type InsertStaff, staff,
  type StaffShift, type InsertStaffShift, staffShifts,
  type StaffPerformance, type InsertStaffPerformance, staffPerformance,
  type Event, type InsertEvent, events,
  type Customer, type InsertCustomer, customers,
  type Reservation, type InsertReservation, reservations,
  type FinancialTransaction, type InsertFinancialTransaction, financialTransactions
} from "@shared/schema";

// Storage interface for all entity operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Inventory operations
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  getLowStockItems(): Promise<InventoryItem[]>;

  // Inventory activity operations
  getInventoryActivities(): Promise<InventoryActivity[]>;
  createInventoryActivity(activity: InsertInventoryActivity): Promise<InventoryActivity>;

  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  getRecentOrders(limit: number): Promise<Order[]>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Staff operations
  getStaffMembers(): Promise<Staff[]>;
  getStaffMember(id: number): Promise<Staff | undefined>;
  createStaffMember(member: InsertStaff): Promise<Staff>;
  updateStaffMember(id: number, member: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaffMember(id: number): Promise<boolean>;

  // Staff shift operations
  getStaffShifts(): Promise<StaffShift[]>;
  getStaffShiftsByStaffId(staffId: number): Promise<StaffShift[]>;
  createStaffShift(shift: InsertStaffShift): Promise<StaffShift>;
  updateStaffShift(id: number, shift: Partial<InsertStaffShift>): Promise<StaffShift | undefined>;
  deleteStaffShift(id: number): Promise<boolean>;

  // Staff performance operations
  getStaffPerformance(): Promise<StaffPerformance[]>;
  getStaffPerformanceByStaffId(staffId: number): Promise<StaffPerformance[]>;
  createStaffPerformance(performance: InsertStaffPerformance): Promise<StaffPerformance>;
  getTopPerformers(limit: number): Promise<any[]>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  getUpcomingEvents(limit: number): Promise<Event[]>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getVipCustomers(): Promise<Customer[]>;

  // Reservation operations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
  getUpcomingReservations(limit: number): Promise<Reservation[]>;

  // Financial operations
  getFinancialTransactions(): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  getDailySales(): Promise<number>;
  getSalesByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<any[]>;
  getExpensesByCategory(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inventoryItems: Map<number, InventoryItem>;
  private inventoryActivities: Map<number, InventoryActivity>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private staffMembers: Map<number, Staff>;
  private staffShifts: Map<number, StaffShift>;
  private staffPerformance: Map<number, StaffPerformance>;
  private events: Map<number, Event>;
  private customers: Map<number, Customer>;
  private reservations: Map<number, Reservation>;
  private financialTransactions: Map<number, FinancialTransaction>;
  
  // Auto-increment tracking
  private currentIds: {
    user: number;
    inventoryItem: number;
    inventoryActivity: number;
    menuItem: number;
    order: number;
    orderItem: number;
    staff: number;
    staffShift: number;
    staffPerformance: number;
    event: number;
    customer: number;
    reservation: number;
    financialTransaction: number;
  };

  constructor() {
    this.users = new Map();
    this.inventoryItems = new Map();
    this.inventoryActivities = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.staffMembers = new Map();
    this.staffShifts = new Map();
    this.staffPerformance = new Map();
    this.events = new Map();
    this.customers = new Map();
    this.reservations = new Map();
    this.financialTransactions = new Map();
    
    this.currentIds = {
      user: 1,
      inventoryItem: 1,
      inventoryActivity: 1,
      menuItem: 1,
      order: 1,
      orderItem: 1,
      staff: 1,
      staffShift: 1,
      staffPerformance: 1,
      event: 1,
      customer: 1,
      reservation: 1,
      financialTransaction: 1
    };

    this.initializeData();
  }

  // Initialize demo data
  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "password",
      fullName: "Admin User",
      role: "admin",
      email: "admin@nightlifepro.com",
      phone: "555-123-4567",
      avatar: ""
    });

    // Create sample menu items
    const menuItemsData: InsertMenuItem[] = [
      { name: "Signature Mojito", category: "cocktails", price: 12, description: "Fresh mint, rum, lime juice and soda", ingredients: ["rum", "mint", "lime", "sugar", "soda"] },
      { name: "Premium Vodka (Neat)", category: "spirits", price: 15, description: "Premium vodka served neat", ingredients: ["vodka"] },
      { name: "Craft Beer", category: "beer", price: 8, description: "Locally brewed craft beer", ingredients: ["beer"] },
      { name: "House Wine (Glass)", category: "wine", price: 10, description: "Selection of red or white house wine", ingredients: ["wine"] },
      { name: "Whiskey Sour", category: "cocktails", price: 14, description: "Whiskey, lemon juice, sugar, and egg white", ingredients: ["whiskey", "lemon", "sugar", "egg white"] },
      { name: "Margarita", category: "cocktails", price: 12, description: "Tequila, triple sec, and lime juice", ingredients: ["tequila", "triple sec", "lime"] },
      { name: "Gin & Tonic", category: "cocktails", price: 11, description: "Gin and tonic water with lime", ingredients: ["gin", "tonic", "lime"] },
      { name: "Tequila Shot", category: "spirits", price: 7, description: "Shot of tequila with lime and salt", ingredients: ["tequila", "lime", "salt"] }
    ];

    menuItemsData.forEach(item => this.createMenuItem(item));

    // Create sample inventory items
    const inventoryItemsData: InsertInventoryItem[] = [
      { name: "Premium Vodka", category: "spirits", stock: 24, minLevel: 10, price: 32.50, unitType: "bottle" },
      { name: "Gin", category: "spirits", stock: 18, minLevel: 8, price: 28.75, unitType: "bottle" },
      { name: "White Rum", category: "spirits", stock: 9, minLevel: 10, price: 22.00, unitType: "bottle" },
      { name: "Tequila", category: "spirits", stock: 5, minLevel: 8, price: 42.00, unitType: "bottle" },
      { name: "Craft Beer", category: "beer", stock: 42, minLevel: 20, price: 6.50, unitType: "bottle" },
      { name: "House Wine Red", category: "wine", stock: 15, minLevel: 6, price: 18.00, unitType: "bottle" },
      { name: "House Wine White", category: "wine", stock: 2, minLevel: 6, price: 18.00, unitType: "bottle" },
      { name: "Triple Sec", category: "spirits", stock: 4, minLevel: 4, price: 16.50, unitType: "bottle" },
      { name: "Mint Leaves", category: "supplies", stock: 3, minLevel: 5, price: 3.50, unitType: "bunch" },
      { name: "Limes", category: "supplies", stock: 22, minLevel: 15, price: 0.50, unitType: "piece" },
      { name: "Simple Syrup", category: "supplies", stock: 6, minLevel: 5, price: 5.00, unitType: "bottle" },
      { name: "Whiskey", category: "spirits", stock: 16, minLevel: 8, price: 38.00, unitType: "bottle" }
    ];

    inventoryItemsData.forEach(item => {
      // Set status based on stock level
      if (item.stock <= item.minLevel / 2) {
        item = { ...item, status: "low" };
      }
      this.createInventoryItem(item);
    });

    // Create sample staff members
    const staffMembersData: InsertStaff[] = [
      { name: "Jake Thompson", role: "Bartender", status: "active", email: "jake@nightlifepro.com", phone: "555-111-2222", emergencyContact: "555-111-3333", employeeId: "EMP-1001", hourlyRate: 18.50 },
      { name: "Maria Rodriguez", role: "Bartender", status: "active", email: "maria@nightlifepro.com", phone: "555-222-3333", emergencyContact: "555-222-4444", employeeId: "EMP-1002", hourlyRate: 19.00 },
      { name: "David Kim", role: "Security", status: "active", email: "david@nightlifepro.com", phone: "555-333-4444", emergencyContact: "555-333-5555", employeeId: "EMP-1003", hourlyRate: 20.00 },
      { name: "Sarah Johnson", role: "Server", status: "active", email: "sarah@nightlifepro.com", phone: "555-444-5555", emergencyContact: "555-444-6666", employeeId: "EMP-1004", hourlyRate: 16.00 },
      { name: "Michael Chen", role: "Bartender", status: "off", email: "michael@nightlifepro.com", phone: "555-555-6666", emergencyContact: "555-555-7777", employeeId: "EMP-1005", hourlyRate: 19.50 },
      { name: "Jessica Williams", role: "Server", status: "active", email: "jessica@nightlifepro.com", phone: "555-666-7777", emergencyContact: "555-666-8888", employeeId: "EMP-1006", hourlyRate: 16.50 },
      { name: "Robert Garcia", role: "Security", status: "active", email: "robert@nightlifepro.com", phone: "555-777-8888", emergencyContact: "555-777-9999", employeeId: "EMP-1007", hourlyRate: 21.00 },
      { name: "Emily Davis", role: "Manager", status: "active", email: "emily@nightlifepro.com", phone: "555-888-9999", emergencyContact: "555-888-0000", employeeId: "EMP-1008", hourlyRate: 25.00 }
    ];

    staffMembersData.forEach(member => this.createStaffMember(member));

    // Create staff shifts
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const shifts = ["6 PM - 2 AM", "8 PM - 4 AM", "10 PM - 6 AM"];
    
    const staffShiftsData = [
      // Monday
      { staffId: 1, day: "Monday", shift: shifts[0] },
      { staffId: 2, day: "Monday", shift: shifts[0] },
      { staffId: 3, day: "Monday", shift: shifts[1] },
      { staffId: 5, day: "Monday", shift: shifts[1] },
      // Tuesday
      { staffId: 4, day: "Tuesday", shift: shifts[0] },
      { staffId: 6, day: "Tuesday", shift: shifts[0] },
      { staffId: 7, day: "Tuesday", shift: shifts[1] },
      // Wednesday
      { staffId: 1, day: "Wednesday", shift: shifts[0] },
      { staffId: 2, day: "Wednesday", shift: shifts[0] },
      { staffId: 3, day: "Wednesday", shift: shifts[1] },
      // Thursday
      { staffId: 2, day: "Thursday", shift: shifts[1] },
      { staffId: 4, day: "Thursday", shift: shifts[0] },
      { staffId: 5, day: "Thursday", shift: shifts[0] },
      { staffId: 7, day: "Thursday", shift: shifts[1] },
      // Friday
      { staffId: 1, day: "Friday", shift: shifts[0] },
      { staffId: 2, day: "Friday", shift: shifts[1] },
      { staffId: 3, day: "Friday", shift: shifts[1] },
      { staffId: 4, day: "Friday", shift: shifts[0] },
      { staffId: 6, day: "Friday", shift: shifts[1] },
      { staffId: 7, day: "Friday", shift: shifts[2] },
      // Saturday
      { staffId: 1, day: "Saturday", shift: shifts[1] },
      { staffId: 2, day: "Saturday", shift: shifts[1] },
      { staffId: 3, day: "Saturday", shift: shifts[2] },
      { staffId: 5, day: "Saturday", shift: shifts[1] },
      { staffId: 6, day: "Saturday", shift: shifts[1] },
      { staffId: 7, day: "Saturday", shift: shifts[2] },
      // Sunday
      { staffId: 4, day: "Sunday", shift: shifts[0] },
      { staffId: 5, day: "Sunday", shift: shifts[0] },
      { staffId: 7, day: "Sunday", shift: shifts[1] }
    ];

    staffShiftsData.forEach(shift => this.createStaffShift(shift));

    // Create staff performance data
    const staffPerformanceData: InsertStaffPerformance[] = [
      { staffId: 1, salesAmount: 2120, tipsEarned: 420, customerRating: 4.8, incidents: 0, hoursWorked: 32 },
      { staffId: 2, salesAmount: 1980, tipsEarned: 395, customerRating: 4.6, incidents: 0, hoursWorked: 36 },
      { staffId: 3, salesAmount: 0, tipsEarned: 0, customerRating: 4.7, incidents: 0, hoursWorked: 40 },
      { staffId: 4, salesAmount: 1540, tipsEarned: 320, customerRating: 4.5, incidents: 0, hoursWorked: 28 },
      { staffId: 5, salesAmount: 2456, tipsEarned: 510, customerRating: 4.9, incidents: 0, hoursWorked: 20 },
      { staffId: 6, salesAmount: 1320, tipsEarned: 275, customerRating: 4.3, incidents: 0, hoursWorked: 30 },
      { staffId: 7, salesAmount: 0, tipsEarned: 0, customerRating: 4.6, incidents: 1, hoursWorked: 40 },
      { staffId: 8, salesAmount: 0, tipsEarned: 0, customerRating: 4.7, incidents: 0, hoursWorked: 45 }
    ];

    staffPerformanceData.forEach(performance => this.createStaffPerformance(performance));

    // Create upcoming events
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const friday = new Date(now);
    friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
    const saturday = new Date(friday);
    saturday.setDate(friday.getDate() + 1);

    const eventsData: InsertEvent[] = [
      { 
        name: "DJ Night - Mark Johnson", 
        description: "Join us for an unforgettable night with DJ Mark Johnson spinning the latest hits", 
        date: tomorrow, 
        startTime: "9:00 PM", 
        endTime: "2:00 AM", 
        performer: "Mark Johnson", 
        eventType: "DJ Set", 
        rsvpCount: 63, 
        status: "upcoming" 
      },
      { 
        name: "Live Band - The Locals", 
        description: "Local band performing original music and popular covers", 
        date: friday, 
        startTime: "10:00 PM", 
        endTime: "1:00 AM", 
        performer: "The Locals", 
        eventType: "Live Music", 
        rsvpCount: 42, 
        status: "upcoming" 
      },
      { 
        name: "Cocktail Masterclass", 
        description: "Learn how to make signature cocktails with our expert bartenders", 
        date: saturday, 
        startTime: "6:00 PM", 
        endTime: "8:00 PM", 
        performer: "Jake Thompson", 
        eventType: "Workshop", 
        rsvpCount: 18, 
        status: "upcoming" 
      }
    ];

    eventsData.forEach(event => this.createEvent(event));

    // Create recent transactions (orders)
    const recentOrdersData: InsertOrder[] = [
      { 
        tableNumber: "5", 
        customerName: "", 
        status: "completed", 
        totalAmount: 86.50, 
        tax: 7.35, 
        grandTotal: 93.85, 
        bartenderId: 1 
      },
      { 
        tableNumber: "8", 
        customerName: "", 
        status: "completed", 
        totalAmount: 124.00, 
        tax: 10.54, 
        grandTotal: 134.54, 
        bartenderId: 2 
      },
      { 
        tableNumber: "3", 
        customerName: "", 
        status: "pending", 
        totalAmount: 38.00, 
        tax: 3.23, 
        grandTotal: 41.23, 
        bartenderId: 1 
      },
      { 
        tableNumber: "10", 
        customerName: "", 
        status: "completed", 
        totalAmount: 52.75, 
        tax: 4.48, 
        grandTotal: 57.23, 
        bartenderId: 2 
      }
    ];

    recentOrdersData.forEach(order => {
      const createdOrder = this.createOrder(order);
      
      // Add to financial transactions
      this.createFinancialTransaction({
        transactionType: "income",
        amount: createdOrder.grandTotal,
        description: `Order #${createdOrder.id}`,
        category: "sales",
        paymentMethod: "card",
        relatedOrderId: createdOrder.id
      });
    });

    // Create some inventory activities
    const inventoryActivitiesData: InsertInventoryActivity[] = [
      { 
        itemId: 1, 
        action: "restock", 
        quantity: 12, 
        notes: "Regular inventory order", 
        performedBy: 8 
      },
      { 
        itemId: 2, 
        action: "update_price", 
        notes: "Price updated from $26.50 to $28.75", 
        performedBy: 8 
      },
      { 
        itemId: 9, 
        action: "remove", 
        quantity: 2, 
        notes: "Expired product", 
        performedBy: 5 
      },
      { 
        itemId: 7, 
        action: "low_stock_alert", 
        notes: "Only 2 remaining", 
        performedBy: 1 
      },
      { 
        itemId: 5, 
        action: "restock", 
        quantity: 24, 
        notes: "Regular inventory order", 
        performedBy: 8 
      }
    ];

    inventoryActivitiesData.forEach(activity => this.createInventoryActivity(activity));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const timestamp = new Date();
    const user: User = { ...insertUser, id, createdAt: timestamp };
    this.users.set(id, user);
    return user;
  }

  // Inventory operations
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentIds.inventoryItem++;
    const timestamp = new Date();
    const newItem: InventoryItem = { 
      ...item, 
      id, 
      updatedAt: timestamp,
      status: item.stock <= item.minLevel ? "low" : "normal"
    };
    this.inventoryItems.set(id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existingItem = this.inventoryItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem = { 
      ...existingItem, 
      ...item, 
      updatedAt: new Date(),
      status: item.stock !== undefined ? 
        (item.stock <= existingItem.minLevel ? "low" : "normal") : 
        existingItem.status
    };
    
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values()).filter(item => item.status === "low");
  }

  // Inventory activity operations
  async getInventoryActivities(): Promise<InventoryActivity[]> {
    return Array.from(this.inventoryActivities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createInventoryActivity(activity: InsertInventoryActivity): Promise<InventoryActivity> {
    const id = this.currentIds.inventoryActivity++;
    const timestamp = new Date();
    const newActivity: InventoryActivity = { ...activity, id, timestamp };
    this.inventoryActivities.set(id, newActivity);
    return newActivity;
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentIds.menuItem++;
    const newItem: MenuItem = { ...item, id, isActive: item.isActive ?? true };
    this.menuItems.set(id, newItem);
    return newItem;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem = { ...existingItem, ...item };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.category === category && item.isActive);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentIds.order++;
    const timestamp = new Date();
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: timestamp, 
      updatedAt: timestamp 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;

    const updatedOrder = { 
      ...existingOrder, 
      ...order, 
      updatedAt: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getRecentOrders(limit: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentIds.orderItem++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Staff operations
  async getStaffMembers(): Promise<Staff[]> {
    return Array.from(this.staffMembers.values());
  }

  async getStaffMember(id: number): Promise<Staff | undefined> {
    return this.staffMembers.get(id);
  }

  async createStaffMember(member: InsertStaff): Promise<Staff> {
    const id = this.currentIds.staff++;
    const newMember: Staff = { ...member, id };
    this.staffMembers.set(id, newMember);
    return newMember;
  }

  async updateStaffMember(id: number, member: Partial<InsertStaff>): Promise<Staff | undefined> {
    const existingMember = this.staffMembers.get(id);
    if (!existingMember) return undefined;

    const updatedMember = { ...existingMember, ...member };
    this.staffMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    return this.staffMembers.delete(id);
  }

  // Staff shift operations
  async getStaffShifts(): Promise<StaffShift[]> {
    return Array.from(this.staffShifts.values());
  }

  async getStaffShiftsByStaffId(staffId: number): Promise<StaffShift[]> {
    return Array.from(this.staffShifts.values())
      .filter(shift => shift.staffId === staffId);
  }

  async createStaffShift(shift: InsertStaffShift): Promise<StaffShift> {
    const id = this.currentIds.staffShift++;
    const newShift: StaffShift = { ...shift, id };
    this.staffShifts.set(id, newShift);
    return newShift;
  }

  async updateStaffShift(id: number, shift: Partial<InsertStaffShift>): Promise<StaffShift | undefined> {
    const existingShift = this.staffShifts.get(id);
    if (!existingShift) return undefined;

    const updatedShift = { ...existingShift, ...shift };
    this.staffShifts.set(id, updatedShift);
    return updatedShift;
  }

  async deleteStaffShift(id: number): Promise<boolean> {
    return this.staffShifts.delete(id);
  }

  // Staff performance operations
  async getStaffPerformance(): Promise<StaffPerformance[]> {
    return Array.from(this.staffPerformance.values());
  }

  async getStaffPerformanceByStaffId(staffId: number): Promise<StaffPerformance[]> {
    return Array.from(this.staffPerformance.values())
      .filter(perf => perf.staffId === staffId);
  }

  async createStaffPerformance(performance: InsertStaffPerformance): Promise<StaffPerformance> {
    const id = this.currentIds.staffPerformance++;
    const newPerformance: StaffPerformance = { ...performance, id };
    this.staffPerformance.set(id, newPerformance);
    return newPerformance;
  }

  async getTopPerformers(limit: number): Promise<any[]> {
    const staff = await this.getStaffMembers();
    const performance = await this.getStaffPerformance();
    
    return staff.map(member => {
      const memberPerformance = performance.find(p => p.staffId === member.id);
      return {
        id: member.id,
        name: member.name,
        role: member.role,
        salesAmount: memberPerformance?.salesAmount || 0,
        customerRating: memberPerformance?.customerRating || 0,
        incidents: memberPerformance?.incidents || 0
      };
    })
    .sort((a, b) => b.customerRating - a.customerRating)
    .slice(0, limit);
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentIds.event++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;

    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  async getUpcomingEvents(limit: number): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => event.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customer++;
    const newCustomer: Customer = { ...customer, id };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) return undefined;

    const updatedCustomer = { ...existingCustomer, ...customer };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getVipCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .filter(customer => customer.vipStatus === "vip");
  }

  // Reservation operations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.currentIds.reservation++;
    const newReservation: Reservation = { ...reservation, id };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const existingReservation = this.reservations.get(id);
    if (!existingReservation) return undefined;

    const updatedReservation = { ...existingReservation, ...reservation };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }

  async getUpcomingReservations(limit: number): Promise<Reservation[]> {
    const now = new Date();
    return Array.from(this.reservations.values())
      .filter(reservation => reservation.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }

  // Financial operations
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const id = this.currentIds.financialTransaction++;
    const newTransaction: FinancialTransaction = { 
      ...transaction, 
      id, 
      date: transaction.date || new Date() 
    };
    this.financialTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async getDailySales(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from(this.financialTransactions.values())
      .filter(tx => 
        tx.transactionType === "income" && 
        tx.category === "sales" && 
        tx.date >= today
      )
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }

  async getSalesByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<any[]> {
    const now = new Date();
    let periods: { label: string, start: Date, end: Date }[] = [];

    if (period === 'day') {
      // Last 24 hours in 4-hour chunks
      for (let i = 0; i < 6; i++) {
        const end = new Date(now);
        end.setHours(now.getHours() - (i * 4));
        const start = new Date(end);
        start.setHours(end.getHours() - 4);
        periods.unshift({
          label: `${start.getHours()}:00 - ${end.getHours()}:00`,
          start,
          end
        });
      }
    } else if (period === 'week') {
      // Last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        periods.push({
          label: days[date.getDay()],
          start: date,
          end
        });
      }
    } else if (period === 'month') {
      // Last 30 days in 5-day chunks
      for (let i = 0; i < 6; i++) {
        const end = new Date(now);
        end.setDate(now.getDate() - (i * 5));
        const start = new Date(end);
        start.setDate(end.getDate() - 5);
        periods.unshift({
          label: `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`,
          start,
          end
        });
      }
    } else {
      // Last 12 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setMonth(date.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        periods.push({
          label: months[date.getMonth()],
          start: date,
          end
        });
      }
    }

    return periods.map(p => {
      const sales = Array.from(this.financialTransactions.values())
        .filter(tx => 
          tx.transactionType === "income" && 
          tx.category === "sales" && 
          tx.date >= p.start && 
          tx.date <= p.end
        )
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      return {
        label: p.label,
        sales
      };
    });
  }

  async getExpensesByCategory(): Promise<any[]> {
    const categories: { [key: string]: number } = {};
    
    Array.from(this.financialTransactions.values())
      .filter(tx => tx.transactionType === "expense")
      .forEach(tx => {
        const category = tx.category || "uncategorized";
        categories[category] = (categories[category] || 0) + Number(tx.amount);
      });

    return Object.entries(categories).map(([category, amount]) => ({
      category,
      amount
    }));
  }
}

export const storage = new MemStorage();
