const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "LeafyLand.aternos.me",   // replace with your server IP
    port: 49059,
    username: "LeafyLand"       // bot username
  });

  bot.once("spawn", () => {
    console.log("✅ Bot spawned, will login/register...");

    const password = "456789"; // change this!

    // Delay before auth
    setTimeout(() => {
      bot.chat(`/register ${password} ${password}`);
      bot.chat(`/login ${password}`);
      console.log("🔑 Sent /register and /login");
    }, 5000);

    // Anti-AFK movement
    setInterval(() => {
      const actions = ["forward", "back", "left", "right"];
      const action = actions[Math.floor(Math.random() * actions.length)];

      // Walk randomly
      bot.setControlState(action, true);

      // Look around randomly
      const yaw = Math.random() * Math.PI * 2;  
      const pitch = (Math.random() - 0.5) * Math.PI / 2; 
      bot.look(yaw, pitch, false);

      // Jump randomly
      if (Math.random() > 0.5) {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 300);
      }

      // Stop moving after short time
      setTimeout(() => bot.setControlState(action, false), 2000);

    }, 10000); // every 10 sec

    // Anti-AFK chat
    const messages = [
      "",
      "",
      "",
    ];

    setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
      console.log("💬 Sent message:", msg);
    }, 600000); // every 10 minute
  });

  bot.on("end", () => {
    console.log("❌ Bot disconnected, reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", err => console.log("⚠️ Error:", err));
}

createBot();
