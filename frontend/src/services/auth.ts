// apiAuth.ts (or wherever your fetch functions live)
import API_BASE from "./api";

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/api/login`, { // Note: Removed /auth if your router isn't prefixed
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || "Login failed");
    }
    return data; // Returns { access_token, token_type, user }
}

export async function signup(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    company: string
) {
    const response = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            company
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
    }
    return data; // Returns UserResponse schema
}