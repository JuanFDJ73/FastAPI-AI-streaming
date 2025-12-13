const VITE_API_URL = import.meta.env.VITE_API_URL;

export async function apiPost(path, data) {
  const res = await fetch(`${VITE_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiGet(path) {
  const res = await fetch(`${VITE_API_URL}${path}`);
  return res.json();
}