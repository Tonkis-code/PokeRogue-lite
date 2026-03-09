const API = "http://localhost:3000";

let runId = null;

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
    console.log("ATTACK:", res.status, data );

    if (!res.ok) {
        alert(`Attack failed: ${data.error || data.message || res.status}`);
        return;
    }

    renderBattle(data);
}

function renderBattle(data) {
    const battle = data.battle;

    document.getElementById("battle").innerHTML = `
        <p>Floor: ${data.floor}</p>
        <p>Player: ${battle.player.name} HP ${battle.player.hp}/${battle.player.maxHp}</p>
        <p>Enemy: ${battle.enemy.name} HP ${battle.enemy.hp}/${battle.enemy.maxHp}</p>
    `;
}