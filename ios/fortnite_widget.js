// Variables
const API_KEY = "264799df-4d52-4a87-8b7f-6ec00be5dc31";
let USER = "Ninja"; // Default config

// 1. Get Widget Parameter (User input)
if (args.widgetParameter) {
    USER = args.widgetParameter;
}

// 2. Run Widget
if (config.runsInWidget) {
    const widget = await createWidget();
    Script.setWidget(widget);
} else {
    const widget = await createWidget();
    widget.presentMedium();
}
Script.complete();

// 3. UI Construction
async function createWidget() {
    const data = await fetchStats(USER);
    const widget = new ListWidget();

    // Background Gradient (Gamer Vibes)
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [
        new Color("#0f1014"),
        new Color("#1a1c24")
    ];
    widget.backgroundGradient = gradient;

    if (!data || data.error) {
        showError(widget, data ? data.error : "Usuario no encontrado");
        return widget;
    }

    const { account, battlePass, stats } = data;
    const overall = stats.all.overall;

    // --- Layout ---
    let mainStack = widget.addStack();
    mainStack.layoutHorizontally();

    // Left Column: Avatar & Name
    let leftCol = mainStack.addStack();
    leftCol.layoutVertically();
    leftCol.centerAlignContent();

    // Avatar Circle (simulated with text for now, could be image)
    let avatarStack = leftCol.addStack();
    avatarStack.size = new Size(50, 50);
    avatarStack.backgroundColor = new Color("#bf5af2");
    avatarStack.cornerRadius = 25;
    avatarStack.centerAlignContent();
    let avatarTxt = avatarStack.addText(account.name.charAt(0).toUpperCase());
    avatarTxt.font = Font.heavySystemFont(24);
    avatarTxt.textColor = Color.white();

    leftCol.addSpacer(8);

    let nameTxt = leftCol.addText(account.name);
    nameTxt.font = Font.boldSystemFont(14);
    nameTxt.textColor = Color.white();
    nameTxt.lineLimit = 1;

    let levelTxt = leftCol.addText(`Lvl ${battlePass.level}`);
    levelTxt.font = Font.systemFont(10);
    levelTxt.textColor = new Color("#a0a0a0");

    mainStack.addSpacer(); // Spacer between columns

    // Right Column: Stats Grid
    let rightCol = mainStack.addStack();
    rightCol.layoutVertically();
    rightCol.spacing = 6;

    // Row 1: Wins
    addStatRow(rightCol, "VICTORIAS", overall.wins, "👑", "#32d74b");
    // Row 2: K/D
    addStatRow(rightCol, "K/D RATIO", overall.kd.toFixed(2), "🎯", "#ff9f0a");
    // Row 3: Win Rate
    addStatRow(rightCol, "WIN RATE", overall.winRate.toFixed(1) + "%", "📈", "#0a84ff");

    return widget;
}

function addStatRow(stack, label, value, icon, colorHex) {
    let row = stack.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    row.backgroundColor = new Color("#ffffff", 0.05);
    row.cornerRadius = 8;
    row.setPadding(4, 8, 4, 8);

    let iconTxt = row.addText(icon);
    iconTxt.font = Font.systemFont(12);
    row.addSpacer(6);

    let valTxt = row.addText(`${value}`);
    valTxt.font = Font.boldSystemFont(14);
    valTxt.textColor = new Color(colorHex);

    row.addSpacer(4);

    let lblTxt = row.addText(label);
    lblTxt.font = Font.systemFont(8);
    lblTxt.textColor = new Color("#888888");
}

function showError(widget, msg) {
    let t = widget.addText("⚠️ Error");
    t.textColor = Color.red();
    widget.addSpacer(5);
    let m = widget.addText(msg);
    m.font = Font.systemFont(10);
    m.textColor = Color.white();
}

// 4. API Fetching
async function fetchStats(user) {
    // !IMPORTANT: Using the direct API for speed, avoiding proxy latency for widgets
    // In production, you might point this to your Vercel API /api/stats
    let url = `https://fortnite-api.com/v2/stats/br/v2?name=${user}&accountType=epic`;
    let req = new Request(url);
    req.headers = { "Authorization": API_KEY };
    try {
        let json = await req.loadJSON();
        if (json.status === 200) return json.data;
        return { error: json.error || "Datos no disponibles" };
    } catch (e) {
        return { error: "Sin conexión" };
    }
}
