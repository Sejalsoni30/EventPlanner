// ─────────────────────────────────────────────
// CelebrateAI — AI / Mock Generator Engine
// ─────────────────────────────────────────────

import type { EventFormData, ItineraryItem, VendorScript } from "../types";

const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Builds a structured prompt for Gemini API to generate event content.
 */
function buildPrompt(formData: EventFormData): string {
  const currency = formData.currency === "INR" ? "INR (₹)" : "USD ($)";
  const budget = new Intl.NumberFormat().format(formData.budget);

  return `You are an expert event planner AI. Generate a comprehensive event plan in valid JSON for the following event:

Event Name: "${formData.eventName}"
Event Type: ${formData.eventType}
Theme/Vibe: ${formData.theme === "Custom" ? formData.customTheme : formData.theme}
Guest Count: ${formData.guestCount}
Total Budget: ${budget} ${currency}
Event Date: ${formData.eventDate}
${formData.venue ? `Venue: ${formData.venue}` : ""}
${formData.additionalNotes ? `Additional Notes: ${formData.additionalNotes}` : ""}

Return a JSON object with this exact structure:
{
  "itinerary": [
    {
      "time": "HH:MM",
      "title": "string",
      "description": "string",
      "poc": "string (Role responsible)",
      "duration": "string (e.g. 30 mins)",
      "category": "Setup|Guest|Program|Catering|Teardown|Break"
    }
  ],
  "vendorScripts": [
    {
      "type": "Invite|DietaryReminder|VendorNegotiation|ThankYou",
      "subject": "string",
      "body": "string",
      "channel": "Email|SMS|WhatsApp"
    }
  ]
}

Requirements:
- Generate 10–14 itinerary items covering full event day from venue setup to teardown
- Generate 4 vendor scripts: one Invite (Email), one DietaryReminder (WhatsApp), one VendorNegotiation (Email), one ThankYou (Email)
- Make content highly specific to the ${formData.eventType} type and "${formData.theme === "Custom" ? formData.customTheme : formData.theme}" theme
- Use formal yet warm tone for ${formData.guestCount} guests
- All times should be realistic for a ${formData.eventType} event
- POC roles should be specific (e.g., "Venue Coordinator", "Head Caterer")
Return ONLY the JSON object, no markdown or additional text.`;
}

/**
 * Calls the Gemini API to generate event content.
 * Falls back to mock generator if API key is absent or call fails.
 */
export async function generateEventContent(
  formData: EventFormData,
  apiKey?: string
): Promise<{ itinerary: ItineraryItem[]; vendorScripts: VendorScript[] }> {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(formData) }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data = await response.json();
      const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(jsonStr);

      return {
        itinerary: parsed.itinerary ?? [],
        vendorScripts: parsed.vendorScripts ?? [],
      };
    } catch (err) {
      console.warn("Gemini API call failed, using mock generator:", err);
    }
  }

  return generateMockContent(formData);
}

/**
 * Mock generator — produces realistic content when Gemini API is unavailable.
 */
function generateMockContent(
  formData: EventFormData
): { itinerary: ItineraryItem[]; vendorScripts: VendorScript[] } {
  const { eventName, eventType, guestCount, theme, customTheme } = formData;
  const themeName = theme === "Custom" ? customTheme ?? "Custom" : theme;

  const itinerary: ItineraryItem[] = buildMockItinerary(eventType);
  const vendorScripts: VendorScript[] = buildMockVendorScripts(
    eventName,
    eventType,
    guestCount,
    themeName,
    formData.eventDate
  );

  return { itinerary, vendorScripts };
}

function buildMockItinerary(eventType: string): ItineraryItem[] {
  const baseItems: Record<string, ItineraryItem[]> = {
    Wedding: [
      { time: "07:00", title: "Venue Setup Begins", description: "Florists, decorators, and lighting crew begin setup. Tables, chairs, and stage arrangement.", poc: "Venue Coordinator", duration: "3 hrs", category: "Setup" },
      { time: "10:00", title: "AV & Sound Check", description: "Microphones, projectors, and music system tested. Final lighting adjustments.", poc: "AV Technician", duration: "1 hr", category: "Setup" },
      { time: "11:00", title: "Bridal Party Preparation", description: "Hair, makeup, and outfit final touches for bride, groom, and bridal party.", poc: "Makeup Artist / Stylist", duration: "2 hrs", category: "Program" },
      { time: "13:00", title: "Guest Arrival & Welcome", description: "Registration desk open. Welcome drinks and canapés served. Ushers guide guests to seats.", poc: "Guest Relations Manager", duration: "1 hr", category: "Guest" },
      { time: "14:00", title: "Wedding Ceremony", description: "Exchange of vows, ring ceremony, official photographs. Officiant leads the ceremony.", poc: "Officiant / MC", duration: "45 mins", category: "Program" },
      { time: "14:45", title: "Cocktail Hour", description: "Post-ceremony mingling, canapés, mocktails/cocktails. Photographer captures candid moments.", poc: "Head Bartender", duration: "1 hr", category: "Catering" },
      { time: "15:45", title: "Reception Begins", description: "Guests seated for reception dinner. Welcome address by MC.", poc: "MC / Event Host", duration: "15 mins", category: "Program" },
      { time: "16:00", title: "Multi-Course Dinner Service", description: "Starter, main course, and dessert served in courses. Live background music plays.", poc: "Head Caterer", duration: "2 hrs", category: "Catering" },
      { time: "18:00", title: "Speeches & Toasts", description: "Best man, maid of honor, and parents deliver heartfelt speeches.", poc: "MC", duration: "45 mins", category: "Program" },
      { time: "18:45", title: "First Dance & Dance Floor Opens", description: "Couple's first dance, followed by open dance floor for all guests.", poc: "DJ / Band Leader", duration: "2 hrs", category: "Program" },
      { time: "20:45", title: "Wedding Cake Cutting", description: "Ceremonial cake cutting, photos, and dessert distribution.", poc: "Pastry Chef / Photographer", duration: "30 mins", category: "Program" },
      { time: "21:15", title: "Send-Off & Guest Departure", description: "Sparkler send-off for couple. Shuttle buses begin first run. Farewell to guests.", poc: "Guest Relations Manager", duration: "45 mins", category: "Guest" },
      { time: "22:00", title: "Venue Teardown", description: "Decorators, caterers, and AV team begin breakdown. Inventory check.", poc: "Venue Coordinator", duration: "2 hrs", category: "Teardown" },
    ],
    Birthday: [
      { time: "14:00", title: "Venue Setup & Decoration", description: "Balloons, themed backdrop, cake table, and decorations set up.", poc: "Event Decorator", duration: "2 hrs", category: "Setup" },
      { time: "16:00", title: "AV & Entertainment Setup", description: "DJ equipment, photobooth, and games area prepared.", poc: "AV Technician", duration: "1 hr", category: "Setup" },
      { time: "17:00", title: "Guest Arrival & Welcome Drinks", description: "Registration desk open. Welcome cocktails and mocktails served at entrance.", poc: "Host / Event Manager", duration: "1 hr", category: "Guest" },
      { time: "18:00", title: "Birthday Gala Opening", description: "MC welcomes all guests, introduces birthday person, and sets the evening's program.", poc: "MC / Host", duration: "20 mins", category: "Program" },
      { time: "18:20", title: "Entertainment Showcase", description: "Live performances, magic show, or DJ set kicks off the celebrations.", poc: "Entertainment Manager", duration: "1 hr", category: "Program" },
      { time: "19:20", title: "Dinner Buffet Opens", description: "Multi-cuisine buffet with live counters, salad bar, and dessert station.", poc: "Head Caterer", duration: "1.5 hrs", category: "Catering" },
      { time: "20:50", title: "Birthday Cake Ceremony", description: "Birthday song, cake cutting, and photo opportunity with all guests.", poc: "MC / Photographer", duration: "20 mins", category: "Program" },
      { time: "21:10", title: "Dance & Celebration", description: "Open dance floor, DJ performance, and photobooth sessions.", poc: "DJ", duration: "1.5 hrs", category: "Program" },
      { time: "22:40", title: "Guest Departure & Farewell", description: "Thank-you gifts distributed. Guests depart; shuttle service begins.", poc: "Guest Relations Manager", duration: "30 mins", category: "Guest" },
      { time: "23:10", title: "Venue Teardown", description: "Clean-up crew begins. All rentals packed. Venue handed back.", poc: "Venue Coordinator", duration: "1.5 hrs", category: "Teardown" },
    ],
    "Corporate Gala": [
      { time: "08:00", title: "Venue Setup & Branding", description: "Company banners, stage setup, registration kiosks, and AV installation.", poc: "Event Operations Lead", duration: "3 hrs", category: "Setup" },
      { time: "11:00", title: "Tech Check & Rehearsal", description: "Speaker rehearsals, presentation dry-runs, and full AV walkthrough.", poc: "AV Director / Stage Manager", duration: "2 hrs", category: "Setup" },
      { time: "13:00", title: "Delegate Registration Opens", description: "Name badges, welcome kits, and delegate networking lounge open.", poc: "Registration Manager", duration: "1 hr", category: "Guest" },
      { time: "14:00", title: "Opening Keynote Address", description: "CEO/Chief Guest delivers opening remarks and sets conference theme.", poc: "MC / Stage Manager", duration: "45 mins", category: "Program" },
      { time: "14:45", title: "Panel Discussion — Session I", description: "Industry leaders discuss key trends and innovation in the sector.", poc: "Moderator / MC", duration: "1 hr", category: "Program" },
      { time: "15:45", title: "Networking Tea Break", description: "Tea, coffee, and snacks served. Structured networking segment.", poc: "Hospitality Manager", duration: "30 mins", category: "Break" },
      { time: "16:15", title: "Workshop & Breakout Sessions", description: "Three parallel workshop tracks for delegate specializations.", poc: "Workshop Facilitators", duration: "1.5 hrs", category: "Program" },
      { time: "17:45", title: "Awards Ceremony", description: "Recognition of top performers, partners, and industry achievers.", poc: "MC / Presenter", duration: "1 hr", category: "Program" },
      { time: "18:45", title: "Gala Dinner Service", description: "Formal multi-course dinner with wine pairing and live background music.", poc: "Head Caterer / Sommelier", duration: "2 hrs", category: "Catering" },
      { time: "20:45", title: "Entertainment & Networking", description: "Live band performance, business card exchange, and informal networking.", poc: "Entertainment Director", duration: "1.5 hrs", category: "Program" },
      { time: "22:15", title: "Closing Remarks & Vote of Thanks", description: "Organizers thank all sponsors, speakers, and attendees.", poc: "MC / Senior Executive", duration: "20 mins", category: "Program" },
      { time: "22:35", title: "Guest Departure", description: "Delegate kits, souvenir bags distributed. Transportation arranged.", poc: "Guest Relations", duration: "30 mins", category: "Guest" },
      { time: "23:05", title: "Venue Teardown", description: "Equipment demounting, waste disposal, and venue handover.", poc: "Operations Lead", duration: "2 hrs", category: "Teardown" },
    ],
    "College Fest": [
      { time: "08:00", title: "Festival Ground Setup", description: "Stage, stalls, decoration, banners, and sound system installed.", poc: "Fest Organizer Committee", duration: "3 hrs", category: "Setup" },
      { time: "11:00", title: "Registration & Entry Opens", description: "Participant check-in, wristbands distributed, campus map shared.", poc: "Registration Volunteer Team", duration: "1 hr", category: "Guest" },
      { time: "12:00", title: "Inaugural Ceremony", description: "Chief guest address, lamp lighting, and cultural welcome performance.", poc: "Student President / Faculty Advisor", duration: "45 mins", category: "Program" },
      { time: "12:45", title: "Food Stalls & Activity Zones Open", description: "Food court, gaming zones, art exhibitions, and sponsor stalls open.", poc: "Stall Coordinator", duration: "All day", category: "Catering" },
      { time: "13:30", title: "Afternoon Competitions", description: "Multiple contests: coding hackathon, debate, dance-off, and talent show.", poc: "Competition Coordinators", duration: "4 hrs", category: "Program" },
      { time: "17:30", title: "Celebrity Guest Performance", description: "Headline musical act or comedy show on main stage.", poc: "Artist Relations Manager", duration: "1.5 hrs", category: "Program" },
      { time: "19:00", title: "Prize Distribution & Awards", description: "Winners announced across all categories. Prize distribution ceremony.", poc: "MC / Faculty Advisor", duration: "1 hr", category: "Program" },
      { time: "20:00", title: "DJ Night & Cultural Show", description: "High-energy DJ set, fashion show, and flash mob finale.", poc: "DJ / Cultural Secretary", duration: "2 hrs", category: "Program" },
      { time: "22:00", title: "Closing Ceremony", description: "Organizer thank-you address, sponsor acknowledgments, and farewell.", poc: "Student President", duration: "30 mins", category: "Program" },
      { time: "22:30", title: "Breakdown & Clean-Up", description: "All stalls closed. Cleaning crew mobilized. Campus restored.", poc: "Operations Head", duration: "2 hrs", category: "Teardown" },
    ],
    Anniversary: [
      { time: "16:00", title: "Venue Setup & Decor", description: "Floral centerpieces, mood lighting, memory photo walls, and table arrangements.", poc: "Event Decorator", duration: "2 hrs", category: "Setup" },
      { time: "18:00", title: "Guest Arrival & Cocktail Hour", description: "Welcome champagne and canapés as guests arrive and mingle.", poc: "Hospitality Manager", duration: "1 hr", category: "Guest" },
      { time: "19:00", title: "Anniversary Ceremony Opening", description: "MC introduces couple, plays memory montage video, and welcomes guests.", poc: "MC / AV Team", duration: "30 mins", category: "Program" },
      { time: "19:30", title: "Renewal of Vows / Special Moment", description: "Heartfelt vow renewal ceremony with family witnesses.", poc: "Officiant / MC", duration: "30 mins", category: "Program" },
      { time: "20:00", title: "Gala Dinner Service", description: "Curated multi-course dinner with live background music and table service.", poc: "Head Caterer", duration: "2 hrs", category: "Catering" },
      { time: "22:00", title: "Speeches & Toasts", description: "Family members and close friends share fond memories and wishes.", poc: "MC", duration: "45 mins", category: "Program" },
      { time: "22:45", title: "Cake Cutting & Dance", description: "Anniversary cake cutting followed by couple's dance and open dance floor.", poc: "DJ / MC", duration: "1.5 hrs", category: "Program" },
      { time: "00:15", title: "Guest Departure", description: "Thank-you gifts for guests. Shuttle service to nearby hotels.", poc: "Guest Relations", duration: "30 mins", category: "Guest" },
      { time: "00:45", title: "Venue Teardown", description: "Cleanup crew begins. Rentals collected. Venue handed back.", poc: "Venue Coordinator", duration: "1.5 hrs", category: "Teardown" },
    ],
    "Tech Conference": [
      { time: "07:30", title: "Venue Setup & Tech Install", description: "High-speed Wi-Fi, demo stations, digital signage, and AV configuration.", poc: "IT Infrastructure Lead", duration: "2.5 hrs", category: "Setup" },
      { time: "10:00", title: "Registration & Badge Collection", description: "Attendee check-in using QR codes. Welcome kit and session schedule distributed.", poc: "Registration Manager", duration: "1 hr", category: "Guest" },
      { time: "11:00", title: "Opening Keynote", description: "Chief Innovation Officer delivers vision speech and demo of flagship product.", poc: "CIO / Stage Director", duration: "1 hr", category: "Program" },
      { time: "12:00", title: "Breakout Sessions — Round 1", description: "Parallel technical tracks: AI/ML, Cloud, DevOps, Security.", poc: "Track Moderators", duration: "1 hr", category: "Program" },
      { time: "13:00", title: "Networking Lunch", description: "Catered lunch with sponsored stalls and structured networking tables.", poc: "Hospitality Manager", duration: "1 hr", category: "Catering" },
      { time: "14:00", title: "Hands-on Workshop", description: "Interactive coding labs and product demos with industry experts.", poc: "Workshop Leads", duration: "2 hrs", category: "Program" },
      { time: "16:00", title: "Startup Pitch Competition", description: "Selected startups present 5-minute pitches to expert jury panel.", poc: "Startup Coordinator / Jury", duration: "1.5 hrs", category: "Program" },
      { time: "17:30", title: "Fireside Chat & Q&A", description: "Candid conversation with industry leader. Audience Q&A session.", poc: "Moderator / Speaker", duration: "1 hr", category: "Program" },
      { time: "18:30", title: "Awards & Recognition Ceremony", description: "Best innovation, best startup, and community awards presented.", poc: "MC / Awards Committee", duration: "45 mins", category: "Program" },
      { time: "19:15", title: "Conference Networking Reception", description: "Evening reception with cocktails, sponsor activations, and speaker meet-and-greet.", poc: "Sponsorship Manager", duration: "1.5 hrs", category: "Catering" },
      { time: "20:45", title: "Closing Remarks & Day Wrap", description: "Conference chair closes the day. Preview of next day's schedule (if multi-day).", poc: "Conference Chair", duration: "20 mins", category: "Program" },
      { time: "21:05", title: "Venue Teardown Begins", description: "Equipment de-installation, waste management, and venue handover.", poc: "Operations Manager", duration: "2 hrs", category: "Teardown" },
    ],
  };

  return baseItems[eventType] ?? baseItems["Birthday"];
}

function buildMockVendorScripts(
  eventName: string,
  eventType: string,
  guestCount: number,
  theme: string,
  eventDate: string
): VendorScript[] {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [
    {
      type: "Invite",
      subject: `You're Invited! — ${eventName}`,
      body: `Dear [Guest Name],

We are thrilled to invite you to ${eventName}, a ${theme}-themed ${eventType.toLowerCase()} celebration!

📅 Date: ${formattedDate}
📍 Venue: [Venue Name], [City]
🎉 Dress Code: ${theme} Attire
👥 Expected Guests: ${guestCount}

The evening promises an unforgettable experience filled with exquisite dining, entertainment, and cherished moments.

Kindly RSVP by [RSVP Deadline] at the link below:
👉 [RSVP Link]

For queries, contact us at [Organizer Email] or [Phone Number].

We look forward to celebrating with you!

Warm regards,
[Organizer Name]
${eventName} Planning Team`,
      channel: "Email",
    },
    {
      type: "DietaryReminder",
      subject: `Dietary Preferences Reminder — ${eventName}`,
      body: `Hi [Guest Name]! 🎉

This is a quick reminder from the ${eventName} team.

We want to ensure your dining experience is perfect! Please confirm your dietary preferences by replying to this message:

🥗 Vegetarian
🥩 Non-Vegetarian
🌾 Vegan
⚠️ Allergy: [Please specify]

Please respond by [Deadline Date].

See you at the celebration! 🥂

— ${eventName} Hospitality Team`,
      channel: "WhatsApp",
    },
    {
      type: "VendorNegotiation",
      subject: `Vendor Partnership Inquiry — ${eventName} (${formattedDate})`,
      body: `Dear [Vendor Company Name],

I hope this message finds you well. My name is [Your Name] and I am the lead coordinator for ${eventName}, a ${theme}-themed ${eventType.toLowerCase()} event scheduled for ${formattedDate}.

Event Details:
- Event Type: ${eventType}
- Expected Attendance: ${guestCount} guests
- Theme: ${theme}
- Venue: [Venue Name]

We are evaluating vendors for [Service Type — Catering / AV / Decor / Photography] and believe your reputation aligns with our quality standards.

We would appreciate a detailed quotation inclusive of:
1. Base service package pricing
2. Per-head/per-unit cost breakdown
3. Availability confirmation for the event date
4. Portfolio or previous event references

We are committed to building a long-term vendor relationship and are open to negotiating a mutually beneficial agreement.

Please respond by [Response Deadline] to schedule a consultation call.

Looking forward to your proposal.

Best regards,
[Your Name]
${eventName} — Event Coordination Team
📧 [Email] | 📞 [Phone]`,
      channel: "Email",
    },
    {
      type: "ThankYou",
      subject: `Thank You for Making ${eventName} Unforgettable! 🎉`,
      body: `Dear [Guest Name],

On behalf of everyone at ${eventName}, we want to extend our heartfelt gratitude for your presence at our ${theme}-themed celebration on ${formattedDate}.

Your attendance made the evening truly special, and we hope you created wonderful memories that will last a lifetime.

We'd love to hear from you! Please take 2 minutes to share your experience:
👉 [Feedback Form Link]

As a token of our appreciation, a few highlights and photographs from the event will be shared with you shortly at [Photo Gallery Link].

Thank you once again for being part of this beautiful occasion. We look forward to celebrating many more milestones together!

With warmth and gratitude,
[Organizer Name]
${eventName} Team 🥂`,
      channel: "Email",
    },
  ];
}
