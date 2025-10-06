"use client"

import { useState, useEffect } from "react"
import { getAnswers, setAnswers } from "./db"
import "./App.css"

export default function App() {
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [favoriteColor, setFavoriteColor] = useState("")
  const [message, setMessage] = useState("")
  const [version, setVersion] = useState("")
  const [updateStatus, setUpdateStatus] = useState("")
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    // Obtener versión de la app
    window.api.getVersion().then(setVersion)

    // Escuchar estado de actualizaciones
    window.api.onUpdateStatus((status) => {
      setUpdateStatus(status)
      if (status.includes("Reinicia para aplicar")) {
        setUpdateReady(true)
      }
    })
  }, [])

  const handleSave = async () => {
    const ageNum = Number.parseInt(age, 10)

    if (!fullName.trim()) {
      setMessage("❌ Por favor ingresa tu nombre completo")
      return
    }

    if (isNaN(ageNum) || ageNum <= 0) {
      setMessage("❌ Por favor ingresa una edad válida")
      return
    }

    if (!favoriteColor.trim()) {
      setMessage("❌ Por favor ingresa tu color favorito")
      return
    }

    try {
      await setAnswers({
        fullName: fullName.trim(),
        age: ageNum,
        favoriteColor: favoriteColor.trim(),
      })
      setMessage("✅ Respuestas guardadas exitosamente")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("❌ Error al guardar las respuestas")
      console.error(error)
    }
  }

  const handleLoad = async () => {
    try {
      const answers = await getAnswers()
      if (answers) {
        setFullName(answers.fullName)
        setAge(answers.age.toString())
        setFavoriteColor(answers.favoriteColor)
        setMessage("✅ Respuestas cargadas correctamente")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("ℹ️ No hay respuestas guardadas")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("❌ Error al cargar las respuestas")
      console.error(error)
    }
  }

  const handleRestartAndUpdate = () => {
    window.api.quitAndInstall()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Cuestionario de Respuestas v0.1.5</h1>
        <p>Responde las siguientes preguntas</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo:</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Antonio Jesús Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Edad:</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 25"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="favoriteColor">Color favorito:</label>
            <input
              id="favoriteColor"
              type="text"
              value={favoriteColor}
              onChange={(e) => setFavoriteColor(e.target.value)}
              placeholder="Ej: Azul"
            />
          </div>

          <div className="button-group">
            <button type="button" onClick={handleSave} className="btn btn-primary">
              💾 Guardar
            </button>
            <button type="button" onClick={handleLoad} className="btn btn-secondary">
              📂 Cargar últimas respuestas
            </button>
          </div>

          {message && <div className={`message ${message.includes("❌") ? "error" : "success"}`}>{message}</div>}
        </form>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span className="version">Versión: v{version}</span>
          {updateStatus && <span className="update-status">{updateStatus}</span>}
          {updateReady && (
            <button onClick={handleRestartAndUpdate} className="btn btn-update">
              🔄 Reiniciar y actualizar
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
