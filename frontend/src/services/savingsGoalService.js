import api from "./api.js";

export const getSavingsGoals = async () => {
  const response = await api.get(
    "/savings-goals"
  );

  return response.data;
};

export const createSavingsGoal = async (
  goalData
) => {
  const response = await api.post(
    "/savings-goals",
    goalData
  );

  return response.data;
};

export const updateSavingsGoal = async (
  id,
  goalData
) => {
  const response = await api.put(
    `/savings-goals/${id}`,
    goalData
  );

  return response.data;
};

export const deleteSavingsGoal = async (
  id
) => {
  const response = await api.delete(
    `/savings-goals/${id}`
  );

  return response.data;
};