const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export function setToken(token, value) {
  token = localStorage.setItem(token, value);
}

export function getToken(token) {
  return localStorage.getItem(token);
}

export function clearToken(tokenName) {
  localStorage.removeItem(tokenName);
}

export async function apiPost(path, body) {
  const accessToken = getToken("accessToken");

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}

export async function apiGet(path) {
  const accessToken = getToken("accessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP_${res.status}`);
  return data;
}
