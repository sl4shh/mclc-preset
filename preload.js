const { contextBridge, ipcRenderer, ipcMain } = require("electron");

/**
 * Permet une communication RPC plus sécurisée entre le renderer et le main process
 */
contextBridge.exposeInMainWorld("LauncherAPI", {
  /**
   *  Renderer -> Main
   *  Permet de demander la connexion à Microsoft
   */
  MicrosoftLogin: () => ipcRenderer.send("MicrosoftLogin"),
  /**
   * Main -> Renderer
   * Répond au client
   */
  MicrosoftConnected: (profile, mclc) =>
    ipcRenderer.on("MicrosoftConnected", profile, mclc),
  OpenLink: (url) => ipcRenderer.send("OpenLink", url),
  ErrorDialog: (msg) => ipcRenderer.on("ErrorDialog", msg),
  LaunchGame: (ram, usr) => ipcRenderer.send("LaunchGame", ram, usr),
  StorageLogin: (usr) => ipcRenderer.send("StorageLogin", usr),
  StorageConnected: (usr) => ipcRenderer.on("StorageConnected", usr),
});
