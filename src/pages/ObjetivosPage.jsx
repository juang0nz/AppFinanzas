import { useObjetivos } from '../hooks/useObjetivos'
import FormObjetivo from '../components/Objetivos/FormObjetivo'
import ListaObjetivos from '../components/Objetivos/ListaObjetivos'
import Loading from '../components/common/Loading'

const ObjetivosPage = () => {
  const { objetivos, loading, refetch } = useObjetivos()

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎯 Objetivos de Ahorro</h1>
        <p className="text-muted">Establece metas y sigue tu progreso</p>
      </div>

      <div className="grid grid-cols-1 mb-3">
        <FormObjetivo onObjetivoCreado={refetch} />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ListaObjetivos objetivos={objetivos} onObjetivoModificado={refetch} />
      )}
    </div>
  )
}

export default ObjetivosPage
