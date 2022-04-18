const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();
const msmc = require("msmc");
//const fetch = require("node-fetch");
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "src/img/icon.png",
    title: "Launcher Minecraft",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(path.join(__dirname, "src/app.html"));
};

app.whenReady().then(() => {
  ipcMain.on("MicrosoftLogin", (event) => {
    msmc
      .fastLaunch("electron", (update) => {
        //A hook for catching loading bar events and errors, standard with MSMC
        console.log("CallBack!!!!!");
        console.log(update);
      })
      .then((result) => {
        //If the login works
        if (msmc.errorCheck(result)) {
          console.log("We failed to log someone in because : " + result.reason);
          win.webContents.send(
            "ErrorDialog",
            "Erreur d'authentification. Vérifiez vos identifiants et votre connexion internet."
          );
          return;
        }
        console.log();
        let authInfo = msmc.getMCLC().getAuth(result);
        win.webContents.send("MicrosoftConnected", result.profile, authInfo);
        //cb(false, result);
      })
      .catch((reason) => {
        //If the login fails
        console.log("We failed to log someone in because : " + reason);
        //cb("Erreur");
      });
  });

  ipcMain.on("OpenLink", (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.on("LaunchGame", (event, ram, cred) => {
    let opts = {
      clientPackage: null,
      // Pulled from the Minecraft Launcher core docs , this function is the star of the show
      authorization: cred,
      root: path.join(app.getPath("appData"), ".lcmc/"),
      version: {
        number: "1.12.2",
        type: "release",
      },
      memory: {
        max: ram + 1 + "G",
        min: ram + "G",
      },
    };
    console.log("Starting!");
    launcher.launch(opts);

    launcher.on("debug", (e) => console.log(e));
    launcher.on("data", (e) => console.log(e));
  });

  ipcMain.on("StorageLogin", (event, userdata) => {
    console.log("StorageLogin");
    console.log(userdata);
    console.log("----------------------------------");
    let usr = JSON.parse(userdata);
    msmc
      .getMCLC()
      .validate(usr)
      .then((isValid) => {
        if (isValid) {
          win.webContents.send("StorageConnected", usr);
        } else {
          win.webContents.send(
            "ErrorDialog",
            "Tokens expirés. Reconnectez-vous."
          );
        }
      })
      .catch((err) => {
        win.webContents.send(
          "ErrorDialog",
          "Tokens expirés. Reconnectez-vous."
        );
      });
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
