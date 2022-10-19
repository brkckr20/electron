const electron = require('electron');
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', () => { //uygulama hazır olduğunda
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //menu olusturma
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("key", (err, data) => {
        console.log(data);
    })
    ipcMain.on("key:inputValue", (err, data) => {
        console.log(data);
    })

    //yeni pencere olusturmak
    ipcMain.on("key:newWindow", () => {
        createNewWindow();
    });

    mainWindow.on("close", () => {
        app.quit();
    })
})

const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            {
                label: "Yeni Ekle",
            },
            {
                label: "Tümünü Sil",
            },
            {
                label: "Çıkış",
                accelerator: 'Ctrl+Q', //kısayol tuşu atama
                role: "quit",
            },
        ]
    },
    {
        label: "Dev Tools",
        submenu: [
            {
                label: "Toggle Dev Tools",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: "Yenile",
                accelerator: "reload",
                role: "CTRL+R"
            }
        ]
    }
]

function createNewWindow() {
    let addWindow = new BrowserWindow({
        width: 482,
        height: 200,
        title: "Yeni Pencere"
    })

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "modal.html"),
        protocol: "file:",
        slashes: true
    }))

    addWindow.on("close", () => {
        addWindow = null;
    })
}