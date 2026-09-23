import api from "./api.js";

// Helpers for storing and reading the logged-in user's info in localStorage.
// The user object (name, email, etc.) is kept in localStorage so the UI can
// greet the user and survive page refreshes without an extra API call.
// fetchUserProfile() covers cases where storage was cleared but the token
// is still valid.

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("authChanged"));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("authChanged"));
}

// Fetches the logged-in user's profile from the backend.
export async function fetchUserProfile() {
  const response = await api.get("/auth/me");
  return response.data.user;
}
