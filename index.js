const mineflayer = require("mineflayer");

const usernames = [
  "Leaf_Guardian",
  "Leaf_Realm",
  "ForestSoul_1",
  "Leafy_Knight"
];

let currentUser = 0;
let bot = null;

// --- Create bot function ---
function createBot() {
  if (bot) {
    console.log("⚠️ Existing bot instance found, quitting before reconnect...");
    try {
      bot.quit();
    } catch (e) {
      console.log("⚠️ Error while quitting old bot:", e.message);
    }
    bot = null;
  }

  const username = usernames[currentUser % usernames.length];
  console.log(`🤖 Starting bot with username: ${username}`);

  bot = mineflayer.createBot({
    host: "FireMC78.aternos.me", // your Aternos IP (no https)
    port: 14961, // your Aternos port
    username: username,
    version: false // auto-detect version
  });

  const password = "836837"; // your cracked server password

  // --- Auto login/register ---
  bot.on("messagestr", (msg) => {
    console.log("📩 Server:", msg);

    if (msg.toLowerCase().includes("register")) {
      bot.chat(`/register ${password} ${password}`);
      console.log("🔑 Sent /register");
    }

    if (msg.toLowerCase().includes("login")) {
      bot.chat(`/login ${password}`);
      console.log("🔑 Sent /login");
    }
  });

  // --- Respawn after death ---
  bot.on("death", () => {
    console.log("💀 Bot died, respawning...");
    setTimeout(() => bot.chat("/respawn"), 3000);
  });

  // --- Start Anti-AFK after joining ---
  bot.once("spawn", () => {
    console.log(`✅ Bot ${username} spawned successfully! Starting Anti-AFK...`);
    setTimeout(() => startAntiAFK(bot), 10000);
  });

  // --- Handle disconnect ---
  bot.on("end", () => {
    console.log(`❌ Bot ${username} disconnected. Reconnecting in 30s...`);
    reconnect();
  });

  bot.on("kicked", (reason) => {
    console.log(`⚠️ Bot ${username} was kicked: ${reason}`);
    reconnect();
  });

  bot.on("error", (error) => {
    console.log(`⚠️ Bot ${username} error: ${error.message}`);
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      console.log("🌐 Network error detected. Reconnecting...");
      reconnect(20000);
    }
  });
}

// --- Reconnect handler (only 1 bot at a time) ---
function reconnect(delay = 30000) {
  if (bot) {
    try {
      bot.quit();
    } catch (e) {
      console.log("⚠️ Error while quitting bot:", e.message);
    }
    bot = null;
  }

  currentUser = (currentUser + 1) % usernames.length;
  console.log(`⏳ Reconnecting as ${usernames[currentUser]} in ${delay / 1000}s...`);
  setTimeout(createBot, delay);
}

// --- Anti-AFK system ---
function startAntiAFK(bot) {
  console.log("🚀 Anti-AFK started!");

  setInterval(() => {
    if (!bot.entity) return;

    const actions = ["forward", "back", "left", "right"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    bot.setControlState(action, true);

    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, false);

    if (Math.random() > 0.5) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
    }

    if (Math.random() > 0.5) {
      bot.swingArm("right");
    }

    setTimeout(() => bot.setControlState(action, false), 2000);
  }, 30000);

  // --- Send chat messages every 10 mins ---
  const messages = [
    "/say Do Not Try To Cheat You Can Be Banned For This",
    "/say If You Find Anyone Cheat Inform Immediately On Our Discord Server With Proof",
    "/say Subscribe To Shadow Realms"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log("💬 Sent:", msg);
  }, 600000);
}

// --- Start first bot ---
createBot();
