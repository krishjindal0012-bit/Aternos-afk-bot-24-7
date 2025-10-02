const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me",   // replace with your server IP
    port: 49059,              // default Minecraft port
    username: "LeafyLand"       // bot username
  });

  bot.on("spawn", () => {
    console.log("✅ Bot spawned, sending auth commands...");

    // Change this password 👇
    const password = "456789";

    // Auto-register + login
    bot.chat(`/register ${password} ${password}`);
    setTimeout(() => bot.chat(`/login ${password}`), 2000);

    // Start auto-jumping every 2 seconds
    setInterval(() => {
      if (bot.entity && bot.entity.onGround) {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500); // short jump
      }
    }, 2000);
  });

  bot.on("end", () => {
    console.log("Bot disconnected, reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", (err) => console.log("❌ Error:", err));
}

createBot();
