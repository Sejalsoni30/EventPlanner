import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import EventDashboard from "../components/EventDashboard";
import GuestCelebrationPortal from "../components/GuestCelebrationPortal";
import type { EventPlan } from "../types";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

const mockPlan: EventPlan = {
  formData: {
    eventName: "Royal Gala Night",
    eventType: "Corporate Gala",
    guestCount: 200,
    budget: 1000000,
    currency: "INR",
    theme: "Royal Indian",
    eventDate: "2026-12-25",
    venue: "The Oberoi Grand Palace",
  },
  budgetDistribution: {
    tiers: [
      {
        category: "Venue & Decor",
        percentage: 40,
        amount: 400000,
        icon: "Building",
        description: "Venue rental",
        tips: ["Book early"],
      },
    ],
    totalBudget: 1000000,
    currency: "INR",
  },
  itinerary: [
    {
      time: "18:00",
      title: "Red Carpet Arrival & Welcome Drinks",
      description: "Cocktails and red carpet photography",
      poc: "Host",
      duration: "1 hr",
      category: "Guest",
    },
    {
      time: "19:00",
      title: "Keynote Address",
      description: "Opening keynote by leadership",
      poc: "MC",
      duration: "45 min",
      category: "Program",
    },
  ],
  milestones: [
    {
      id: "m1",
      title: "Finalize Venue Contract",
      description: "Sign agreements",
      priority: "Critical",
      status: "In Progress",
      category: "Venue",
    },
  ],
  vendorScripts: [
    {
      type: "Invite",
      subject: "You're Invited",
      body: "Please join us",
      channel: "Email",
    },
  ],
  generatedAt: "2026-10-23T12:00:00.000Z",
};

describe("Theme Modes (Dark & Light Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  function TestThemeConsumer() {
    const { theme } = useTheme();
    return (
      <div>
        <span data-testid="current-theme">{theme}</span>
        <ThemeToggle showLabel={true} />
      </div>
    );
  }

  it("defaults to Dark Mode and applies dark class", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("toggles between Dark Mode and Light Mode on button click", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: /switch to light mode/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Toggle back to dark
    const backToDarkBtn = screen.getByRole("button", { name: /switch to dark mode/i });
    fireEvent.click(backToDarkBtn);

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("Workspace Experience Modes (Organizer vs Guest Mode)", () => {
  it("renders Organizer Mode by default in the Dashboard", () => {
    render(
      <ThemeProvider>
        <EventDashboard
          plan={mockPlan}
          onReset={() => {}}
          onMilestonesUpdate={() => {}}
        />
      </ThemeProvider>
    );

    // Verify Organizer Mode active indicator
    expect(screen.getByText("Organizer Mode")).toBeInTheDocument();
    expect(screen.getByText("Guest Mode")).toBeInTheDocument();
    expect(screen.getByText(/Organizer Master Mode/i)).toBeInTheDocument();

    // Verify Organizer-specific widgets are rendered
    expect(screen.getByText("Smart Budget Allocator")).toBeInTheDocument();
    expect(screen.getByText("RSVP & Checklist Board")).toBeInTheDocument();
  });

  it("switches to Guest Mode and displays the Guest Celebration Portal", async () => {
    render(
      <ThemeProvider>
        <EventDashboard
          plan={mockPlan}
          onReset={() => {}}
          onMilestonesUpdate={() => {}}
        />
      </ThemeProvider>
    );

    const guestModeBtn = screen.getByRole("tab", { name: /guest mode/i });
    fireEvent.click(guestModeBtn);

    // Verify Guest Mode active banner
    expect(screen.getByText(/Guest Celebration Mode/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Official Guest Celebration Hub")).toBeInTheDocument();
    });
    expect(screen.getByText("Guest RSVP & Attendance Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Guest Table & Seating Finder")).toBeInTheDocument();
  });

  it("allows attendee to submit RSVP in Guest Mode", () => {
    render(
      <GuestCelebrationPortal
        plan={mockPlan}
        onOpenInvitation={() => {}}
      />
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priya Sharma/i);
    fireEvent.change(nameInput, { target: { value: "Aarav Sharma" } });

    const submitBtn = screen.getByRole("button", { name: /submit my rsvp confirmation/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("RSVP Confirmed with Joy!")).toBeInTheDocument();
    expect(screen.getByText(/Thank you,/i)).toBeInTheDocument();
  });

  it("filters table seating in Guest Table Finder", () => {
    render(
      <GuestCelebrationPortal
        plan={mockPlan}
        onOpenInvitation={() => {}}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search attendee name/i);
    fireEvent.change(searchInput, { target: { value: "Priya Mehta" } });

    expect(screen.getByText(/Table 1 — Imperial Orchid/i)).toBeInTheDocument();
  });
});
