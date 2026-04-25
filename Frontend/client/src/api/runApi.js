const API = "http://localhost:3000";



async function startRun() {
    const res = await fetch(`${API}/run/start`, {
        method: "POST",
        credentials: "include"
    });

    const data = await res.json().catch(() => ({}));
    console.log("START RUN:", res.status, data);

    if (!res.ok) {
        alert(`Start run failed: ${data.error || data.message || res.status}`);
        return;
    }

    runId = data.runId;
    renderBattle(data);
}

async function attack(moveIndex) {
    const res = await fetch(`${API}/run/${runId}/attack`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moveIndex })
    });

    const data = await res.json().catch(() => ({}));
    console.log("ATTACK:", res.status, data);

    if (!res.ok) {
        alert(`Attack failed: ${data.error || data.message || res.status}`);
        return;
    }

    renderBattle(data);
}