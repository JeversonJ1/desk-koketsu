const API_URL = "http://localhost:8000/api";

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}
