import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPage from "../components/LandingPage";
import CountdownTimer from "../components/CountdownTimer";
import WeatherWidget from "../components/WeatherWidget";
import RSVPTracker from "../components/RSVPTracker";
import MoodBoard from "../components/MoodBoard";
import GiftRegistry from "../components/GiftRegistry";
import InviteSender from "../components/InviteSender";
import SeatingBuilder from "../components/SeatingBuilder";
import MultiDayPlanner from "../components/MultiDayPlanner";
import type { VendorScript } from "../types";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("LandingPage Component", () => {
  it("renders the brand header and hero title", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    expect(screen.getAllByText("CelebrateAI").length).toBeGreaterThan(0);
    expect(screen.getByText("Plan Events")).toBeInTheDocument();
    expect(screen.getByText("Like a Legend")).toBeInTheDocument();
  });

  it("renders all key feature cards", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    expect(screen.getByText("Smart Budget AI")).toBeInTheDocument();
    expect(screen.getByText("Hourly Itinerary")).toBeInTheDocument();
    expect(screen.getByText("RSVP Tracker")).toBeInTheDocument();
    expect(screen.getByText("Mood Board Studio")).toBeInTheDocument();
    expect(screen.getByText("Venue Map")).toBeInTheDocument();
    expect(screen.getByText("Invite Sender")).toBeInTheDocument();
    expect(screen.getByText("Gift Registry")).toBeInTheDocument();
    expect(screen.getByText("Seating Planner")).toBeInTheDocument();
  });

  it("renders 6 event category options", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("Birthday")).toBeInTheDocument();
    expect(screen.getByText("Corporate Gala")).toBeInTheDocument();
    expect(screen.getByText("College Fest")).toBeInTheDocument();
    expect(screen.getByText("Anniversary")).toBeInTheDocument();
    expect(screen.getByText("Tech Conference")).toBeInTheDocument();
  });

  it("renders testimonials with reviewer names", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    expect(screen.getByText("Priya Mehta")).toBeInTheDocument();
    expect(screen.getByText("Rohan Kapoor")).toBeInTheDocument();
    expect(screen.getByText("Aarav Singh")).toBeInTheDocument();
  });

  it("renders trust and credibility badges in hero section", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    expect(screen.getByText("✅ No credit card required")).toBeInTheDocument();
    expect(screen.getByText("✅ Setup in 60 seconds")).toBeInTheDocument();
  });

  it("opens walkthrough demo modal when Watch Demo is clicked", () => {
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    const demoBtn = screen.getByRole("button", { name: /watch product demo/i });
    fireEvent.click(demoBtn);

    expect(screen.getByText("CelebrateAI Product Walkthrough")).toBeInTheDocument();
    const driveLink = screen.getByRole("link", { name: /watch video on google drive/i });
    expect(driveLink).toHaveAttribute("href", expect.stringContaining("drive.google.com"));
  });

  it("triggers getStarted callback when clicking hero CTA", async () => {
    vi.useFakeTimers();
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    const heroBtn = screen.getByRole("button", { name: /start planning your perfect event/i });
    fireEvent.click(heroBtn);

    vi.advanceTimersByTime(300);
    expect(onGetStarted).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("triggers getStarted with specific EventType when clicking Wedding category", async () => {
    vi.useFakeTimers();
    const onGetStarted = vi.fn();
    render(<LandingPage onGetStarted={onGetStarted} />);

    const weddingBtn = screen.getByRole("button", { name: /plan a wedding event/i });
    fireEvent.click(weddingBtn);

    vi.advanceTimersByTime(300);
    expect(onGetStarted).toHaveBeenCalledWith("Wedding");
    vi.useRealTimers();
  });
});

describe("CountdownTimer Component", () => {
  it("renders countdown display with labels", () => {
    render(<CountdownTimer eventDate="2027-12-15" eventName="Royal Heritage Wedding" />);
    expect(screen.getByText("Event Countdown")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Mins")).toBeInTheDocument();
    expect(screen.getByText("Secs")).toBeInTheDocument();
  });
});

describe("WeatherWidget Component", () => {
  it("renders venue forecast and weather indicators", () => {
    render(<WeatherWidget venue="Umaid Bhawan Palace, Jodhpur" eventDate="2027-12-15" />);
    expect(screen.getByText("Event Day Forecast")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();
  });
});

describe("RSVPTracker Component", () => {
  it("renders guest stats summary and guests list", () => {
    render(<RSVPTracker guestCount={50} />);
    expect(screen.getByText("Guest RSVP Tracker")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Declined").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /add new guest/i })).toBeInTheDocument();
  });
});

describe("MoodBoard Component", () => {
  it("renders theme palettes and aesthetic swatches", () => {
    render(<MoodBoard eventType="Wedding" theme="Royal Indian" />);
    expect(screen.getByText("Decor Mood Board")).toBeInTheDocument();
    expect(screen.getByText("Vibe")).toBeInTheDocument();
    expect(screen.getByText("🌸 Décor")).toBeInTheDocument();
  });
});

describe("GiftRegistry Component", () => {
  it("renders gift registry title and wishlist items", () => {
    render(<GiftRegistry currency="INR" />);
    expect(screen.getByText("Gift Registry")).toBeInTheDocument();
    expect(screen.getByText("Registry Progress")).toBeInTheDocument();
    expect(screen.getByText("Add Gift")).toBeInTheDocument();
  });
});

describe("InviteSender Component", () => {
  it("renders multi-channel templates and preview", () => {
    const sampleScripts: VendorScript[] = [
      {
        type: "Invite",
        subject: "Invitation to Nexus Global AI Summit",
        body: "You are invited to the Nexus Global AI Summit.",
        channel: "Email",
      },
      {
        type: "DietaryReminder",
        subject: "Dietary Preferences",
        body: "Please confirm your dietary preferences.",
        channel: "WhatsApp",
      },
    ];

    render(
      <InviteSender
        scripts={sampleScripts}
        eventName="Nexus Global AI Summit"
        eventDate="2027-09-20"
        venue="Moscone Center"
      />
    );
    expect(screen.getByText("Invite Sender Preview")).toBeInTheDocument();
    expect(screen.getByText("📋 Script Templates")).toBeInTheDocument();
    expect(screen.getByText("📣 Bulk Invite")).toBeInTheDocument();
  });
});

describe("SeatingBuilder Component", () => {
  it("renders seating chart title, add table button, and tables overview", () => {
    render(<SeatingBuilder totalGuests={200} />);
    expect(screen.getByText("Seating Arrangement")).toBeInTheDocument();
    expect(screen.getByText("Add Table:")).toBeInTheDocument();
    expect(screen.getByText("Total Seats")).toBeInTheDocument();
  });
});

describe("MultiDayPlanner Component", () => {
  it("renders multi-day planner header and add day button", () => {
    render(<MultiDayPlanner startDate="2027-12-15" />);
    expect(screen.getByText("Multi-Day Planner")).toBeInTheDocument();
    expect(screen.getByText("Add Day")).toBeInTheDocument();
  });
});
