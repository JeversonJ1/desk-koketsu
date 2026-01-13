const { app, BrowserWindow } = require("electron");
const path = require("path");

// 🔥 AUTO RELOAD
require("electron-reload")(
  path.join(__dirname, "../renderer"),
  {
    electron: path.join(
      __dirname,
      "../node_modules/.bin/electron"
    )
  }
);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(
    path.join(__dirname, "../renderer/pages/login.html")
  );
}

app.whenReady().then(createWindow);
