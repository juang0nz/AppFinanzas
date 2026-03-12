import { useDeudas } from '../hooks/useDeudas'
import FormDeuda from '../components/Deudas/FormDeuda'
import ListaDeudas from '../components/Deudas/ListaDeudas'
import Loading from '../components/common/Loading'

const DeudasPage = () => {
  const { deudas, loading, refetch } = useDeudas()

  const totalDeuda = deudas.filter(d => d.activa).reduce((sum, d) => sum + (d.monto_total - d.monto_pagado), 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1>💳 Deudas</h1>
        {!loading && deudas.length > 0 && (
          <div className="card" style={{ padding: '1rem' }}>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              Total Adeudado
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-danger)', margin: 0 }}>
              ${totalDeuda.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 mb-3">
        <FormDeuda onDeudaCreada={refetch} />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ListaDeudas deudas={deudas} onDeudaModificada={refetch} />
      )}
    </div>
  )
}

export default DeudasPage
