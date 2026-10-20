import { useState, useCallback } from "react";
import type { EventFormData, EventPlan, GuestMilestone, AppStep } from "./types";
import { calculateBudgetDistribution } from "./utils/budgetCalculator";
import { generateEventContent } from "./utils/aiGenerator";
import { generateDefaultMilestones } from "./utils/milestoneUtils";
import EventSetupWizard from "./components/EventSetupWizard";
import EventDashboard from "./components/EventDashboard";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [step, setStep] = useState<AppStep>("wizard");
  const [eventPlan, setEventPlan] = useState<EventPlan | null>(null);
  const [pendingFormData, setPendingFormData] = useState<EventFormData | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

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
    setStep("wizard");
    setEventPlan(null);
    setPendingFormData(null);
  }, []);

  const handleMilestonesUpdate = useCallback((milestones: GuestMilestone[]) => {
    setEventPlan((prev) => prev ? { ...prev, milestones } : prev);
  }, []);

  if (step === "generating") {
    return <LoadingScreen eventName={pendingFormData?.eventName} />;
  }

  if (step === "dashboard" && eventPlan) {
    return (
      <EventDashboard
        plan={eventPlan}
        onReset={handleReset}
        onMilestonesUpdate={handleMilestonesUpdate}
      />
    );
  }

  return (
    <EventSetupWizard
      onSubmit={handleFormSubmit}
      isGenerating={false}
      apiKey={apiKey}
      onApiKeyChange={setApiKey}
    />
  );
}
