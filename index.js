const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me",   // replace
    port: 49059,
    username: "LeafyLand"
  });

  const password = "456789";

  bot.once("spawn", () => {
    console.log("✅ Bot spawned!");

    // Auto-login/register if server asks
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

    // Force start anti-AFK after 10 sec (even if login not detected)
    setTimeout(() => {
      console.log("🚀 Starting anti-AFK...");
      startAntiAFK(bot);
    }, 10000);
  });

  bot.on("end", () => {
    console.log("❌ Disconnected, reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", err => console.log("⚠️ Error:", err));
}

// Anti-AFK system
function startAntiAFK(bot) {
  // Move + jump + look
  setInterval(() => {
    if (!bot.entity) return;

    const actions = ["forward", "back", "left", "right"];
    const action = actions[Math.floor(Math.random() * actions.length)];

    bot.setControlState(action, true);

    // Look around randomly
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, false);

    // Jump sometimes
    if (Math.random() > 0.5) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 300);
    }

    // Stop moving after 2 sec
    setTimeout(() => bot.setControlState(action, false), 2000);
  }, 10000);

  // Chat loop
  const messages = [
        "Do Not Try To Cheat You Can Be Banned For This",
        "If You Find Anyone Cheat Inform Immediately On Our Discord Server With Proof",
        "Subscribe To Shadow Realms"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log("💬 Sent:", msg);
  }, 600000);
}

createBot();
