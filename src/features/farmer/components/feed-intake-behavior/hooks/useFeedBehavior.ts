import { useState, useMemo } from "react";
import {
  type FeedIntakeRecord,
  type FeedBehavior,
  MOCK_FEED_RECORDS,
} from "../constants";
import { calculateFeedIntakeSummary } from "../utils";

export const useFeedBehavior = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentBehavior, setCurrentBehavior] =
    useState<FeedBehavior>("eating_well");
  const [newRecord, setNewRecord] = useState<Partial<FeedIntakeRecord>>({
    date: new Date().toISOString().split("T")[0],
    behavior: "eating_well",
    percentage: 100,
    timeOfDay: "morning",
    flockSize: 1000,
    feedConsumed: 0,
    notes: "",
  });

  const records = useMemo(() => {
    return MOCK_FEED_RECORDS;
  }, []);

  const summary = useMemo(() => {
    return calculateFeedIntakeSummary(records);
  }, [records]);

  const handleAddRecord = () => {
    if (!newRecord.behavior || !newRecord.date) return;

    const record: FeedIntakeRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      behavior: newRecord.behavior,
      percentage: newRecord.percentage || 0,
      timeOfDay: newRecord.timeOfDay || "morning",
      flockSize: newRecord.flockSize || 1000,
      feedConsumed: newRecord.feedConsumed || 0,
      notes: newRecord.notes,
    };

    // In a real app, this would be saved to the backend
    console.log("Adding new record:", record);

    // Reset form
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      behavior: "eating_well",
      percentage: 100,
      timeOfDay: "morning",
      flockSize: 1000,
      feedConsumed: 0,
      notes: "",
    });

    setIsAddDialogOpen(false);
  };

  const handleNewRecordChange = (updatedRecord: Partial<FeedIntakeRecord>) => {
    setNewRecord(updatedRecord);
  };

  const handleBehaviorChange = (behavior: FeedBehavior) => {
    setCurrentBehavior(behavior);
  };

  return {
    records,
    summary,
    currentBehavior,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newRecord,
    handleNewRecordChange,
    handleAddRecord,
    handleBehaviorChange,
  };
};
