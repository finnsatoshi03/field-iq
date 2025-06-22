import { useState, useMemo } from "react";
import {
  type HealthIssue,
  type TimePeriod,
  TIME_PERIODS,
  MOCK_DAILY_ISSUES,
  MOCK_WEEKLY_ISSUES,
} from "../constants";
import { calculateHealthSummary } from "../utils";

export const useHealthWatch = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TIME_PERIODS.DAILY);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<HealthIssue>>({
    date: new Date().toISOString().split("T")[0],
    count: 0,
    type: undefined,
    severity: "low",
    description: "",
    notes: "",
  });

  const issues = useMemo(() => {
    return timePeriod === TIME_PERIODS.DAILY
      ? MOCK_DAILY_ISSUES
      : MOCK_WEEKLY_ISSUES;
  }, [timePeriod]);

  const summary = useMemo(() => {
    return calculateHealthSummary(issues);
  }, [issues]);

  const handleAddIssue = () => {
    if (!newIssue.type || !newIssue.description) return;

    const issue: HealthIssue = {
      id: Date.now().toString(),
      date: newIssue.date || new Date().toISOString().split("T")[0],
      type: newIssue.type,
      count: newIssue.count || 0,
      severity: newIssue.severity || "low",
      description: newIssue.description,
      notes: newIssue.notes,
    };

    // In a real app, this would be saved to the backend
    console.log("Adding new issue:", issue);

    // Reset form
    setNewIssue({
      date: new Date().toISOString().split("T")[0],
      count: 0,
      type: undefined,
      severity: "low",
      description: "",
      notes: "",
    });

    setIsAddDialogOpen(false);
  };

  const handleNewIssueChange = (updatedIssue: Partial<HealthIssue>) => {
    setNewIssue(updatedIssue);
  };

  return {
    timePeriod,
    setTimePeriod,
    issues,
    summary,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newIssue,
    handleNewIssueChange,
    handleAddIssue,
  };
};
