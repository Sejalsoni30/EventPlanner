import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InvitationCardModal from "../components/InvitationCardModal";
import type { EventPlan } from "../types";

const mockPlan: EventPlan = {
  formData: {
    eventType: "Wedding",
    budget: 1500000,
    guestCount: 250,
    locationType: "Destination Resort",
    eventDate: "2026-11-20",
    theme: "Royal Garden Elegance",
    eventName: "Meghan & Thomas Wedding",
    priorities: ["Catering & Bar", "Decor & Lighting"],
    venue: "The Grand Conservatory Ballroom",
  },
  budgetBreakdown: [],
  itinerary: [],
  tasks: [],
  vendorSuggestions: [],
  riskAssessment: [],
  milestones: [],
  venueRecommendations: [],
};

describe("InvitationCardModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true with modal title and close button", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Export Luxury Event Invitation")).toBeInTheDocument();
    expect(screen.getByLabelText("Close invitation modal")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={handleClose} />);
    fireEvent.click(screen.getByLabelText("Close invitation modal"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders all 5 luxury stationery style options", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    expect(screen.getByText("Botanical Eucalyptus")).toBeInTheDocument();
    expect(screen.getByText("Royal Heritage Arch")).toBeInTheDocument();
    expect(screen.getByText("Porcelain Blue Toile")).toBeInTheDocument();
    expect(screen.getByText("Enchanted Twilight")).toBeInTheDocument();
    expect(screen.getByText("Minimalist Letterpress")).toBeInTheDocument();
  });

  it("switches to Royal Heritage Arch template when clicked", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const royalButton = screen.getByText("Royal Heritage Arch").closest("button");
    expect(royalButton).toBeInTheDocument();
    fireEvent.click(royalButton!);
    expect(screen.getByText("॥ SHREE GANESHAY NAMAH ॥")).toBeInTheDocument();
  });

  it("switches to Porcelain Blue Toile template when clicked", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const toileButton = screen.getByText("Porcelain Blue Toile").closest("button");
    fireEvent.click(toileButton!);
    expect(screen.getByText("Meghan & Thomas")).toBeInTheDocument();
  });

  it("switches to Enchanted Twilight template when clicked", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const twilightButton = screen.getByText("Enchanted Twilight").closest("button");
    fireEvent.click(twilightButton!);
    expect(screen.getByText("Meghan & Thomas")).toBeInTheDocument();
  });

  it("switches to Minimalist Letterpress template when clicked", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const minimalButton = screen.getByText("Minimalist Letterpress").closest("button");
    fireEvent.click(minimalButton!);
    expect(screen.getByText("Meghan & Thomas")).toBeInTheDocument();
  });

  it("toggles the personalizer drawer and allows editing headline", () => {
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const personalizeToggle = screen.getByText("Personalize Details");
    fireEvent.click(personalizeToggle);

    expect(screen.getByText("Fine-Tune Invitation Card Wording")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("e.g. Meghan & Thomas or Rohit & Preeta");
    fireEvent.change(nameInput, { target: { value: "Rohit & Preeta" } });

    expect(screen.getByText("Rohit & Preeta")).toBeInTheDocument();
  });

  it("triggers window.print when Print / PDF button is clicked", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const printBtn = screen.getByText("Print / PDF");
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  it("copies digital invitation text to clipboard", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<InvitationCardModal plan={mockPlan} isOpen={true} onClose={() => {}} />);
    const copyBtn = screen.getByText("Copy Text (WhatsApp)");
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });
});
