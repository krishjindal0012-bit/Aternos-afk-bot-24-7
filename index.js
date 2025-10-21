const mineflayer = require("mineflayer");

// --- List of usernames for reconnect ---
const usernames = [
  "Leafy_Land",
  "Moderator",
  "LeafyLand",
  "Moderator_2"
];

let currentUser = 0; // start from first username

let reconnectAttempts = 0;
const maxReconnects = 4;

function createBot() {
  const username = usernames[currentUser % usernames.length];
  console.log(`🤖 Starting bot with username: ${username}`);

  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me", // <-- your Aternos IP
    port: 49059,
    username: username
  });

  const password = "456789"; // password for /register & /login
  
// --- Auto reconnect on end ---
bot.on("end", () => {
  if (reconnectAttempts < maxReconnects) {
    reconnectAttempts++;
    console.log(`❌ Bot disconnected. Reconnecting in 10s... (Attempt ${reconnectAttempts}/${maxReconnects})`);
    currentUser++; // move to next username
    setTimeout(createBot, 10000);
  } else {
    console.log("🛑 Max reconnect attempts reached. Stopping bot.");
  }
});

// --- Handle connection errors (like ECONNRESET) ---
bot.on("error", (err) => {
  console.log(`⚠️ Bot ${username} error:`, err.code || err.message);
  if ((err.code === "ECONNRESET" || err.code === "ECONNREFUSED") && reconnectAttempts < maxReconnects) {
    reconnectAttempts++;
    console.log(`🔁 Retrying in 10s... (Attempt ${reconnectAttempts}/${maxReconnects})`);
    setTimeout(createBot, 10000);
  } else if (reconnectAttempts >= maxReconnects) {
    console.log("🛑 Max reconnect attempts reached due to error. Stopping bot.");
  }
});
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

  // --- Auto respawn ---
  bot.on("death", () => {
    console.log("💀 Bot died, respawning...");
    setTimeout(() => bot.chat("/respawn"), 3000);
  });

  // --- Start Anti-AFK after spawn ---
  bot.once("spawn", () => {
    console.log(`✅ Bot ${username} spawned, starting Anti-AFK...`);
    setTimeout(() => startAntiAFK(bot), 10000);
  });

  // --- Auto reconnect ---
  bot.on("end", () => {
    console.log(`❌ Bot ${username} disconnected. Reconnecting in 30s...`);
    currentUser++; // move to next username
    setTimeout(createBot, 30000); // wait 30s
  });

  bot.on("kicked", (reason) => {
    console.log(`⚠️ Bot ${username} kicked:`, reason);
  });

  bot.on("error", (err) => {
    console.log(`⚠️ Bot ${username} error:`, err);
  });
}

// --- Anti-AFK system ---
function startAntiAFK(bot) {
  console.log("🚀 Anti-AFK started!");

  setInterval(() => {
    if (!bot.entity) return;

    // Pick random movement
    const actions = ["forward", "back", "left", "right"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    bot.setControlState(action, true);

    // Random head movement
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, false);

    // Jump sometimes
    if (Math.random() > 0.4) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 300);
    }

    // Swing arm sometimes
    if (Math.random() > 0.5) {
      bot.swingArm("right");
    }

    // Stop moving after 2s
    setTimeout(() => bot.setControlState(action, false), 2000);

  }, 8000); // every 8s

  // Random chat messages
  const messages = [
    "Do Not Try To Cheat You Can Be Banned For This",
        "If You Find Anyone Cheat Inform Immediately On Our Discord Server With Proof",
        "Subscribe To Shadow Realms"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log("💬 Sent:", msg);
  }, 600000); // every 10 min
}

createBot();
