const mineflayer = require("mineflayer");

// --- List of usernames for reconnect ---
const usernames = [
  "ForestSoul_1",
  "Leaf_Guardian",
  "GreenSpirit_1",
  "Bush_Camper"
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

  const password = "836837"; // password for /register & /login
  
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

  bot.on("error", (error) => {
    console.log(`⚠️ Bot ${username} error:`, error);

    // --- Handle ECONNRESET or network failure ---
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      console.log("🌐 Connection reset detected. Reconnecting in 20s...");
      try {
        bot.quit();
      } catch (e) {
        console.log("⚠️ Error while quitting bot:", e);
      }
      currentUser++;
      setTimeout(createBot, 20000);
    }
  });
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

    if (Math.random() > 0.4) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 30000);
    }

    if (Math.random() > 0.5) {
      bot.swingArm("right");
    }

    setTimeout(() => bot.setControlState(action, false), 30000);
  }, 30000); // every 30s

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

// --- Start the bot ---
createBot();
