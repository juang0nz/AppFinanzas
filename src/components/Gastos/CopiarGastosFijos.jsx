import { useState, useEffect } from 'react'
import { getGastosFijos, copiarGastosFijos } from '../../services/supabase'
import './CopiarGastosFijos.css'

const CopiarGastosFijos = ({ mes, anio, gastos, onGastosCopied }) => {
  const [gastosFijosMesAnterior, setGastosFijosMesAnterior] = useState([])
  const [loading, setLoading] = useState(false)
  const [mostrarBanner, setMostrarBanner] = useState(false)

  // Calcular mes y año anterior
  const getMesAnterior = () => {
    if (mes === 1) {
      return { mes: 12, anio: anio - 1 }
    }
    return { mes: mes - 1, anio }
  }

  useEffect(() => {
    const verificarGastosFijos = async () => {
      try {
        // Verificar si el mes actual tiene gastos fijos
        const gastosFijosActuales = gastos.filter(g => g.tipo === 'Fijo')
        
        // Si ya hay gastos fijos este mes, no mostrar el banner
        if (gastosFijosActuales.length > 0) {
          setMostrarBanner(false)
          return
        }

        // Obtener gastos fijos del mes anterior
        const { mes: mesAnt, anio: anioAnt } = getMesAnterior()
        const gastosPrevios = await getGastosFijos(mesAnt, anioAnt)
        
        if (gastosPrevios && gastosPrevios.length > 0) {
          setGastosFijosMesAnterior(gastosPrevios)
          setMostrarBanner(true)
        } else {
          setMostrarBanner(false)
        }
      } catch (error) {
        console.error('Error al verificar gastos fijos:', error)
      }
    }

    verificarGastosFijos()
  }, [mes, anio, gastos])

  const handleCopiarGastos = async () => {
    try {
      setLoading(true)
      const { mes: mesAnt, anio: anioAnt } = getMesAnterior()
      await copiarGastosFijos(mesAnt, anioAnt, mes, anio)
      
      setMostrarBanner(false)
      if (onGastosCopied) {
        onGastosCopied()
      }
    } catch (error) {
      console.error('Error al copiar gastos fijos:', error)
      alert('Error al copiar los gastos fijos')
    } finally {
      setLoading(false)
    }
  }

  if (!mostrarBanner) {
    return null
  }

  const { mes: mesAnt, anio: anioAnt } = getMesAnterior()
  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  return (
    <div className="copiar-gastos-banner">
      <div className="banner-content">
        <div className="banner-icon">🔄</div>
        <div className="banner-text">
          <h3>Gastos Fijos Detectados</h3>
          <p>
            Encontramos <strong>{gastosFijosMesAnterior.length} gasto{gastosFijosMesAnterior.length === 1 ? '' : 's'} fijo{gastosFijosMesAnterior.length === 1 ? '' : 's'}</strong> de {mesesNombres[mesAnt - 1]} {anioAnt}.
            ¿Querés copiarlos a este mes?
          </p>
          <div className="banner-lista">
            {gastosFijosMesAnterior.slice(0, 3).map((gasto, index) => (
              <span key={index} className="gasto-preview">
                {gasto.descripcion} (${Number(gasto.monto).toLocaleString('es-UY')})
              </span>
            ))}
            {gastosFijosMesAnterior.length > 3 && (
              <span className="gasto-preview">+{gastosFijosMesAnterior.length - 3} más</span>
            )}
          </div>
        </div>
      </div>
      <div className="banner-actions">
        <button 
          onClick={handleCopiarGastos} 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Copiando...' : '✓ Copiar Gastos'}
        </button>
        <button 
          onClick={() => setMostrarBanner(false)} 
          className="btn btn-outline"
        >
          ✕ No, gracias
        </button>
      </div>
    </div>
  )
}

export default CopiarGastosFijos
