import { apiFetch } from "./api";

// ===== TYPES =====
export interface Signal {
  id: number;
  symbol: string;
  type: "long" | "short";
  status: "active" | "running" | "cancelled" | "profit" | "loss";
  entry_price: string;
  sl_price: string;
  tp_price?: string;
  sender_id?: string;
  created_at?: string;
}

// Generic API response
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ===== API CALLS =====

// GET all signals
export const getSignals = async () => {
  const res = await apiFetch<ApiResponse<Signal[]>>("/signal");
  return res.data;
};

// GET signals by sender
export const getSignalBySender = async (senderId: string) => {
  const res = await apiFetch<ApiResponse<Signal[]>>(
    `/signal/sender/${senderId}`
  );
  return res.data;
};

// GET my signals
export const getMySignals = async () => {
  const res = await apiFetch<ApiResponse<Signal[]>>("/signal/my");
  return res.data;
};

// GET detail
export const getSignalDetail = async (id: number) => {
  const res = await apiFetch<ApiResponse<Signal>>(`/signal/${id}`);
  return res.data;
};

// CREATE
export const createSignal = async (data: Partial<Signal>) => {
  const res = await apiFetch<ApiResponse<Signal>>("/signal", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

// UPDATE
export const updateSignal = async (id: number, data: Partial<Signal>) => {
  const res = await apiFetch<ApiResponse<Signal>>(`/signal/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

// DELETE
export const deleteSignal = async (id: number) => {
  const res = await apiFetch<ApiResponse<null>>(`/signal/${id}`, {
    method: "DELETE",
  });
  return res.success;
};