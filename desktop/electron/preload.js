const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("app", {
  name: "Desk Koketsu"
});
