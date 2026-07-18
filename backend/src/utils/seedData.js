/**
 * Seed inicial — ejecutar con: node src/utils/seedData.js
 * Carga técnicos y tickets de prueba en la base de datos.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Ticket   = require('../models/Ticket');
const Tecnico  = require('../models/Tecnico');

const tecnicos = [
  { nombre: 'Ing. María López',  correo: 'mlopez@utm.edu.ec',  especialidad: 'software', disponible: true,  ticketsActivos: 2 },
  { nombre: 'Ing. Pedro Suárez', correo: 'psuarez@utm.edu.ec', especialidad: 'red',      disponible: true,  ticketsActivos: 1 },
  { nombre: 'Ing. Carlos Reyes', correo: 'creyes@utm.edu.ec',  especialidad: 'hardware', disponible: false, ticketsActivos: 3 },
];

const tickets = [
  {
    solicitante: { nombre: 'Walter Loor', correo: 'wloor@utm.edu.ec', departamento: 'Infraestructura TI' },
    titulo: 'Servidor de base de datos no responde en zona A',
    descripcion: 'El servidor SRV-DB-01 dejó de responder a las 08:25. Los servicios MySQL y PostgreSQL no inician. El log indica corrupción en el tablespace principal.',
    categoria: 'software-bd',
    prioridad: 'critica',
    estado: 'en-proceso',
    equipoAfectado: { nombre: 'SRV-DB-01', ip: '192.168.1.10' },
    tecnicoAsignado: { nombre: 'Ing. María López', especialidad: 'software' },
    fechaDeteccion: new Date('2026-07-07T08:25:00'),
  },
  {
    solicitante: { nombre: 'Ana García', correo: 'agarcia@utm.edu.ec', departamento: 'Administración' },
    titulo: 'Pérdida de conectividad en switch de distribución SW-DIST-02',
    descripcion: 'El switch SW-DIST-02 perdió conectividad con los switches de acceso del piso 2, dejando sin red a 35 estaciones del área administrativa.',
    categoria: 'red-lan',
    prioridad: 'alta',
    estado: 'abierto',
    equipoAfectado: { nombre: 'SW-DIST-02', ip: '10.0.2.1' },
    usuariosAfectados: 'departamento',
    serviciosAfectados: ['intranet', 'correo'],
  },
  {
    solicitante: { nombre: 'Roberto Vera', correo: 'rvera@utm.edu.ec', departamento: 'Soporte N1' },
    titulo: 'Fallo en disco duro RAID del servidor SRV-FILE-02',
    descripcion: 'El servidor de archivos SRV-FILE-02 reporta degradación del arreglo RAID-5. Disco en ranura 3 marcado como fallido. Datos en riesgo.',
    categoria: 'hardware-almacenamiento',
    prioridad: 'alta',
    estado: 'en-proceso',
    equipoAfectado: { nombre: 'SRV-FILE-02', ip: '192.168.1.20' },
    tecnicoAsignado: { nombre: 'Ing. Carlos Reyes', especialidad: 'hardware' },
    fechaDeteccion: new Date('2026-07-06T14:20:00'),
  },
  {
    solicitante: { nombre: 'Luis Torres', correo: 'ltorres@utm.edu.ec', departamento: 'Docencia' },
    titulo: 'Sistema de correo institucional inaccesible',
    descripcion: 'El servidor de correo no permite enviar ni recibir mensajes desde hace 3 horas. Afecta a todos los usuarios institucionales.',
    categoria: 'software-aplicacion',
    prioridad: 'critica',
    estado: 'en-proceso',
    equipoAfectado: { nombre: 'MAIL-SRV-01', ip: '192.168.1.5' },
    usuariosAfectados: 'toda-organizacion',
    serviciosAfectados: ['correo'],
    tecnicoAsignado: { nombre: 'Ing. María López', especialidad: 'software' },
  },
  {
    solicitante: { nombre: 'Carmen Bravo', correo: 'cbravo@utm.edu.ec', departamento: 'RRHH' },
    titulo: 'VPN corporativa sin conexión desde trabajo remoto',
    descripcion: 'Varios usuarios no pueden conectarse a la VPN corporativa desde sus casas. El servidor VPN no responde en el puerto 1194.',
    categoria: 'red-vpn',
    prioridad: 'media',
    estado: 'resuelto',
    equipoAfectado: { nombre: 'VPN-GW-01', ip: '200.10.5.1' },
    tecnicoAsignado: { nombre: 'Ing. Pedro Suárez', especialidad: 'red' },
    solucionAplicada: 'Se reinició el servicio OpenVPN y se actualizó el certificado expirado. Conexiones restablecidas.',
    fechaResolucion: new Date('2026-07-06T14:00:00'),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones
    await Promise.all([Ticket.deleteMany(), Tecnico.deleteMany()]);
    console.log('🧹 Colecciones limpiadas');

    // Insertar datos
    await Tecnico.insertMany(tecnicos);
    console.log(`👷 ${tecnicos.length} técnicos insertados`);

    // Insertar tickets uno a uno para disparar el middleware pre-save (código)
    for (const t of tickets) {
      await Ticket.create(t);
    }
    console.log(`🎫 ${tickets.length} tickets insertados`);

    console.log('🌱 Seed completado correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
};

seed();
