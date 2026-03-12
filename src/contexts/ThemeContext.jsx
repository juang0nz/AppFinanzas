import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Cargar tema guardado o usar 'comun' por defecto
    return localStorage.getItem('theme') || 'comun'
  })

  useEffect(() => {
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', theme)
    // Guardar en localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const cambiarTema = (nuevoTema) => {
    if (['comun', 'dark', 'peñarol'].includes(nuevoTema)) {
      setTheme(nuevoTema)
    }
  }

  const value = {
    theme,
    cambiarTema,
    temas: {
      comun: { nombre: 'Común', icono: '☀️' },
      dark: { nombre: 'Oscuro', icono: '🌙' },
      peñarol: { nombre: 'Peñarol', icono: '⚽' }
    }
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
