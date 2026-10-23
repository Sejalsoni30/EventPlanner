import { useState, useCallback } from "react";
import type { EventFormData, EventPlan, GuestMilestone, AppStep, EventType } from "./types";
import { calculateBudgetDistribution } from "./utils/budgetCalculator";
import { generateEventContent } from "./utils/aiGenerator";
import { generateDefaultMilestones } from "./utils/milestoneUtils";
import LandingPage from "./components/LandingPage";
import EventSetupWizard from "./components/EventSetupWizard";
import EventDashboard from "./components/EventDashboard";
import LoadingScreen from "./components/LoadingScreen";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  const [step, setStep] = useState<AppStep>("landing");
  const [selectedEventType, setSelectedEventType] = useState<EventType | undefined>(undefined);
  const [eventPlan, setEventPlan] = useState<EventPlan | null>(null);
  const [pendingFormData, setPendingFormData] = useState<EventFormData | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  const handleStartWizard = useCallback((eventType?: EventType) => {
    setSelectedEventType(eventType);
    setStep("wizard");
  }, []);

  const handleFormSubmit = useCallback(async (formData: EventFormData) => {
    setStep("generating");
    setPendingFormData(formData);

    try {
      const [{ itinerary, vendorScripts }] = await Promise.all([
        generateEventContent(formData, apiKey || undefined),
        // Simulate slight delay for UX smoothness
        new Promise((r) => setTimeout(r, 1200)),
      ]);

      const budgetDistribution = calculateBudgetDistribution(formData.budget, formData.currency);
      const milestones = generateDefaultMilestones(formData.eventType, formData.eventDate);

      const plan: EventPlan = {
        formData,
        budgetDistribution,
        itinerary,
        milestones,
        vendorScripts,
        generatedAt: new Date().toISOString(),
      };

      setEventPlan(plan);
      setStep("dashboard");
    } catch (error) {
      console.error("Failed to generate event plan:", error);
      setStep("wizard");
      alert("Failed to generate event plan. Please try again.");
    }
  }, [apiKey]);

  const handleReset = useCallback(() => {
    setStep("landing");
    setSelectedEventType(undefined);
    setEventPlan(null);
    setPendingFormData(null);
  }, []);

  const handleMilestonesUpdate = useCallback((milestones: GuestMilestone[]) => {
    setEventPlan((prev) => prev ? { ...prev, milestones } : prev);
  }, []);

  return (
    <ThemeProvider>
      {step === "generating" && <LoadingScreen eventName={pendingFormData?.eventName} />}
      {step === "dashboard" && eventPlan && (
        <EventDashboard
          plan={eventPlan}
          onReset={handleReset}
          onMilestonesUpdate={handleMilestonesUpdate}
        />
      )}
      {step === "wizard" && (
        <EventSetupWizard
          onSubmit={handleFormSubmit}
          isGenerating={false}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          initialEventType={selectedEventType}
          onBack={() => setStep("landing")}
        />
      )}
      {step === "landing" && <LandingPage onGetStarted={handleStartWizard} />}
    </ThemeProvider>
  );
}
