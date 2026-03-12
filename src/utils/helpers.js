// ============================================
// CATEGORÍAS PRINCIPALES DEL MODELO FINANCIERO
// ============================================
export const CATEGORIAS_PRINCIPALES = {
  VIDA: 'Vida',
  DEUDAS: 'Deudas',
  AHORRO: 'Ahorro',
  INVERSION: 'Inversión',
  DISFRUTE: 'Disfrute'
}

// ============================================
// TIPO DE MOVIMIENTO (Fondo Común vs Personal)
// ============================================
export const TIPO_MOVIMIENTO = {
  FONDO_COMUN: 'Fondo Común',
  JUAN: 'Juan',
  FLOR: 'Flor'
}

// ============================================
// SUBCATEGORÍAS POR CATEGORÍA PRINCIPAL
// ============================================

// Subcategorías de VIDA (Gastos del hogar - Fondo Común)
export const SUBCATEGORIAS_VIDA = [
  'Alquiler / Vivienda',
  'Comida',
  'Servicios (Luz, Gas, Agua)',
  'Internet',
  'Transporte',
  'Celulares',
  'Salud',
  'Otros gastos del hogar'
]

// Subcategorías de DEUDAS
export const SUBCATEGORIAS_DEUDAS = [
  'Tarjeta de Crédito',
  'Préstamo Personal',
  'Préstamo Hipotecario',
  'Cuotas',
  'Otras Deudas'
]

// Subcategorías de AHORRO
export const SUBCATEGORIAS_AHORRO = [
  'Fondo de Emergencia',
  'Ahorro para Objetivo',
  'Ahorro General',
  'Otros'
]

// Subcategorías de INVERSIÓN
export const SUBCATEGORIAS_INVERSION = [
  'Plazo Fijo',
  'Fondos Comunes de Inversión',
  'Acciones',
  'Criptomonedas',
  'Bienes Raíces',
  'Educación / Capacitación',
  'Otras Inversiones'
]

// Subcategorías de DISFRUTE (Gastos personales)
export const SUBCATEGORIAS_DISFRUTE = [
  'Ropa',
  'Hobbies',
  'Salidas / Restaurantes',
  'Entretenimiento',
  'Viajes',
  'Regalos',
  'Gustos Personales',
  'Otros'
]

// Mantener compatibilidad con código anterior
export const CATEGORIAS_GASTOS = SUBCATEGORIAS_VIDA

export const TIPO_GASTO = {
  FIJO: 'Fijo',
  VARIABLE: 'Variable'
}

export const ESTADO_PAGO = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado'
}

// ============================================
// CATEGORÍAS PARA OBJETIVOS
// ============================================
export const CATEGORIAS_OBJETIVOS = {
  AHORRO: 'Ahorro',
  DEUDA: 'Deuda',
  EMERGENCIA: 'Emergencia',
  INVERSION: 'Inversión'
}

// ============================================
// TIPOS DE INVERSIÓN
// ============================================
export const TIPOS_INVERSION = [
  'Plazo Fijo',
  'Fondo Común de Inversión',
  'Acciones',
  'Bonos',
  'Criptomonedas',
  'Bienes Raíces',
  'Educación',
  'Negocio Propio',
  'Otro'
]

// ============================================
// FRASES MOTIVACIONALES Y EDUCATIVAS
// ============================================
export const FRASES_MOTIVACIONALES = {
  DASHBOARD: [
    "Ordenar el dinero es ordenar la vida",
    "Cada peso con propósito te acerca a mayor tranquilidad",
    "No se trata solo de cuánto entra, sino de cómo lo organizás"
  ],
  AHORRO: [
    "Ahorrar no es guardarse, es prepararse",
    "El ahorro te da respaldo y tranquilidad para objetivos e imprevistos"
  ],
  INVERSION: [
    "Invertir es pensar en vos a futuro",
    "Hacer que tu dinero trabaje para el futuro",
    "Primero estabilidad, después crecimiento"
  ],
  DEUDAS: [
    "Ordenar y reducir deudas libera flujo de dinero para construir estabilidad",
    "Cada pago te acerca a la libertad financiera"
  ],
  DISFRUTE: [
    "Disfrutar también forma parte de una buena planificación financiera",
    "Es importante destinar algo para vos y lo que te hace feliz"
  ],
  EMERGENCIA: [
    "Un fondo de emergencia es tu respaldo ante imprevistos",
    "La tranquilidad viene de estar preparado"
  ],
  OBJETIVOS: [
    "Cada objetivo cumplido es un paso hacia la vida que querés",
    "Planificar es darle dirección a tus sueños"
  ],
  FONDO_COMUN: [
    "El fondo común sostiene la vida del hogar",
    "Cuando ambos aportan, el hogar crece más sólido"
  ]
}

// ============================================
// TEXTOS EXPLICATIVOS
// ============================================
export const TEXTOS_EXPLICATIVOS = {
  FONDO_COMUN: "Es el dinero que ambos aportan para sostener la vida del hogar: comida, alquiler, servicios, transporte.",
  DINERO_PERSONAL: "Dinero de cada uno para gastos individuales: ropa, hobbies, salidas, gustos personales.",
  VIDA: "Gastos necesarios para sostener el día a día del hogar.",
  DEUDAS: "Pagos de deudas existentes. Ordenarlas libera flujo de dinero.",
  AHORRO: "Dinero que guardás para objetivos futuros o imprevistos.",
  INVERSION: "Hacer que tu dinero trabaje y crezca a largo plazo.",
  DISFRUTE: "Destinado a disfrutar la vida: hobbies, salidas, gustos.",
  FONDO_EMERGENCIA: "Equivalente a 3-6 meses de gastos básicos. Tu red de seguridad ante imprevistos.",
  OBJETIVOS: "Define metas claras y medibles para darle dirección a tu dinero."
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount)
}

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`
}

export const calculatePercentage = (part, total) => {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

export const getCurrentMonth = () => {
  return new Date().getMonth() + 1
}

export const getCurrentYear = () => {
  return new Date().getFullYear()
}

export const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1]
}

// ============================================
// FUNCIONES PARA FRASES MOTIVACIONALES
// ============================================
export const getFraseAleatoria = (categoria) => {
  const frases = FRASES_MOTIVACIONALES[categoria] || []
  if (frases.length === 0) return ''
  return frases[Math.floor(Math.random() * frases.length)]
}

// ============================================
// FUNCIONES PARA CALCULAR DISTRIBUCIÓN
// ============================================
export const calcularDistribucionCategorias = (gastos) => {
  const distribucion = {
    Vida: 0,
    Deudas: 0,
    Ahorro: 0,
    Inversión: 0,
    Disfrute: 0
  }

  gastos.forEach(gasto => {
    const categoria = gasto.categoria_principal || 'Vida'
    distribucion[categoria] = (distribucion[categoria] || 0) + Number(gasto.monto)
  })

  return distribucion
}

export const calcularPorcentajeCategoria = (monto, totalGastos) => {
  if (totalGastos === 0) return 0
  return ((monto / totalGastos) * 100).toFixed(1)
}

// ============================================
// FUNCIONES PARA OBJETIVOS
// ============================================
export const calcularProgresoObjetivo = (montoActual, montoObjetivo) => {
  if (montoObjetivo === 0) return 0
  const progreso = (montoActual / montoObjetivo) * 100
  return Math.min(progreso, 100).toFixed(1)
}

export const calcularMontoRestante = (montoActual, montoObjetivo) => {
  return Math.max(0, montoObjetivo - montoActual)
}

// ============================================
// FUNCIONES PARA FONDO DE EMERGENCIA
// ============================================
export const calcularFondoEmergenciaSugerido = (gastoMensualPromedio, meses = 6) => {
  return gastoMensualPromedio * meses
}

export const calcularMesesCubiertos = (montoActual, gastoMensualPromedio) => {
  if (gastoMensualPromedio === 0) return 0
  return (montoActual / gastoMensualPromedio).toFixed(1)
}

// ============================================
// FUNCIONES PARA INVERSIONES
// ============================================
export const calcularRendimiento = (montoInvertido, valorActual) => {
  if (montoInvertido === 0) return 0
  const rendimiento = ((valorActual - montoInvertido) / montoInvertido) * 100
  return rendimiento.toFixed(2)
}

// ============================================
// FUNCIONES PARA CÁLCULOS FINANCIEROS
// ============================================
export const calcularTotalIngresos = (ingresos) => {
  if (!ingresos || ingresos.length === 0) return 0
  return ingresos.reduce((total, ingreso) => total + Number(ingreso.monto || 0), 0)
}

export const calcularTotalGastos = (gastos) => {
  if (!gastos || gastos.length === 0) return 0
  return gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0)
}

export const calcularBalance = (totalIngresos, totalGastos) => {
  return totalIngresos - totalGastos
}

// ============================================
// TIPOS DE AVISOS/ALERTAS
// ============================================
export const TIPOS_AVISO = {
  PAGO_PENDIENTE: 'pago_pendiente',
  OBJETIVO_CERCA: 'objetivo_cerca',
  DEUDA: 'deuda',
  RECORDATORIO: 'recordatorio',
  ALERTA: 'alerta',
  INFO: 'info'
}

export const PRIORIDADES_AVISO = {
  BAJA: 'baja',
  NORMAL: 'normal',
  ALTA: 'alta',
  URGENTE: 'urgente'
}

// Iconos para tipos de avisos
export const ICONOS_AVISO = {
  pago_pendiente: '💳',
  gasto_pendiente: '💸',
  objetivo_cerca: '🎯',
  deuda: '⚠️',
  recordatorio: '🔔',
  alerta: '⚡',
  info: 'ℹ️'
}

// Colores para prioridades
export const COLORES_PRIORIDAD = {
  baja: '#6b7280',
  normal: '#3b82f6',
  media: '#f59e0b',
  alta: '#f59e0b',
  urgente: '#ef4444'
}

// ============================================
// CATEGORÍAS PARA EMPRENDIMIENTO
// ============================================
export const CATEGORIAS_EMPRENDIMIENTO = {
  INGRESOS: [
    'Ventas',
    'Servicios',
    'Comisiones',
    'Otros Ingresos'
  ],
  GASTOS: [
    'Materia Prima',
    'Herramientas',
    'Marketing',
    'Servicios Profesionales',
    'Impuestos',
    'Otros Gastos'
  ]
}
