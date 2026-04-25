const API = "http://localhost:3000";

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    console.log("REGISTER:", res.status, data);

    if (!res.ok) {
        alert(`Register failed: ${data.error || data.message || res.status}`);
        return;
    }

    alert("Registered!");
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    console.log("LOGIN:", res.status, data);

    if (!res.ok) {
        alert(`Login failed: ${data.error || data.message || res.status}`);
        return;
    }

    alert("Logged in!");
}
