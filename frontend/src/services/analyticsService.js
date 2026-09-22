import api from "./api.js";

export const getAnalyticsData = async (
  range = "Month"
) => {
  const response = await api.get(
    `/analytics?range=${encodeURIComponent(range)}`
  );

  return response.data;
};