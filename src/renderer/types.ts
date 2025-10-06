export interface Answers {
  id: "answers"
  fullName: string
  age: number
  favoriteColor: string
  updatedAt: string
}

export interface WindowAPI {
  getVersion: () => Promise<string>
  onUpdateStatus: (callback: (message: string) => void) => void
  quitAndInstall: () => Promise<void>
}

declare global {
  interface Window {
    api: WindowAPI
  }
}
