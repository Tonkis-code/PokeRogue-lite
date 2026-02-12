app.post("/run/start", (req, res) => {
    activeRun = new Run();
    res.json(activeRun.getState());
});

app.post("/run/attack", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run."});
    }

    const result = activeRun.attack(0);
    res.json(result);
});

app.get("/run/state", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run." });
    }

    res.json(activeRun.getState());
});