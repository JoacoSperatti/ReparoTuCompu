// Datos iniciales para inicializar localStorage si está vacío

export const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    name: "PC Gamer Extreme Intel i7 RTX 4060", 
    price: 1200, 
    category: "Gamer", 
    img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "12 meses de garantía de fábrica",
    stock: "Disponible (Inmediato)",
    specs: [
      "Procesador Intel Core i7 13700F (Hasta 5.2 GHz)",
      "Placa de Video NVIDIA GeForce RTX 4060 8GB GDDR6",
      "Memoria RAM 16GB DDR5 5200MHz RGB",
      "Almacenamiento SSD NVMe M.2 1TB Gen4",
      "Placa Madre Chipset B760M Gen5 Ready",
      "Fuente de Alimentación 650W 80 Plus Bronze",
      "Gabinete Gamer Vidrio Templado + 4 Coolers ARGB"
    ]
  },
  { 
    id: 2, 
    name: "Notebook Oficina Lenovo Pro 14'", 
    price: 850, 
    category: "Notebooks", 
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "12 meses de garantía oficial",
    stock: "Pocas unidades disponibles",
    specs: [
      "Pantalla 14' IPS Full HD (1920x1080) Antirreflejo",
      "Procesador Intel Core i5 1235U (10 Núcleos / 12 Hilos)",
      "Memoria RAM 16GB DDR4 3200MHz Dual Channel",
      "Almacenamiento SSD NVMe M.2 512GB de alta velocidad",
      "Teclado retroiluminado en español con distribución física",
      "Gráficos integrados Intel Iris Xe Graphics",
      "Batería de larga duración (Hasta 7 horas de uso mixto)"
    ]
  },
  { 
    id: 3, 
    name: "Monitor 24' IPS Gigabyte G24F-2 165Hz", 
    price: 150, 
    category: "Monitores", 
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "6 meses de garantía",
    stock: "Disponible en sucursal",
    specs: [
      "Pantalla de 23.8 pulgadas plana con panel IPS",
      "Resolución Full HD (1920 x 1080 píxeles)",
      "Tasa de refresco ultra rápida de 165Hz (O.C. 170Hz)",
      "Tiempo de respuesta de 1ms (MPRT) / 2ms (GTG)",
      "Tecnología AMD FreeSync Premium e HDR Ready",
      "Conexiones: 2x HDMI 2.0, 1x DisplayPort 1.2, Hub USB",
      "Ajuste de altura y ergonomía avanzada"
    ]
  },
  { 
    id: 4, 
    name: "Teclado Mecánico RGB Redragon Mitra K551", 
    price: 80, 
    category: "Teclados", 
    img: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "6 meses de garantía directa",
    stock: "Disponible",
    specs: [
      "Distribución en Español Latinoamericano (con Ñ)",
      "Interruptores (Switches) Redragon Outemu Blue mecánicos",
      "Retroiluminación LED RGB con 18 efectos y brillo ajustable",
      "Construcción en aluminio ABS de alta durabilidad",
      "Teclas moldeadas por inyección de doble disparo (anti-borrado)",
      "Funciones Anti-Ghosting en todas las teclas (Full Key Rollover)",
      "Conector USB bañado en oro con cable mallado"
    ]
  },
  { 
    id: 5, 
    name: "Combo Actualización Intel i5 12400F + Mother H610", 
    price: 350, 
    category: "Combos actualización", 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "12 meses de garantía oficial",
    stock: "Disponible",
    specs: [
      "Procesador Intel Core i5 12400F (6 Núcleos / 12 Hilos, 4.4GHz)",
      "Placa Madre Chipset H610M LGA1700 DDR4",
      "Soporta memorias DDR4 hasta 3200MHz en Dual Channel",
      "Ranura PCIe 4.0 x16 para placas de video de última generación",
      "Zócalo M.2 PCIe Gen3/Gen4 para discos de estado sólido SSD",
      "Excelente opción para revivir tu antigua PC de oficina o gaming",
      "Incluye cooler stock de Intel"
    ]
  },
  { 
    id: 6, 
    name: "PC Hogar Básica AMD Ryzen 3 3200G", 
    price: 400, 
    category: "Hogar", 
    img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "6 meses de garantía",
    stock: "Disponible para entrega en 24hs",
    specs: [
      "Procesador AMD Ryzen 3 3200G con gráficos integrados Vega 8",
      "Memoria RAM 8GB DDR4 3200MHz",
      "Almacenamiento SSD M.2 SATA 240GB rápido",
      "Placa Madre Chipset A320M AM4",
      "Gabinete de oficina Slim con fuente de 500W incluida",
      "Ideal para tareas escolares, navegación web y oficina básica",
      "Incluye sistema operativo Windows y programas básicos"
    ]
  },
  { 
    id: 7, 
    name: "PC Gamer RTX 4070 AMD Ryzen 7 7700X (Nueva)", 
    price: 1600, 
    category: "Nuevas", 
    img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Nuevo",
    warranty: "12 meses de garantía oficial",
    stock: "Disponible bajo armado (demora 48hs)",
    specs: [
      "Procesador AMD Ryzen 7 7700X AM5 (Hasta 5.4 GHz)",
      "Placa de Video NVIDIA GeForce RTX 4070 12GB GDDR6X",
      "Memoria RAM 32GB DDR5 6000MHz Kingston Fury (2x16GB)",
      "Almacenamiento SSD NVMe M.2 2TB Kingston KC3000 PCIe 4.0",
      "Placa Madre ASUS Prime B650M-A WIFI integrada",
      "Refrigeración líquida CPU AIO de 240mm ARGB",
      "Fuente de Alimentación 750W 80 Plus Gold Modular"
    ]
  },
  { 
    id: 8, 
    name: "Notebook Lenovo ThinkPad L14 i5 (Usada)", 
    price: 350, 
    category: "Usadas", 
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    condition: "Usado - Excelente estado",
    warranty: "3 meses de garantía nuestra (Reparo Tu Compu)",
    stock: "Única unidad",
    specs: [
      "Pantalla 14 pulgadas Antirreflejo HD",
      "Procesador Intel Core i5 de 10ma Generación (10210U)",
      "Memoria RAM de 8GB DDR4 (Expandible)",
      "Almacenamiento SSD SATA de 256GB rápido",
      "Batería testeada al 85% de capacidad de fábrica",
      "Chasis reforzado con certificación militar anti-golpes",
      "Incluye cargador original Lenovo"
    ]
  }
];

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
