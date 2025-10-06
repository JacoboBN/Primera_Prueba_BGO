import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import { initUpdater, quitAndInstall } from "./updater"

let mainWindow: BrowserWindow | null = null

const isDev = process.env.NODE_ENV === "development"

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"))
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  // Inicializar auto-updater
  if (!isDev && mainWindow) {
    initUpdater(mainWindow)
  }

  // In production, inject a strict Content-Security-Policy header to remove
  // Electron's insecure CSP warning. We avoid setting this in development
  // because Vite's HMR uses eval-like behavior which would break when
  // 'unsafe-eval' is disallowed.
  if (!isDev && mainWindow) {
    try {
      const filter = { urls: ["file://*/*"] }
      // Use the session of the main window to modify response headers
      const ses = mainWindow.webContents.session
      ses.webRequest.onHeadersReceived(filter, (details, callback) => {
        const responseHeaders = details.responseHeaders || {}
        // Strict CSP: allow only same-origin scripts/styles, images and connections
        const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
        // Electron expects header values as array of strings on some platforms
        responseHeaders['Content-Security-Policy'] = [csp]
        callback({ responseHeaders })
      })
    } catch (err) {
      console.error('Error setting CSP headers:', err)
    }
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// IPC Handlers
ipcMain.handle("get-version", () => {
  return app.getVersion()
})

ipcMain.handle("quit-and-install", () => {
  quitAndInstall()
})
