import { contextBridge, ipcRenderer } from "electron"

// Exponer API seguro al renderer
contextBridge.exposeInMainWorld("api", {
  // Nota: getAnswers y setAnswers se manejan directamente en el renderer con IndexedDB
  // Solo exponemos funcionalidades que requieren acceso al proceso main

  getVersion: (): Promise<string> => {
    return ipcRenderer.invoke("get-version")
  },

  onUpdateStatus: (callback: (message: string) => void) => {
    ipcRenderer.on("update-status", (_event, message) => {
      callback(message)
    })
  },

  quitAndInstall: (): Promise<void> => {
    return ipcRenderer.invoke("quit-and-install")
  },
})
