import api from "./api.js";

export const createTransaction = async (transactionData) => {
  const formData = new FormData();

  Object.entries(transactionData).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      if (key === "attachment" && value instanceof File) {
        formData.append("attachment", value);
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await api.post(
    "/transactions",
    formData
  );

  return response.data;
};



export const getTransactions = async (params = {}) => {
  const response = await api.get(
    "/transactions",
    {
      params,
    }
  );

  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(
    `/transactions/${id}`
  );

  return response.data;
};
export const updateTransaction = async (
  id,
  transactionData
) => {
  const formData = new FormData();

  Object.entries(transactionData).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      if (key === "attachment" && value instanceof File) {
        formData.append("attachment", value);
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await api.put(
    `/transactions/${id}`,
    formData
  );

  return response.data;
};
export const deleteTransaction = async (id) => {
  const response = await api.delete(
    `/transactions/${id}`
  );

  return response.data;
};


export const exportTransactionsCSV = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  const response = await api.get(
    `/transactions/export?${params.toString()}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expenseflow-transactions-${Date.now()}.csv`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
