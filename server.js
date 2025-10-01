const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Minecraft Bot is Alive on Render!");
});

// Render sets PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Webserver running on port ${PORT}`);
});
