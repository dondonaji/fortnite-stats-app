// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: gamepad;

// --- CONFIGURATION ---
const API_KEY = "264799df-4d52-4a87-8b7f-6ec00be5dc31"; // Tu API Key
const USERNAME = "Tfue"; // Jugador por defecto

// --- MAIN LOGIC ---
if (config.runsInWidget) {
    const widget = await createWidget();
    Script.setWidget(widget);
} else {
    const widget = await createWidget();
    widget.presentMedium();
}
Script.complete();

async function createWidget() {
    const data = await fetchStats(USERNAME);
    const widget = new ListWidget();

    // Background Color (Dark Theme)
    widget.backgroundColor = new Color("#1a1c24");

    if (!data) {
        const errText = widget.addText("Error loading stats");
        errText.textColor = Color.red();
        return widget;
    }

    const stats = data.stats.all.overall;

    // --- HEADER ---
    const titleStack = widget.addStack();
    titleStack.layoutHorizontally();

    const icon = titleStack.addText("🎮");
    icon.font = Font.largeTitle();

    titleStack.addSpacer(8);

    const userStack = titleStack.addStack();
    userStack.layoutVertically();

    const userText = userStack.addText(data.account.name);
    userText.font = Font.boldSystemFont(16);
    userText.textColor = Color.white();

    const subText = userStack.addText("Lifetime Stats");
    subText.font = Font.systemFont(10);
    subText.textColor = new Color("#a0a0a0");

    widget.addSpacer(12);

    // --- STATS ROW 1 ---
    const row1 = widget.addStack();
    row1.layoutHorizontally();
    addStat(row1, "WINS", stats.wins, "#32d74b");
    row1.addSpacer();
    addStat(row1, "K/D", stats.kd.toFixed(2), "#ff9f0a");

    widget.addSpacer(8);

    // --- STATS ROW 2 ---
    const row2 = widget.addStack();
    row2.layoutHorizontally();
    addStat(row2, "MATCHES", stats.matches, "#0a84ff");
    row2.addSpacer();
    addStat(row2, "WIN %", stats.winRate.toFixed(1) + "%", "#bf5af2");

    return widget;
}

function addStat(stack, label, value, colorHex) {
    const vStack = stack.addStack();
    vStack.layoutVertically();

    const lbl = vStack.addText(label);
    lbl.font = Font.systemFont(8);
    lbl.textColor = new Color("#a0a0a0");

    const val = vStack.addText(`${value}`);
    val.font = Font.heavySystemFont(18);
    val.textColor = new Color(colorHex);
}

async function fetchStats(player) {
    const url = `https://fortnite-api.com/v2/stats/br/v2?name=${player}&accountType=epic`;
    const req = new Request(url);
    req.headers = { "Authorization": API_KEY };

    try {
        const json = await req.loadJSON();
        if (json.status === 200) {
            return json.data;
        }
        return null;
    } catch (e) {
        return null;
    }
}
