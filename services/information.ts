import { apiFetch } from "./api";

// ===== TYPES =====
export interface Information {
  id: number;
  title: string;
  body: string; // 🔥 updated from content → body
  sender_id?: string;
  sender?: string;
  created_at?: string;
}


// ===== HELPER =====
const unwrap = <T>(res: any): T => {
  if (res?.data !== undefined) return res.data;
  return res;
};

// ===== API CALLS =====

// GET all infos
export const getAllInfos = async () => {
  const res = await apiFetch("/information");
  return unwrap<Information[]>(res);
};

// GET new infos
export const getNewInfos = async () => {
  const res = await apiFetch("/information/new");
  return unwrap<Information[]>(res);
};

// GET detail
export const getInfoDetail = async (id: number) => {
  const res = await apiFetch(`/information/${id}`);
  return unwrap<Information>(res);
};

// CREATE
export const createInfo = async (data: Partial<Information>) => {
  const res = await apiFetch("/information", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return unwrap<Information>(res);
};

// UPDATE
export const updateInfo = async (id: number, data: Partial<Information>) => {
  const res = await apiFetch(`/information/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return unwrap<Information>(res);
};

// DELETE
export const deleteInfo = async (id: number) => {
  const res = await apiFetch(`/information/${id}`, {
    method: "DELETE",
  });
  return unwrap<boolean>(res);
};