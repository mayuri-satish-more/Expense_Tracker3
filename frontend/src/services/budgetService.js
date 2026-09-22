import api from "./api.js";

export const getBudget = async () => {
  const response = await api.get("/budgets");
  return response.data;
};

export const saveBudget = async (budgetData) => {
  const response = await api.post(
    "/budgets",
    budgetData
  );

  return response.data;
};