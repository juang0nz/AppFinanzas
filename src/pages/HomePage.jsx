import { useState, useEffect } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { useGastos } from '../hooks/useGastos'
import { getCurrentMonth, getCurrentYear, getMonthName, getFraseAleatoria } from '../utils/helpers'
import MonthSelector from '../components/common/MonthSelector'
import ResumenMensual from '../components/Dashboard/ResumenMensual'
import FraseMotivacional from '../components/common/FraseMotivacional'
import IngresosPorPersona from '../components/Dashboard/IngresosPorPersona'
import DistribucionCategorias from '../components/Dashboard/DistribucionCategorias'
import PanelAvisos from '../components/Dashboard/PanelAvisos'
import ExportPDF from '../components/common/ExportPDF'
import Loading from '../components/common/Loading'
import './HomePage.css'

const HomePage = () => {
  const [mes, setMes] = useState(getCurrentMonth())
  const [anio, setAnio] = useState(getCurrentYear())

  const { ingresos, loading: loadingIngresos, refetch: refetchIngresos } = useIngresos(mes, anio)
  const { gastos, loading: loadingGastos, refetch: refetchGastos } = useGastos(mes, anio)

  const loading = loadingIngresos || loadingGastos
  
  // Frase motivacional aleatoria para el dashboard
  const fraseDelDia = getFraseAleatoria('DASHBOARD')

  const handleRefresh = () => {
    refetchIngresos()
    refetchGastos()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>💰 Dashboard - {getMonthName(mes)} {anio}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary"
            disabled={loading}
            title="Refrescar datos"
          >
            🔄 {loading ? 'Cargando...' : 'Refrescar'}
          </button>
          <ExportPDF mes={mes} anio={anio} ingresos={ingresos} gastos={gastos} />
          <MonthSelector 
            mes={mes} 
            anio={anio} 
            onMesChange={setMes} 
            onAnioChange={setAnio} 
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <FraseMotivacional frase={fraseDelDia} />
          
          <PanelAvisos gastos={gastos} />
          
          <ResumenMensual ingresos={ingresos} gastos={gastos} />

          <IngresosPorPersona ingresos={ingresos} />

          <DistribucionCategorias gastos={gastos} />
        </>
      )}
    </div>
  )
}

export default HomePage
