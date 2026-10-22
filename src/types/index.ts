// ─────────────────────────────────────────────
// CelebrateAI — Core Type Definitions
// ─────────────────────────────────────────────

export type EventType =
  | "Birthday"
  | "Wedding"
  | "Corporate Gala"
  | "College Fest"
  | "Anniversary"
  | "Tech Conference";

export type Currency = "INR" | "USD";

export type Theme =
  | "Boho Chic"
  | "Minimalist Tech"
  | "Royal Indian"
  | "Garden Party"
  | "Retro Glam"
  | "Black Tie Formal"
  | "Tropical Paradise"
  | "Custom";

export type MilestonePriority = "Critical" | "High" | "Normal";
export type MilestoneStatus = "To Do" | "In Progress" | "Completed";

export interface EventFormData {
  eventName: string;
  eventType: EventType;
  guestCount: number;
  budget: number;
  currency: Currency;
  theme: Theme;
  customTheme?: string;
  eventDate: string;
  venue?: string;
  additionalNotes?: string;
}

export interface BudgetTier {
  category: string;
  percentage: number;
  amount: number;
  icon: string;
  description: string;
  tips: string[];
}

export interface BudgetDistribution {
  tiers: BudgetTier[];
  totalBudget: number;
  currency: Currency;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  poc: string;
  duration: string;
  category: "Setup" | "Guest" | "Program" | "Catering" | "Teardown" | "Break";
}

export interface GuestMilestone {
  id: string;
  title: string;
  description: string;
  priority: MilestonePriority;
  status: MilestoneStatus;
  dueDate?: string;
  category: string;
}

export interface VendorScript {
  type: "Invite" | "DietaryReminder" | "VendorNegotiation" | "ThankYou";
  subject: string;
  body: string;
  channel: "Email" | "SMS" | "WhatsApp";
}

export interface EventPlan {
  formData: EventFormData;
  budgetDistribution: BudgetDistribution;
  itinerary: ItineraryItem[];
  milestones: GuestMilestone[];
  vendorScripts: VendorScript[];
  generatedAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type AppStep = "landing" | "wizard" | "generating" | "dashboard";
