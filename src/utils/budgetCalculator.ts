// ─────────────────────────────────────────────
// CelebrateAI — Budget Calculator Utility
// ─────────────────────────────────────────────

import type { BudgetDistribution, BudgetTier, Currency, EventFormData, ValidationError } from "../types";

const BUDGET_TIERS: Omit<BudgetTier, "amount">[] = [
  {
    category: "Venue & Decor",
    percentage: 40,
    icon: "🏛️",
    description: "Venue rental, floral arrangements, lighting, and themed decorations",
    tips: [
      "Book venue at least 3–6 months in advance",
      "Negotiate off-peak discounts",
      "Consider natural lighting to save on electrical costs",
    ],
  },
  {
    category: "Catering & Bar",
    percentage: 30,
    icon: "🍽️",
    description: "Food buffet, live counters, beverages, bar setup, and service staff",
    tips: [
      "Offer a mix of vegetarian and non-vegetarian options",
      "Pre-negotiate a per-plate rate with the caterer",
      "Mocktail stations are cost-effective for dry events",
    ],
  },
  {
    category: "Entertainment & AV",
    percentage: 15,
    icon: "🎶",
    description: "DJ, live band, MC/host, audio-visual equipment, photo/video coverage",
    tips: [
      "Bundle photo + video packages for better rates",
      "Hire a DJ instead of a band for smaller budgets",
      "Source AV from local vendors to avoid logistics markup",
    ],
  },
  {
    category: "Logistics & Permits",
    percentage: 10,
    icon: "🚚",
    description: "Transportation, parking management, event permits, insurance, and signage",
    tips: [
      "Arrange shuttle buses for large guest counts",
      "Apply for permits 4–6 weeks in advance",
      "Event insurance protects against last-minute cancellations",
    ],
  },
  {
    category: "Emergency Reserve",
    percentage: 5,
    icon: "🛡️",
    description: "Contingency fund for unexpected costs, last-minute additions, or vendor failures",
    tips: [
      "Never dip into reserve unless absolutely necessary",
      "Roll over unused reserve to upgrade a key element",
      "Keep reserve liquid — avoid pre-committing it",
    ],
  },
];

/**
 * Calculates budget distribution across predefined tiers.
 * Validates that percentages sum to exactly 100%.
 */
export function calculateBudgetDistribution(
  totalBudget: number,
  currency: Currency
): BudgetDistribution {
  if (totalBudget <= 0) {
    throw new Error("Total budget must be a positive number.");
  }

  const totalPercentage = BUDGET_TIERS.reduce((sum, t) => sum + t.percentage, 0);
  if (totalPercentage !== 100) {
    throw new Error(`Budget tiers must sum to 100%, got ${totalPercentage}%.`);
  }

  const tiers: BudgetTier[] = BUDGET_TIERS.map((tier) => ({
    ...tier,
    amount: Math.round((tier.percentage / 100) * totalBudget),
  }));

  return { tiers, totalBudget, currency };
}

/**
 * Validates EventFormData and returns a list of validation errors.
 */
export function validateEventInput(data: Partial<EventFormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.eventName || data.eventName.trim().length === 0) {
    errors.push({ field: "eventName", message: "Event name is required." });
  }

  if (data.eventName && data.eventName.trim().length > 120) {
    errors.push({ field: "eventName", message: "Event name must be 120 characters or fewer." });
  }

  if (!data.eventType) {
    errors.push({ field: "eventType", message: "Event type is required." });
  }

  if (data.guestCount === undefined || data.guestCount === null) {
    errors.push({ field: "guestCount", message: "Guest count is required." });
  } else if (!Number.isInteger(data.guestCount) || data.guestCount < 1) {
    errors.push({ field: "guestCount", message: "Guest count must be a positive whole number." });
  } else if (data.guestCount > 100000) {
    errors.push({ field: "guestCount", message: "Guest count cannot exceed 100,000." });
  }

  if (data.budget === undefined || data.budget === null) {
    errors.push({ field: "budget", message: "Budget is required." });
  } else if (data.budget <= 0) {
    errors.push({ field: "budget", message: "Budget must be greater than zero." });
  } else if (data.budget > 1_000_000_000) {
    errors.push({ field: "budget", message: "Budget exceeds maximum limit." });
  }

  if (!data.currency) {
    errors.push({ field: "currency", message: "Currency is required." });
  }

  if (!data.theme) {
    errors.push({ field: "theme", message: "Theme/Vibe selection is required." });
  }

  if (!data.eventDate) {
    errors.push({ field: "eventDate", message: "Event date is required." });
  } else {
    const date = new Date(data.eventDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: "eventDate", message: "Invalid event date." });
    } else if (date < new Date(new Date().toDateString())) {
      errors.push({ field: "eventDate", message: "Event date must be in the future." });
    }
  }

  return errors;
}

/**
 * Formats a budget amount with currency symbol.
 */
export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
