// ─────────────────────────────────────────────
// CelebrateAI — Milestone Filter & Sort Utility
// ─────────────────────────────────────────────

import type { GuestMilestone, MilestonePriority, MilestoneStatus } from "../types";

const PRIORITY_ORDER: Record<MilestonePriority, number> = {
  Critical: 0,
  High: 1,
  Normal: 2,
};

const STATUS_ORDER: Record<MilestoneStatus, number> = {
  "To Do": 0,
  "In Progress": 1,
  Completed: 2,
};

/**
 * Filters milestones by status and/or priority, then sorts by priority ascending.
 */
export function filterGuestMilestones(
  milestones: GuestMilestone[],
  options: {
    status?: MilestoneStatus | "All";
    priority?: MilestonePriority | "All";
    sortByStatus?: boolean;
  } = {}
): GuestMilestone[] {
  const { status = "All", priority = "All", sortByStatus = false } = options;

  let filtered = milestones.filter((m) => {
    const statusMatch = status === "All" || m.status === status;
    const priorityMatch = priority === "All" || m.priority === priority;
    return statusMatch && priorityMatch;
  });

  filtered = filtered.sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    if (sortByStatus) {
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    }
    return 0;
  });

  return filtered;
}

/**
 * Groups milestones by their status for Kanban board rendering.
 */
export function groupMilestonesByStatus(
  milestones: GuestMilestone[]
): Record<MilestoneStatus, GuestMilestone[]> {
  const groups: Record<MilestoneStatus, GuestMilestone[]> = {
    "To Do": [],
    "In Progress": [],
    Completed: [],
  };
  for (const m of milestones) {
    groups[m.status].push(m);
  }
  return groups;
}

/**
 * Generates a default set of milestones based on event type.
 */
export function generateDefaultMilestones(eventType: string, eventDate: string): GuestMilestone[] {
  const base: Omit<GuestMilestone, "id">[] = [
    {
      title: "Finalize Venue Booking",
      description: "Confirm venue contract, pay deposit, and collect venue layout map.",
      priority: "Critical",
      status: "To Do",
      category: "Venue",
      dueDate: getRelativeDate(eventDate, -90),
    },
    {
      title: "Send Save-the-Date Invitations",
      description: "Dispatch digital and physical save-the-date cards to all guests.",
      priority: "Critical",
      status: "To Do",
      category: "Guests",
      dueDate: getRelativeDate(eventDate, -60),
    },
    {
      title: "Finalize Catering Menu",
      description: "Select menu, confirm dietary accommodations, and sign caterer contract.",
      priority: "High",
      status: "To Do",
      category: "Catering",
      dueDate: getRelativeDate(eventDate, -45),
    },
    {
      title: "Book Entertainment & AV",
      description: "Confirm DJ/Band, MC, photographer, and videographer bookings.",
      priority: "High",
      status: "To Do",
      category: "Entertainment",
      dueDate: getRelativeDate(eventDate, -45),
    },
    {
      title: "Collect RSVPs",
      description: "Track guest confirmations and compile dietary requirements list.",
      priority: "High",
      status: "To Do",
      category: "Guests",
      dueDate: getRelativeDate(eventDate, -21),
    },
    {
      title: "Arrange Transportation & Parking",
      description: "Organize shuttles, valet service, and parking logistics.",
      priority: "Normal",
      status: "To Do",
      category: "Logistics",
      dueDate: getRelativeDate(eventDate, -14),
    },
    {
      title: "Final Headcount to Caterer",
      description: "Submit confirmed guest count to caterer for final preparation.",
      priority: "Critical",
      status: "To Do",
      category: "Catering",
      dueDate: getRelativeDate(eventDate, -7),
    },
    {
      title: "Rehearsal / Dry Run",
      description: "Full walkthrough of event program with all key stakeholders.",
      priority: "High",
      status: "To Do",
      category: "Program",
      dueDate: getRelativeDate(eventDate, -2),
    },
    {
      title: "Venue Setup & Decoration",
      description: "Decorate venue, test AV equipment, and brief all staff.",
      priority: "Critical",
      status: "To Do",
      category: "Venue",
      dueDate: getRelativeDate(eventDate, -1),
    },
    {
      title: "Post-Event Feedback Collection",
      description: "Send thank-you notes and feedback forms to all attendees.",
      priority: "Normal",
      status: "To Do",
      category: "Guests",
      dueDate: getRelativeDate(eventDate, 3),
    },
  ];

  if (eventType === "Wedding") {
    base.push({
      title: "Marriage Registration Appointment",
      description: "Book government registry appointment and prepare required documents.",
      priority: "Critical",
      status: "To Do",
      category: "Legal",
      dueDate: getRelativeDate(eventDate, -30),
    });
  }

  if (eventType === "Corporate Gala" || eventType === "Tech Conference") {
    base.push({
      title: "Secure Event Permits & Insurance",
      description: "Obtain municipal permits and event liability insurance policy.",
      priority: "Critical",
      status: "To Do",
      category: "Legal",
      dueDate: getRelativeDate(eventDate, -60),
    });
  }

  return base.map((m, i) => ({ ...m, id: `milestone-${i + 1}` }));
}

function getRelativeDate(eventDate: string, days: number): string {
  const date = new Date(eventDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
