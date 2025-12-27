const API_URL = (import.meta?.env?.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  if (!res.ok) {
    const err = new Error(body?.detail || body || res.statusText || "HTTP error");
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function apiPost(path, data, { auth = false } = {}) {
  const headers = auth ? getAuthHeaders() : { "Content-Type": "application/json" };
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiGet(path, { auth = false } = {}) {
  const headers = auth ? getAuthHeaders() : undefined;
  const res = await fetch(`${API_URL}${path}`, { headers });
  return handleResponse(res);
}

export async function apiPostStream(path, data, { auth = false } = {}) {
  const headers = auth
    ? { ...getAuthHeaders() }
    : { "Content-Type": "application/json" };

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok || !res.body) {
    throw new Error("Streaming no soportado");
  }

  return res.body.getReader();
}

export { API_URL };