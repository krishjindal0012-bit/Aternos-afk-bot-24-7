const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me",   // replace with server IP
    port: 49059,
    username: "LeafyLand"       // bot username
  });

  const password = "456789"; // your bot's password

  bot.on("spawn", () => {
    console.log("✅ Bot spawned!");
  });

  // Listen for server auth messages
  bot.on("messagestr", (msg) => {
    console.log("📩 Server:", msg);

    if (msg.toLowerCase().includes("register")) {
      bot.chat(`/register ${password} ${password}`);
      console.log("🔑 Sent /register");
    }

    if (msg.toLowerCase().includes("login")) {
      bot.chat(`/login ${password}`);
      console.log("🔑 Sent /login");
      startAntiAFK(bot); // start moving/chatting only after login
    }
  });

  bot.on("end", () => {
    console.log("❌ Bot disconnected, reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", err => console.log("⚠️ Error:", err));
}

// Anti-AFK loop
function startAntiAFK(bot) {
  console.log("🚀 Starting anti-AFK...");

  // Movement loop
  setInterval(() => {
    const actions = ["forward", "back", "left", "right"];
    const action = actions[Math.floor(Math.random() * actions.length)];

    bot.setControlState(action, true);

    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, false);

    if (Math.random() > 0.5) {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 300);
    }

    setTimeout(() => bot.setControlState(action, false), 2000);
  }, 10000);

  // Chat loop
  const messages = [
    "",
    "",
    ""
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log("💬 Sent:", msg);
  }, 60000);
}

createBot();
