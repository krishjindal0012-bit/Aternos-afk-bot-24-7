const mineflayer = require("mineflayer");

// --- List of usernames for reconnect ---
const usernames = [
  "Leafy_Land",
  "Moderator",
  "LeafyLand",
  "Moderator_2"
];

let currentUser = 0; // start from first username

function createBot() {
  const username = usernames[currentUser % usernames.length];
  console.log(`🤖 Starting bot with username: ${username}`);

  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me", // <-- your Aternos IP
    port: 49059,
    username: username
  });

  const password = "456789"; // password for /register & /login

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
    console.log(`❌ Bot ${username} disconnected. Reconnecting in 1m30s...`);
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
    "Hey 👋",
    "Still grinding 😅",
    "AFK bot chilling",
    "This server is fun!",
    "Anyone online?"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log("💬 Sent:", msg);
  }, 60000); // every 1 min
}

createBot();
