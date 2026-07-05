import API_BASE from "./api";

export async function login(email: string, password: string) {

    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    return response.json();
}

export async function signup(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    company: string
) {

    const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            company
        })
    });

    return response.json();
}