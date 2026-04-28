const API = "http://localhost:3000";



export async function startRun() {
    const res = await fetch(`${API}/run/start`, {
        method: "POST",
        credentials: "include"
    });

    const data = await res.json().catch(() => ({}));
    console.log("START RUN:", res.status, data);

    if (!res.ok) {
        throw new Error(`Start run failed: ${data.error || data.message || res.status}`);
    }

    return data;
}

export async function attack(runId, moveIndex) {
    const res = await fetch(`${API}/run/${runId}/attack`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moveIndex })
    });

    const data = await res.json().catch(() => ({}));
    console.log("ATTACK:", res.status, data);

    if (!res.ok) {
        throw new Error(`Attack failed: ${data.error || data.message || res.status}`);
    }

    return data;
}