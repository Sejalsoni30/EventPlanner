// ─────────────────────────────────────────────
// CelebrateAI — Comprehensive Test Suite
// Vitest + React Testing Library
// ─────────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// ── Utilities under test ──────────────────────
import { calculateBudgetDistribution } from "../utils/budgetCalculator";
import { validateEventInput } from "../utils/budgetCalculator";
import { filterGuestMilestones, groupMilestonesByStatus } from "../utils/milestoneUtils";
import type { GuestMilestone, EventFormData } from "../types";

// ── UI Components under test ──────────────────
import BudgetBreakdown from "../components/BudgetBreakdown";
import ChecklistBoard from "../components/ChecklistBoard";

// ═════════════════════════════════════════════
// 1. calculateBudgetDistribution
// ═════════════════════════════════════════════
describe("calculateBudgetDistribution", () => {
  it("should return exactly 5 budget tiers", () => {
    const result = calculateBudgetDistribution(100000, "INR");
    expect(result.tiers).toHaveLength(5);
  });

  it("should sum all tier amounts to exactly the total budget", () => {
    const budget = 500000;
    const result = calculateBudgetDistribution(budget, "INR");
    const sum = result.tiers.reduce((acc, t) => acc + t.amount, 0);
    expect(sum).toBe(budget);
  });

  it("should sum all tier percentages to exactly 100%", () => {
    const result = calculateBudgetDistribution(200000, "USD");
    const totalPercentage = result.tiers.reduce((acc, t) => acc + t.percentage, 0);
    expect(totalPercentage).toBe(100);
  });

  it("should correctly allocate 40% to Venue & Decor", () => {
    const budget = 1000000;
    const result = calculateBudgetDistribution(budget, "INR");
    const venueTier = result.tiers.find((t) => t.category === "Venue & Decor");
    expect(venueTier).toBeDefined();
    expect(venueTier!.amount).toBe(400000);
    expect(venueTier!.percentage).toBe(40);
  });

  it("should correctly allocate 30% to Catering & Bar", () => {
    const budget = 1000000;
    const result = calculateBudgetDistribution(budget, "INR");
    const cateringTier = result.tiers.find((t) => t.category === "Catering & Bar");
    expect(cateringTier).toBeDefined();
    expect(cateringTier!.amount).toBe(300000);
  });

  it("should correctly allocate 15% to Entertainment & AV", () => {
    const budget = 1000000;
    const result = calculateBudgetDistribution(budget, "INR");
    const entTier = result.tiers.find((t) => t.category === "Entertainment & AV");
    expect(entTier).toBeDefined();
    expect(entTier!.amount).toBe(150000);
  });

  it("should correctly allocate 10% to Logistics & Permits", () => {
    const budget = 1000000;
    const result = calculateBudgetDistribution(budget, "INR");
    const logTier = result.tiers.find((t) => t.category === "Logistics & Permits");
    expect(logTier).toBeDefined();
    expect(logTier!.amount).toBe(100000);
  });

  it("should correctly allocate 5% to Emergency Reserve", () => {
    const budget = 1000000;
    const result = calculateBudgetDistribution(budget, "INR");
    const reserveTier = result.tiers.find((t) => t.category === "Emergency Reserve");
    expect(reserveTier).toBeDefined();
    expect(reserveTier!.amount).toBe(50000);
  });

  it("should preserve currency type in the result", () => {
    const resultINR = calculateBudgetDistribution(100000, "INR");
    expect(resultINR.currency).toBe("INR");

    const resultUSD = calculateBudgetDistribution(5000, "USD");
    expect(resultUSD.currency).toBe("USD");
  });

  it("should work for small budgets (₹1,000)", () => {
    const result = calculateBudgetDistribution(1000, "INR");
    const sum = result.tiers.reduce((acc, t) => acc + t.amount, 0);
    expect(sum).toBe(1000);
  });

  it("should work for very large budgets", () => {
    const budget = 50_000_000;
    const result = calculateBudgetDistribution(budget, "INR");
    const sum = result.tiers.reduce((acc, t) => acc + t.amount, 0);
    expect(sum).toBe(budget);
  });

  it("should throw for zero budget", () => {
    expect(() => calculateBudgetDistribution(0, "INR")).toThrow(
      "Total budget must be a positive number."
    );
  });

  it("should throw for negative budget", () => {
    expect(() => calculateBudgetDistribution(-500, "INR")).toThrow(
      "Total budget must be a positive number."
    );
  });

  it("should include pro tips for each tier", () => {
    const result = calculateBudgetDistribution(100000, "INR");
    result.tiers.forEach((tier) => {
      expect(tier.tips).toBeInstanceOf(Array);
      expect(tier.tips.length).toBeGreaterThan(0);
    });
  });
});

// ═════════════════════════════════════════════
// 2. validateEventInput
// ═════════════════════════════════════════════
describe("validateEventInput", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const validDate = tomorrow.toISOString().split("T")[0];

  const validData: EventFormData = {
    eventName: "Grand Birthday Bash",
    eventType: "Birthday",
    guestCount: 100,
    budget: 250000,
    currency: "INR",
    theme: "Royal Indian",
    eventDate: validDate,
  };

  it("should return no errors for valid data", () => {
    const errors = validateEventInput(validData);
    expect(errors).toHaveLength(0);
  });

  it("should return error for empty event name", () => {
    const errors = validateEventInput({ ...validData, eventName: "" });
    const nameError = errors.find((e) => e.field === "eventName");
    expect(nameError).toBeDefined();
    expect(nameError!.message).toMatch(/required/i);
  });

  it("should return error for whitespace-only event name", () => {
    const errors = validateEventInput({ ...validData, eventName: "   " });
    const nameError = errors.find((e) => e.field === "eventName");
    expect(nameError).toBeDefined();
  });

  it("should return error for event name exceeding 120 characters", () => {
    const longName = "A".repeat(121);
    const errors = validateEventInput({ ...validData, eventName: longName });
    const nameError = errors.find((e) => e.field === "eventName");
    expect(nameError).toBeDefined();
    expect(nameError!.message).toMatch(/120/);
  });

  it("should accept event name of exactly 120 characters", () => {
    const exactName = "A".repeat(120);
    const errors = validateEventInput({ ...validData, eventName: exactName });
    const nameError = errors.find((e) => e.field === "eventName");
    expect(nameError).toBeUndefined();
  });

  it("should return error for negative guest count", () => {
    const errors = validateEventInput({ ...validData, guestCount: -10 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeDefined();
    expect(guestError!.message).toMatch(/positive/i);
  });

  it("should return error for zero guest count", () => {
    const errors = validateEventInput({ ...validData, guestCount: 0 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeDefined();
  });

  it("should return error for non-integer guest count", () => {
    const errors = validateEventInput({ ...validData, guestCount: 50.5 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeDefined();
  });

  it("should return error for guest count exceeding 100,000", () => {
    const errors = validateEventInput({ ...validData, guestCount: 100001 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeDefined();
  });

  it("should accept guest count of exactly 1", () => {
    const errors = validateEventInput({ ...validData, guestCount: 1 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeUndefined();
  });

  it("should accept guest count of exactly 100,000", () => {
    const errors = validateEventInput({ ...validData, guestCount: 100000 });
    const guestError = errors.find((e) => e.field === "guestCount");
    expect(guestError).toBeUndefined();
  });

  it("should return error for zero budget", () => {
    const errors = validateEventInput({ ...validData, budget: 0 });
    const budgetError = errors.find((e) => e.field === "budget");
    expect(budgetError).toBeDefined();
    expect(budgetError!.message).toMatch(/greater than zero/i);
  });

  it("should return error for negative budget", () => {
    const errors = validateEventInput({ ...validData, budget: -5000 });
    const budgetError = errors.find((e) => e.field === "budget");
    expect(budgetError).toBeDefined();
  });

  it("should return error for budget exceeding maximum limit", () => {
    const errors = validateEventInput({ ...validData, budget: 2_000_000_000 });
    const budgetError = errors.find((e) => e.field === "budget");
    expect(budgetError).toBeDefined();
  });

  it("should return error for missing event type", () => {
    const errors = validateEventInput({ ...validData, eventType: undefined as never });
    const typeError = errors.find((e) => e.field === "eventType");
    expect(typeError).toBeDefined();
  });

  it("should return error for missing theme", () => {
    const errors = validateEventInput({ ...validData, theme: undefined as never });
    const themeError = errors.find((e) => e.field === "theme");
    expect(themeError).toBeDefined();
  });

  it("should return error for missing event date", () => {
    const errors = validateEventInput({ ...validData, eventDate: "" });
    const dateError = errors.find((e) => e.field === "eventDate");
    expect(dateError).toBeDefined();
  });

  it("should return error for a past event date", () => {
    const pastDate = "2020-01-01";
    const errors = validateEventInput({ ...validData, eventDate: pastDate });
    const dateError = errors.find((e) => e.field === "eventDate");
    expect(dateError).toBeDefined();
    expect(dateError!.message).toMatch(/future/i);
  });

  it("should return error for an invalid date string", () => {
    const errors = validateEventInput({ ...validData, eventDate: "not-a-date" });
    const dateError = errors.find((e) => e.field === "eventDate");
    expect(dateError).toBeDefined();
  });

  it("should return multiple errors simultaneously for multiple invalid fields", () => {
    const errors = validateEventInput({
      eventName: "",
      guestCount: -5,
      budget: 0,
      currency: undefined as never,
      theme: undefined as never,
      eventDate: "",
      eventType: undefined as never,
    });
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });
});

// ═════════════════════════════════════════════
// 3. filterGuestMilestones
// ═════════════════════════════════════════════
describe("filterGuestMilestones", () => {
  const baseMilestones: GuestMilestone[] = [
    { id: "1", title: "Book Venue", description: "...", priority: "Critical", status: "To Do", category: "Venue" },
    { id: "2", title: "Send Invites", description: "...", priority: "High", status: "In Progress", category: "Guests" },
    { id: "3", title: "Finalize Menu", description: "...", priority: "High", status: "To Do", category: "Catering" },
    { id: "4", title: "Book DJ", description: "...", priority: "Normal", status: "Completed", category: "Entertainment" },
    { id: "5", title: "Arrange Transport", description: "...", priority: "Normal", status: "To Do", category: "Logistics" },
    { id: "6", title: "Marriage Permit", description: "...", priority: "Critical", status: "In Progress", category: "Legal" },
    { id: "7", title: "Collect RSVPs", description: "...", priority: "High", status: "Completed", category: "Guests" },
  ];

  it("should return all milestones when no filter is applied", () => {
    const result = filterGuestMilestones(baseMilestones);
    expect(result).toHaveLength(baseMilestones.length);
  });

  it("should filter by 'To Do' status", () => {
    const result = filterGuestMilestones(baseMilestones, { status: "To Do" });
    expect(result.every((m) => m.status === "To Do")).toBe(true);
    expect(result).toHaveLength(3);
  });

  it("should filter by 'In Progress' status", () => {
    const result = filterGuestMilestones(baseMilestones, { status: "In Progress" });
    expect(result.every((m) => m.status === "In Progress")).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("should filter by 'Completed' status", () => {
    const result = filterGuestMilestones(baseMilestones, { status: "Completed" });
    expect(result.every((m) => m.status === "Completed")).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("should filter by 'Critical' priority", () => {
    const result = filterGuestMilestones(baseMilestones, { priority: "Critical" });
    expect(result.every((m) => m.priority === "Critical")).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("should filter by 'High' priority", () => {
    const result = filterGuestMilestones(baseMilestones, { priority: "High" });
    expect(result.every((m) => m.priority === "High")).toBe(true);
    expect(result).toHaveLength(3);
  });

  it("should filter by 'Normal' priority", () => {
    const result = filterGuestMilestones(baseMilestones, { priority: "Normal" });
    expect(result.every((m) => m.priority === "Normal")).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("should sort results with Critical before High before Normal", () => {
    const result = filterGuestMilestones(baseMilestones);
    const priorities = result.map((m) => m.priority);
    const criticalIdx = priorities.findIndex((p) => p === "Critical");
    const highIdx = priorities.findIndex((p) => p === "High");
    const normalIdx = priorities.findIndex((p) => p === "Normal");
    expect(criticalIdx).toBeLessThan(highIdx);
    expect(highIdx).toBeLessThan(normalIdx);
  });

  it("should combine status and priority filters", () => {
    const result = filterGuestMilestones(baseMilestones, { status: "To Do", priority: "High" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("should return empty array when filter matches nothing", () => {
    const result = filterGuestMilestones(baseMilestones, { status: "Completed", priority: "Critical" });
    expect(result).toHaveLength(0);
  });

  it("should return empty array for empty input", () => {
    const result = filterGuestMilestones([]);
    expect(result).toHaveLength(0);
  });

  it("should not mutate the original array", () => {
    const copy = [...baseMilestones];
    filterGuestMilestones(baseMilestones, { priority: "High" });
    expect(baseMilestones).toEqual(copy);
  });
});

// ═════════════════════════════════════════════
// 4. groupMilestonesByStatus
// ═════════════════════════════════════════════
describe("groupMilestonesByStatus", () => {
  const milestones: GuestMilestone[] = [
    { id: "1", title: "A", description: "", priority: "Critical", status: "To Do", category: "Venue" },
    { id: "2", title: "B", description: "", priority: "High", status: "In Progress", category: "Catering" },
    { id: "3", title: "C", description: "", priority: "Normal", status: "Completed", category: "Entertainment" },
    { id: "4", title: "D", description: "", priority: "High", status: "To Do", category: "Guests" },
  ];

  it("should group milestones into three status buckets", () => {
    const groups = groupMilestonesByStatus(milestones);
    expect(Object.keys(groups)).toEqual(["To Do", "In Progress", "Completed"]);
  });

  it("should correctly count 'To Do' items", () => {
    const groups = groupMilestonesByStatus(milestones);
    expect(groups["To Do"]).toHaveLength(2);
  });

  it("should correctly count 'In Progress' items", () => {
    const groups = groupMilestonesByStatus(milestones);
    expect(groups["In Progress"]).toHaveLength(1);
  });

  it("should correctly count 'Completed' items", () => {
    const groups = groupMilestonesByStatus(milestones);
    expect(groups["Completed"]).toHaveLength(1);
  });

  it("should return empty arrays for statuses with no items", () => {
    const onlyToDo: GuestMilestone[] = [
      { id: "1", title: "A", description: "", priority: "Normal", status: "To Do", category: "Venue" },
    ];
    const groups = groupMilestonesByStatus(onlyToDo);
    expect(groups["In Progress"]).toHaveLength(0);
    expect(groups["Completed"]).toHaveLength(0);
  });
});

// ═════════════════════════════════════════════
// 5. UI Component — BudgetBreakdown
// ═════════════════════════════════════════════
describe("BudgetBreakdown component", () => {
  const distribution = calculateBudgetDistribution(1000000, "INR");

  it("should render the section heading", () => {
    render(<BudgetBreakdown distribution={distribution} />);
    expect(screen.getByRole("heading", { name: /smart budget allocator/i })).toBeInTheDocument();
  });

  it("should display total budget amount", () => {
    render(<BudgetBreakdown distribution={distribution} />);
    expect(screen.getByText(/₹10,00,000/i)).toBeInTheDocument();
  });

  it("should render all 5 tier categories", () => {
    render(<BudgetBreakdown distribution={distribution} />);
    expect(screen.getByText("Venue & Decor")).toBeInTheDocument();
    expect(screen.getByText("Catering & Bar")).toBeInTheDocument();
    expect(screen.getByText("Entertainment & AV")).toBeInTheDocument();
    expect(screen.getByText("Logistics & Permits")).toBeInTheDocument();
    expect(screen.getByText("Emergency Reserve")).toBeInTheDocument();
  });

  it("should show correct percentage for Venue & Decor (40%)", () => {
    render(<BudgetBreakdown distribution={distribution} />);
    const badges = screen.getAllByText("40%");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("should render 5 progress bars", () => {
    render(<BudgetBreakdown distribution={distribution} />);
    const progressBars = screen.getAllByRole("progressbar");
    // 5 individual tier bars + 1 summary overview bar
    expect(progressBars.length).toBeGreaterThanOrEqual(5);
  });
});

// ═════════════════════════════════════════════
// 6. UI Component — ChecklistBoard
// ═════════════════════════════════════════════
describe("ChecklistBoard component", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  const futureDate = tomorrow.toISOString().split("T")[0];

  const sampleMilestones: GuestMilestone[] = [
    { id: "m1", title: "Book Venue", description: "Confirm venue contract", priority: "Critical", status: "To Do", category: "Venue", dueDate: futureDate },
    { id: "m2", title: "Send Invites", description: "Dispatch invitations", priority: "High", status: "In Progress", category: "Guests", dueDate: futureDate },
    { id: "m3", title: "Book DJ", description: "Sign DJ contract", priority: "Normal", status: "Completed", category: "Entertainment" },
  ];

  it("should render the section heading", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    expect(screen.getByRole("heading", { name: /rsvp & checklist board/i })).toBeInTheDocument();
  });

  it("should show completed count text", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    expect(screen.getByText(/1 of 3 milestones completed/i)).toBeInTheDocument();
  });

  it("should render three Kanban column headers", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("should render milestone titles", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    expect(screen.getByText("Book Venue")).toBeInTheDocument();
    expect(screen.getByText("Send Invites")).toBeInTheDocument();
    expect(screen.getByText("Book DJ")).toBeInTheDocument();
  });

  it("should render priority filter buttons", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    expect(screen.getByRole("button", { name: /^all$/i })).toBeInTheDocument();
  });

  it("should show overall progress bar", () => {
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);
    const progressBar = screen.getByRole("progressbar", { name: /milestones completed/i });
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "33");
  });

  it("should filter milestones by priority when filter button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);

    // The filter group contains an aria-pressed filter button for Critical
    const filterGroup = screen.getByRole("group", { name: /filter by priority/i });
    const criticalFilterBtn = Array.from(filterGroup.querySelectorAll("button")).find(
      (btn) => btn.textContent?.includes("Critical")
    )!;
    await user.click(criticalFilterBtn);

    expect(criticalFilterBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("should expand milestone details on chevron click", async () => {
    const user = userEvent.setup();
    render(<ChecklistBoard milestones={sampleMilestones} onUpdate={() => {}} />);

    const expandButtons = screen.getAllByRole("button", { name: /expand details/i });
    expect(expandButtons.length).toBeGreaterThan(0);
    await user.click(expandButtons[0]);

    expect(screen.getByText("Confirm venue contract")).toBeInTheDocument();
  });
});
