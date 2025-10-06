import { autoUpdater } from "electron-updater"
import type { BrowserWindow } from "electron"

let mainWindow: BrowserWindow | null = null

export function initUpdater(window: BrowserWindow) {
  mainWindow = window

  // Configuración del auto-updater
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  // Eventos del auto-updater
  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Buscando actualizaciones...")
  })

  autoUpdater.on("update-available", (info) => {
    sendStatusToWindow(`Actualización disponible: v${info.version}`)
  })

  autoUpdater.on("update-not-available", () => {
    sendStatusToWindow("La aplicación está actualizada")
  })

  autoUpdater.on("download-progress", (progressObj) => {
    const message = `Descargando: ${Math.round(progressObj.percent)}%`
    sendStatusToWindow(message)
  })

  autoUpdater.on("update-downloaded", (info) => {
    sendStatusToWindow(`Actualización descargada: v${info.version}. Reinicia para aplicar.`)
  })

  autoUpdater.on("error", (err) => {
    sendStatusToWindow(`Error en actualización: ${err.message}`)
  })

  // Verificar actualizaciones al iniciar
  autoUpdater.checkForUpdatesAndNotify()
}

function sendStatusToWindow(message: string) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("update-status", message)
  }
}

export function quitAndInstall() {
  autoUpdater.quitAndInstall(false, true)
}
