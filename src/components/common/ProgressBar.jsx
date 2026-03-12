import './ProgressBar.css'

const ProgressBar = ({ 
  progreso, 
  color = 'primary', 
  altura = 'normal',
  mostrarPorcentaje = true 
}) => {
  const progressValue = Math.min(Math.max(parseFloat(progreso) || 0, 0), 100)
  
  return (
    <div className={`progress-bar-container ${altura}`}>
      <div 
        className={`progress-bar progress-bar-${color}`}
        style={{ width: `${progressValue}%` }}
      >
        {mostrarPorcentaje && progressValue > 0 && (
          <span className="progress-text">{progressValue.toFixed(0)}%</span>
        )}
      </div>
    </div>
  )
}

export default ProgressBar
