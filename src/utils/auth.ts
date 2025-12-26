export function getUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid user data in localStorage:", user);
    localStorage.removeItem("user"); // 🧹 clean broken data
    return null;
  }
}

export function isLoggedIn() {
  return !!getUser();
}
