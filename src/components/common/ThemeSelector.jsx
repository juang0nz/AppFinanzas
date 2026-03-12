import { useTheme } from '../../contexts/ThemeContext'
import './ThemeSelector.css'

const ThemeSelector = () => {
  const { theme, cambiarTema, temas } = useTheme()

  return (
    <div className="theme-selector">
      {Object.entries(temas).map(([key, { nombre, icono }]) => (
        <button
          key={key}
          className={`theme-btn ${theme === key ? 'active' : ''}`}
          onClick={() => cambiarTema(key)}
          title={nombre}
        >
          {icono}
        </button>
      ))}
    </div>
  )
}

export default ThemeSelector
