import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase no está configurado. Por favor, configura las variables de entorno.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// ============================================
// Funciones de Autenticación
// ============================================

export const signUp = async (email, password, nombreCompleto) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_completo: nombreCompleto
      }
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  // No lanzar error si simplemente no hay sesión
  if (error && error.message !== 'Auth session missing!') throw error
  return session
}

// ============================================
// Funciones de Perfiles
// ============================================

export const getPerfil = async (userId) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updatePerfil = async (userId, perfil) => {
  const { data, error } = await supabase
    .from('perfiles')
    .update(perfil)
    .eq('id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

export const getAllPerfiles = async () => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, email, avatar_url')
    .order('nombre_completo')
  
  if (error) throw error
  return data
}

// Funciones para Ingresos
export const getIngresos = async (mes, anio) => {
  const { data, error } = await supabase
    .from('ingresos')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createIngreso = async (ingreso) => {
  const { data, error } = await supabase
    .from('ingresos')
    .insert([ingreso])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateIngreso = async (id, ingreso) => {
  const { data, error } = await supabase
    .from('ingresos')
    .update(ingreso)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteIngreso = async (id) => {
  const { error } = await supabase
    .from('ingresos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Obtener ingresos fijos de un mes/año específico
export const getIngresosFijos = async (mes, anio) => {
  const { data, error } = await supabase
    .from('ingresos')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .eq('tipo', 'Fijo')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Copiar ingresos fijos del mes anterior al mes actual
export const copiarIngresosFijos = async (mesOrigen, anioOrigen, mesDestino, anioDestino) => {
  // Primero obtener los ingresos fijos del mes origen
  const ingresosFijos = await getIngresosFijos(mesOrigen, anioOrigen)
  
  if (!ingresosFijos || ingresosFijos.length === 0) {
    return []
  }
  
  // Preparar los ingresos para insertar (sin id, con nuevo mes/año)
  const ingresosNuevos = ingresosFijos.map(ingreso => ({
    descripcion: ingreso.descripcion,
    monto: ingreso.monto,
    tipo: ingreso.tipo,
    persona: ingreso.persona,
    mes: mesDestino,
    anio: anioDestino
  }))
  
  // Insertar los ingresos copiados
  const { data, error } = await supabase
    .from('ingresos')
    .insert(ingresosNuevos)
    .select()
  
  if (error) throw error
  return data
}

// Funciones para Gastos
export const getGastos = async (mes, anio) => {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createGasto = async (gasto) => {
  const { data, error } = await supabase
    .from('gastos')
    .insert([gasto])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateGasto = async (id, gasto) => {
  const { data, error } = await supabase
    .from('gastos')
    .update(gasto)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteGasto = async (id) => {
  const { error } = await supabase
    .from('gastos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Obtener gastos fijos de un mes/año específico
export const getGastosFijos = async (mes, anio) => {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .eq('tipo', 'Fijo')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Copiar gastos fijos del mes anterior al mes actual
export const copiarGastosFijos = async (mesOrigen, anioOrigen, mesDestino, anioDestino) => {
  // Primero obtener los gastos fijos del mes origen
  const gastosFijos = await getGastosFijos(mesOrigen, anioOrigen)
  
  if (!gastosFijos || gastosFijos.length === 0) {
    return []
  }
  
  // Preparar los gastos para insertar (sin id, con nuevo mes/año, sin marcar como pagado)
  const gastosNuevos = gastosFijos.map(gasto => ({
    descripcion: gasto.descripcion,
    monto: gasto.monto,
    categoria: gasto.categoria,
    tipo: gasto.tipo,
    pagado: false, // Resetear estado de pago
    persona: gasto.persona,
    mes: mesDestino,
    anio: anioDestino
  }))
  
  // Insertar los gastos copiados
  const { data, error } = await supabase
    .from('gastos')
    .insert(gastosNuevos)
    .select()
  
  if (error) throw error
  return data
}

// Funciones para Deudas
export const getDeudas = async () => {
  const { data, error } = await supabase
    .from('deudas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createDeuda = async (deuda) => {
  const { data, error } = await supabase
    .from('deudas')
    .insert([deuda])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateDeuda = async (id, deuda) => {
  const { data, error } = await supabase
    .from('deudas')
    .update(deuda)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteDeuda = async (id) => {
  const { error } = await supabase
    .from('deudas')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// Funciones para Objetivos
// ============================================
export const getObjetivos = async () => {
  const { data, error } = await supabase
    .from('objetivos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createObjetivo = async (objetivo) => {
  const { data, error } = await supabase
    .from('objetivos')
    .insert([objetivo])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateObjetivo = async (id, objetivo) => {
  const { data, error } = await supabase
    .from('objetivos')
    .update(objetivo)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteObjetivo = async (id) => {
  const { error } = await supabase
    .from('objetivos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// Funciones para Inversiones
// ============================================
export const getInversiones = async () => {
  const { data, error } = await supabase
    .from('inversiones')
    .select('*')
    .order('fecha_inversion', { ascending: false })
  
  if (error) throw error
  return data
}

export const createInversion = async (inversion) => {
  const { data, error } = await supabase
    .from('inversiones')
    .insert([inversion])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateInversion = async (id, inversion) => {
  const { data, error } = await supabase
    .from('inversiones')
    .update(inversion)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteInversion = async (id) => {
  const { error } = await supabase
    .from('inversiones')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// Funciones para Fondo de Emergencia
// ============================================
export const getFondoEmergencia = async () => {
  const { data, error } = await supabase
    .from('fondo_emergencia')
    .select('*')
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data
}

export const updateFondoEmergencia = async (fondo) => {
  // Primero intenta obtener el registro existente
  const existing = await getFondoEmergencia()
  
  if (existing && existing.id) {
    // Si existe, actualiza
    const { data, error } = await supabase
      .from('fondo_emergencia')
      .update(fondo)
      .eq('id', existing.id)
      .select()
    
    if (error) throw error
    return data[0]
  } else {
    // Si no existe, crea uno nuevo
    const { data, error } = await supabase
      .from('fondo_emergencia')
      .insert([fondo])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// ============================================
// Funciones de Estadísticas y Análisis
// ============================================

// Obtener distribución de gastos por categoría principal
export const getDistribucionCategorias = async (mes, anio) => {
  const gastos = await getGastos(mes, anio)
  
  const distribucion = gastos.reduce((acc, gasto) => {
    const categoria = gasto.categoria_principal || 'Vida'
    acc[categoria] = (acc[categoria] || 0) + Number(gasto.monto)
    return acc
  }, {})
  
  return distribucion
}

// Obtener gastos por tipo de movimiento
export const getGastosPorTipoMovimiento = async (mes, anio) => {
  const gastos = await getGastos(mes, anio)
  
  const porTipo = gastos.reduce((acc, gasto) => {
    const tipo = gasto.tipo_movimiento || 'Fondo Común'
    acc[tipo] = (acc[tipo] || 0) + Number(gasto.monto)
    return acc
  }, {})
  
  return porTipo
}

// Calcular promedio de gastos mensuales (últimos N meses)
export const calcularPromedioGastosMensuales = async (meses = 3) => {
  const hoy = new Date()
  let total = 0
  let mesesContados = 0
  
  for (let i = 0; i < meses; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    
    const gastos = await getGastos(mes, anio)
    const totalMes = gastos.reduce((sum, g) => sum + Number(g.monto), 0)
    
    if (totalMes > 0) {
      total += totalMes
      mesesContados++
    }
  }
  
  return mesesContados > 0 ? total / mesesContados : 0
}

// ============================================
// Funciones para Avisos/Alertas
// ============================================

export const getAvisos = async (soloNoLeidos = false) => {
  let query = supabase
    .from('avisos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (soloNoLeidos) {
    query = query.eq('leido', false)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const createAviso = async (aviso) => {
  const { data, error } = await supabase
    .from('avisos')
    .insert([aviso])
    .select()
  
  if (error) throw error
  return data[0]
}

export const marcarAvisoComoLeido = async (id) => {
  const { data, error } = await supabase
    .from('avisos')
    .update({ leido: true })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteAviso = async (id) => {
  const { error } = await supabase
    .from('avisos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const marcarTodosAvisosComoLeidos = async () => {
  const { error } = await supabase
    .from('avisos')
    .update({ leido: true })
    .eq('leido', false)
  
  if (error) throw error
}

// ============================================
// Funciones para Emprendimiento
// ============================================

export const getEmprendimiento = async (mes, anio) => {
  const { data, error } = await supabase
    .from('emprendimiento')
    .select('*')
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createEmprendimiento = async (item) => {
  const { data, error } = await supabase
    .from('emprendimiento')
    .insert([item])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateEmprendimiento = async (id, item) => {
  const { data, error } = await supabase
    .from('emprendimiento')
    .update(item)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteEmprendimiento = async (id) => {
  const { error } = await supabase
    .from('emprendimiento')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Obtener balance del emprendimiento
export const getBalanceEmprendimiento = async (mes, anio) => {
  const items = await getEmprendimiento(mes, anio)
  
  const ingresos = items
    .filter(item => item.tipo === 'ingreso')
    .reduce((sum, item) => sum + Number(item.monto), 0)
  
  const gastos = items
    .filter(item => item.tipo === 'gasto')
    .reduce((sum, item) => sum + Number(item.monto), 0)
  
  return {
    ingresos,
    gastos,
    balance: ingresos - gastos
  }
}

// ============================================
// Funciones para Hogares Compartidos
// ============================================

// Obtener hogares del usuario actual
export const getHogares = async () => {
  const { data, error } = await supabase
    .from('hogares')
    .select(`
      *,
      miembros:miembros_hogar(
        id,
        rol,
        joined_at,
        perfil:perfiles(id, nombre_completo, email, avatar_url)
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Obtener un hogar específico
export const getHogar = async (hogarId) => {
  const { data, error } = await supabase
    .from('hogares')
    .select(`
      *,
      miembros:miembros_hogar(
        id,
        rol,
        joined_at,
        perfil:perfiles(id, nombre_completo, email, avatar_url)
      )
    `)
    .eq('id', hogarId)
    .single()
  
  if (error) throw error
  return data
}

// Crear hogar (usando la función SQL)
export const crearHogar = async (nombre, descripcion = null) => {
  const { data, error } = await supabase
    .rpc('crear_hogar_con_admin', {
      p_nombre: nombre,
      p_descripcion: descripcion
    })
  
  if (error) throw error
  return data // Retorna el UUID del hogar creado
}

// Agregar miembro por email (usando la función SQL)
export const agregarMiembroAlHogar = async (hogarId, email) => {
  const { data, error } = await supabase
    .rpc('agregar_miembro_por_email', {
      p_hogar_id: hogarId,
      p_email: email
    })
  
  if (error) throw error
  return data
}

// Eliminar miembro del hogar
export const eliminarMiembroDelHogar = async (miembroId) => {
  const { error } = await supabase
    .from('miembros_hogar')
    .delete()
    .eq('id', miembroId)
  
  if (error) throw error
}

// Actualizar información del hogar
export const actualizarHogar = async (hogarId, actualizacion) => {
  const { data, error } = await supabase
    .from('hogares')
    .update(actualizacion)
    .eq('id', hogarId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Eliminar hogar
export const eliminarHogar = async (hogarId) => {
  const { error } = await supabase
    .from('hogares')
    .delete()
    .eq('id', hogarId)
  
  if (error) throw error
}

// Obtener ingresos de todo el hogar
export const getIngresosHogar = async (hogarId, mes, anio) => {
  const { data, error } = await supabase
    .from('vista_ingresos_hogar')
    .select('*')
    .eq('hogar_id', hogarId)
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Obtener gastos de todo el hogar
export const getGastosHogar = async (hogarId, mes, anio) => {
  const { data, error } = await supabase
    .from('vista_gastos_hogar')
    .select('*')
    .eq('hogar_id', hogarId)
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Obtener deudas de todo el hogar
export const getDeudasHogar = async (hogarId) => {
  const { data, error } = await supabase
    .from('vista_deudas_hogar')
    .select('*')
    .eq('hogar_id', hogarId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
