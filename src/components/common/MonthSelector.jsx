import { getMonthName } from '../../utils/helpers'
import './MonthSelector.css'

const MonthSelector = ({ mes, anio, onMesChange, onAnioChange }) => {
  const meses = Array.from({ length: 12 }, (_, i) => i + 1)
  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="month-selector">
      <div className="selector-group">
        <label className="selector-label">Mes:</label>
        <select 
          className="form-select selector-input"
          value={mes} 
          onChange={(e) => onMesChange(Number(e.target.value))}
        >
          {meses.map(m => (
            <option key={m} value={m}>{getMonthName(m)}</option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label className="selector-label">Año:</label>
        <select 
          className="form-select selector-input"
          value={anio} 
          onChange={(e) => onAnioChange(Number(e.target.value))}
        >
          {anios.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default MonthSelector
