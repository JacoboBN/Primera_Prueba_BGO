import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { Answers } from "./types"

interface AppDB extends DBSchema {
  settings: {
    key: string
    value: Answers
  }
}

let dbInstance: IDBPDatabase<AppDB> | null = null

async function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (!dbInstance) {
    dbInstance = await openDB<AppDB>("app_db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "id" })
        }
      },
    })
  }
  return dbInstance
}

export async function getAnswers(): Promise<Answers | null> {
  try {
    const db = await getDB()
    const answers = await db.get("settings", "answers")
    return answers || null
  } catch (error) {
    console.error("Error getting answers:", error)
    return null
  }
}

export async function setAnswers(answers: Omit<Answers, "id" | "updatedAt">): Promise<void> {
  try {
    const db = await getDB()
    const data: Answers = {
      id: "answers",
      ...answers,
      updatedAt: new Date().toISOString(),
    }
    await db.put("settings", data)
  } catch (error) {
    console.error("Error setting answers:", error)
    throw error
  }
}
