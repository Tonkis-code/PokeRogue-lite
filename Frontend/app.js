const API = "http://localhost:3000";

let runId = null;

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetch(`${API}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    alert("Registered!");
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    alert("Logged in!");
}

async function startRun() {
    const res = await fetch(`${API}/run/start`, {
        method: "POST",
        credentials: "include"
    });

    const data = await res.json();

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

    const data = await res.json();

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