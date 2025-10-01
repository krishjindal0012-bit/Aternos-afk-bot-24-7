const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me",  // replace with your Minecraft server IP
    port: 49059,
    username: "LeafyLand"      // for cracked servers, just use a name
  });

  // When bot joins
  bot.on("spawn", () => {
    console.log("✅ Bot spawned, sending auth commands...");

    // Change password below 👇
    const password = "456789";  

    // Auto-register and auto-login (works for most cracked servers)
    bot.chat(`/register ${password} ${password}`);
    setTimeout(() => {
      bot.chat(`/login ${password}`);
    }, 2000);
  });

  // Auto-reconnect if disconnected
  bot.on("end", () => {
    console.log("Bot disconnected, reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", (err) => console.log("❌ Error:", err));
}

createBot();
