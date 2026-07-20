// Datos iniciales para inicializar localStorage si está vacío

export const INITIAL_PRODUCTS = [];


export const INITIAL_TICKETS = {
  "RTC-1001": {
    ticketId: "RTC-1001",
    clientName: "Alejandro Gómez",
    device: "Notebook Asus Zenbook UX430",
    entryDate: "15/07/2026",
    estimatedDelivery: "21/07/2026",
    description: "El equipo presenta pantalla intermitente y sobrecalentamiento al abrir programas de diseño.",
    currentStep: 2, // 1: Recibido, 2: Diagnóstico, 3: Presupuesto, 4: Reparación, 5: Pruebas, 6: Listo
    priceEstimate: "Sujeto a presupuesto",
    statusNotes: "Estamos diagnosticando el flex de video para determinar si requiere cambio de pantalla o solo mantenimiento físico de contactos.",
    history: [
      { step: 1, date: "15/07/2026 10:30", label: "Equipo recibido en sucursal" },
      { step: 2, date: "16/07/2026 14:15", label: "Ingresado a laboratorio técnico para diagnóstico detallado" }
    ]
  },
  "RTC-1002": {
    ticketId: "RTC-1002",
    clientName: "Carolina Herrera",
    device: "PC Escritorio Gamer Custom",
    entryDate: "12/07/2026",
    estimatedDelivery: "18/07/2026 (Listo para retirar)",
    description: "Instalación de sistema de refrigeración líquida de 240mm y optimización de flujo de aire en gabinete.",
    currentStep: 6,
    priceEstimate: "$75.000 (Aprobado)",
    statusNotes: "Instalación finalizada con éxito. Pruebas de estrés superadas (temperatura máxima 65°C en carga máxima). El equipo está listo para su retiro.",
    history: [
      { step: 1, date: "12/07/2026 16:00", label: "Equipo recibido en sucursal" },
      { step: 2, date: "13/07/2026 09:30", label: "Diagnóstico inicial de compatibilidad de gabinete" },
      { step: 3, date: "13/07/2026 12:00", label: "Presupuesto aprobado por el cliente" },
      { step: 4, date: "14/07/2026 15:45", label: "Instalación de componentes y gestión de cables" },
      { step: 5, date: "15/07/2026 11:00", label: "Pruebas de estrés y estabilidad térmicas completadas" },
      { step: 6, date: "16/07/2026 10:00", label: "Equipo marcado como listo para retiro" }
    ]
  },
  "RTC-1003": {
    ticketId: "RTC-1003",
    clientName: "Mariano Mastandrea",
    device: "MacBook Air M1 2020",
    entryDate: "10/07/2026",
    estimatedDelivery: "23/07/2026",
    description: "Reemplazo de teclado dañado por derrame de café y diagnóstico de sulfatación en placa.",
    currentStep: 4,
    priceEstimate: "Pendiente de repuestos",
    statusNotes: "Limpieza por ultrasonido en placa lógica completada. Teclado original importado en camino. Tiempo estimado de arribo del repuesto: 3 días hábiles.",
    history: [
      { step: 1, date: "10/07/2026 11:20", label: "Equipo recibido con protocolo de derrame de líquidos" },
      { step: 2, date: "11/07/2026 10:00", label: "Desarmado inicial y remoción de corrosión" },
      { step: 3, date: "11/07/2026 17:30", label: "Presupuesto de repuestos aprobado por el cliente" },
      { step: 4, date: "13/07/2026 09:00", label: "Orden de repuestos enviada a importador. En espera de entrega." }
    ]
  }
};
