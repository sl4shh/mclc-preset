const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();
const msmc = require("msmc");
let win;
