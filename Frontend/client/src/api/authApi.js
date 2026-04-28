const API = "http://localhost:3000";

export async function register(email, password) {
    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    console.log("REGISTER:", res.status, data);

    if (!res.ok) {
        throw new Error(`Register failed: ${data.error || data.message || res.status}`);
    }

    return data;
}

export async function login(email, password) {

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    console.log("LOGIN:", res.status, data);

    if (!res.ok) {
        throw new Error(`Login failed: ${data.error || data.message || res.status}`);
    }

    return data;
}
