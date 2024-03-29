import {app, BrowserWindow, ipcMain, nativeImage, Tray} from 'electron';
import AutoLaunch from "auto-launch";
import * as path from "path";
// import {defaultConfig} from "./config";
import {hideInTray, hideWindowWhenFocusOut, setIcon} from "./startConfig";
import {HotKeys} from "./HotKeys";
import {SystemStore} from "./SystemStore";
import {IAutoLaunchData, IConfig} from "../type";
import Config from "../main/config";
import MainCommand from "../main/main-command";
import History from "../main/history";

const appAutoLauncher = new AutoLaunch({
    name: 'C-3PO',
})

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let dockedWindowMode = false
let hotKeys: HotKeys
const systemStore = new SystemStore()
let config: Config
let mainCommand: MainCommand
let history: History

const createWindow = async (): Promise<void> => {
    const c: IConfig = await systemStore.get("config")
    let windowHeight = 730
    let windowWidth = 600
    if (c && c?.windowHeight) windowHeight = c?.windowHeight
    if (c && c?.windowWidth) windowWidth = c?.windowWidth
    mainWindow = new BrowserWindow({
        height: windowHeight,
        width: windowWidth,
        // icon: "assets/trayIcon.png",
        skipTaskbar: true,
        title: "C-3PO",
        frame: false,
        transparent: true,
        show: false,
        hasShadow: false,
        resizable: false,
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            sandbox: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    const image = nativeImage.createFromPath(path.join(__dirname, 'assets/trayIcon.png'))
    tray = new Tray(image.resize({width: 32, height: 32}));

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    setIcon(app, mainWindow, tray);
    hideWindowWhenFocusOut(ipcMain, mainWindow);

    hotKeys = new HotKeys(app, mainWindow, tray)
    config = new Config(systemStore, ipcMain, hotKeys, appAutoLauncher, mainWindow)
    mainCommand = new MainCommand(systemStore, ipcMain, app)
    history = new History(systemStore, ipcMain)
};

hideInTray(app);
ipcMain.on('windowBlur', () => {
    if (!dockedWindowMode)
        mainWindow?.hide()
});

ipcMain.on('windowFocus', () => {
    mainWindow?.show()
});

ipcMain.handle('autoLaunch', async (_, data) => {
    const dataObj: IAutoLaunchData = JSON.parse(data)
    if (dataObj.type === "getStatus") {
        let result = false
        await appAutoLauncher.isEnabled()
            .then(function (isEnabled) {
                result = isEnabled
            })
            .catch(function () {
                result = false
            })
        return result
    } else if (dataObj.type === "setStatus") {
        if (dataObj.value === "true") {
            appAutoLauncher.enable()
        } else {
            appAutoLauncher.disable()
        }
    }

})


ipcMain.on('dockedWindowModeOn', () => {
    mainWindow && mainWindow.setAlwaysOnTop(true, 'floating', Number.MAX_VALUE);
    dockedWindowMode = true;
});


ipcMain.on('dockedWindowModeOff', () => {
    mainWindow && mainWindow.setAlwaysOnTop(false, 'floating', Number.MAX_VALUE);
    dockedWindowMode = false;
});


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})
