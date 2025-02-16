const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let activeIntervals = [];
const settingsPath = path.join(app.getPath('userData'), 'setting.json');

function createWindow() {
    const indexWindow = new BrowserWindow({
        width: 585,
        height: 825,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            sandbox: false,
        },
    });
    indexWindow.loadFile('./index/index.html');
    //indexWindow.webContents.openDevTools();
    Menu.setApplicationMenu(null);
    return indexWindow;
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(() => {
    createWindow();
});
// 모든 윈도우가 닫히면 앱 종료
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// 앱이 활성화될 때 윈도우가 없으면 새로 생성
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


ipcMain.handle('get-app-path', () => {
    return app.getAppPath();
});

ipcMain.handle('register-interval', (event, interval) => {
    activeIntervals.push([interval]);
});
ipcMain.handle('remove-interval', () => {
    activeIntervals.forEach(interval => {
        clearInterval(interval);
    });
    activeIntervals = [];
});

ipcMain.handle('load-dashboard', () => {
    const dashboardHtml = fs.readFileSync(path.join(__dirname, 'dashboard', 'dashboard.html'), 'utf-8');
    return dashboardHtml;
});

ipcMain.handle('load-setting', () => {
    const settingsHtml = fs.readFileSync(path.join(__dirname, 'setting', 'setting.html'), 'utf-8');
    return settingsHtml;
});

ipcMain.handle('load-settings', async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(settingsPath, 'utf8', (err, data) => {
            if (err) resolve({});
            else {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({});
                }
            }
        });
    });
});
ipcMain.handle('save-settings', async (event, settings) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
});
ipcMain.handle('show-alert', async (event, message) => {
    dialog.showMessageBox({
        type: 'info',
        message: message,
        buttons: ['확인']
    });
});