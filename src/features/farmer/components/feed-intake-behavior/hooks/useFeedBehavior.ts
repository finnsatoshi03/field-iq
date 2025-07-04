import { useState, useMemo, useEffect } from "react";
import {
  type FeedIntakeRecord,
  type FeedBehavior,
  type FeedIntakeSummary,
  MOCK_FEED_RECORDS,
  MOCK_FEED_SUMMARY,
  useFeedIntakeData, // Import the new function
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

  // State for API data
  const [apiData, setApiData] = useState<{
    feedRecords: FeedIntakeRecord[];
    feedSummary: FeedIntakeSummary;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await useFeedIntakeData();
        setApiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching feed intake data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use API data if available, otherwise fall back to mock data
  const records = useMemo(() => {
    if (apiData) {
      return apiData.feedRecords;
    }
    return MOCK_FEED_RECORDS;
  }, [apiData]);

  const summary = useMemo(() => {
    if (apiData) {
      return apiData.feedSummary;
    }
    // Fallback to calculating from mock data
    return calculateFeedIntakeSummary(records);
  }, [apiData, records]);

  // Function to refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await useFeedIntakeData();
      setApiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
      console.error("Error refreshing feed intake data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async () => {
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

    // TODO: Add API call to save the record
    // await saveFeedIntakeRecord(record);

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

    // Refresh data after adding new record
    await refreshData();
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
    // New API-related returns
    isLoading,
    error,
    refreshData,
  };
};
