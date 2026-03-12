import { useState, useEffect } from 'react'
import { getIngresosFijos, copiarIngresosFijos } from '../../services/supabase'
import '../Gastos/CopiarGastosFijos.css'

const CopiarIngresosFijos = ({ mes, anio, ingresos, onIngresosCopied }) => {
  const [ingresosFijosMesAnterior, setIngresosFijosMesAnterior] = useState([])
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
    const verificarIngresosFijos = async () => {
      try {
        // Verificar si el mes actual tiene ingresos fijos
        const ingresosFijosActuales = ingresos.filter(i => i.tipo === 'Fijo')
        
        // Si ya hay ingresos fijos este mes, no mostrar el banner
        if (ingresosFijosActuales.length > 0) {
          setMostrarBanner(false)
          return
        }

        // Obtener ingresos fijos del mes anterior
        const { mes: mesAnt, anio: anioAnt } = getMesAnterior()
        const ingresosPrevios = await getIngresosFijos(mesAnt, anioAnt)
        
        if (ingresosPrevios && ingresosPrevios.length > 0) {
          setIngresosFijosMesAnterior(ingresosPrevios)
          setMostrarBanner(true)
        } else {
          setMostrarBanner(false)
        }
      } catch (error) {
        console.error('Error al verificar ingresos fijos:', error)
      }
    }

    verificarIngresosFijos()
  }, [mes, anio, ingresos])

  const handleCopiarIngresos = async () => {
    try {
      setLoading(true)
      const { mes: mesAnt, anio: anioAnt } = getMesAnterior()
      await copiarIngresosFijos(mesAnt, anioAnt, mes, anio)
      
      setMostrarBanner(false)
      if (onIngresosCopied) {
        onIngresosCopied()
      }
    } catch (error) {
      console.error('Error al copiar ingresos fijos:', error)
      alert('Error al copiar los ingresos fijos')
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
          <h3>Ingresos Fijos Detectados</h3>
          <p>
            Encontramos <strong>{ingresosFijosMesAnterior.length} ingreso{ingresosFijosMesAnterior.length === 1 ? '' : 's'} fijo{ingresosFijosMesAnterior.length === 1 ? '' : 's'}</strong> de {mesesNombres[mesAnt - 1]} {anioAnt}.
            ¿Querés copiarlos a este mes?
          </p>
          <div className="banner-lista">
            {ingresosFijosMesAnterior.slice(0, 3).map((ingreso, index) => (
              <span key={index} className="gasto-preview">
                {ingreso.descripcion || ingreso.persona} (${Number(ingreso.monto).toLocaleString('es-UY')})
              </span>
            ))}
            {ingresosFijosMesAnterior.length > 3 && (
              <span className="gasto-preview">+{ingresosFijosMesAnterior.length - 3} más</span>
            )}
          </div>
        </div>
      </div>
      <div className="banner-actions">
        <button 
          onClick={handleCopiarIngresos} 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Copiando...' : '✓ Copiar Ingresos'}
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

export default CopiarIngresosFijos
