import { useState, useEffect } from "react";
import {
  getFarmerData,
  type FarmerData,
} from "../../../services/farmer-service";

export const useFarmerData = () => {
  const [data, setData] = useState<FarmerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const farmerData = await getFarmerData();
      setData(farmerData);
      setError(null);
    } catch (err) {
      setError("Failed to load farmer data");
      console.error("Error loading farmer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, error, refetch: loadData };
};
