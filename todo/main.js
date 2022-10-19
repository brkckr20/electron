const electron = require('electron');
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
let todoList = [];

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.setResizable(false);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //menu olusturma
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("newTodo:close", () => {
        addWindow.close();
        addWindow = null
    })
    ipcMain.on("newTodo:save", (err, data) => {
        if (data) {
            let todo = {
                id: todoList.length + 1,
                text: data
            }
            todoList.push(todo)

            //kaydedilen verinin frontene gönderilmesi
            mainWindow.webContents.send("todo:addItem", todo)

            addWindow.close();
            addWindow = null
        }
    })
})

const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            {
                label: "Yeni Ekle",
                click() {
                    createNewWindow()
                }
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
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        // frame : false,
        width: 490,
        height: 285,
        title: "Yeni Pencere"
    })

    addWindow.setResizable(false);

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "pages/newTodo.html"),
        protocol: "file:",
        slashes: true
    }))

    addWindow.on("close", () => {
        addWindow = null;
    })
}

function getTodoList() {
    console.log(todoList)
}