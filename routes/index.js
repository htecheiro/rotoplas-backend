var express = require('express');
var router = express.Router();
var md_auth = require('../middleware/authenticate')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'El Servidor de Sistema de Monitoreo Sytesa está ejecutándose...' });
});

var queries = require('../queries');
var rutinas = require('../rutinas');
var tickets = require('../tickets');
var usuarios = require('../usuarios');
var plantas = require('../plantas');
var motivos = require('../motivosoportunidades');
var sincronizacionsalesforce = require('../sincronizacionsalesforce');
var configuracion = require('../configuracion');
var clientes = require('../clientes');
var asistencias = require('../asistencias');
var syncoffline = require('../syncoffline');
var azurestorage = require('../azurestorage');

var nodemailer = require('../mailer/nodemailer-heroku')

router.post('/api/forgotpassword', nodemailer.forgotpassword);
router.put('/api/updatepassword', nodemailer.updatepassword);
router.post('/api/verifysecuritycode', nodemailer.verifysecuritycode);

//CASE
router.get('/api/ticket/:id',tickets.getOportunidad);
router.get('/api/ticketsusuario/:idPlanta/:idOperador', tickets.getOportunidadPorOperador);
router.post('/api/ticket', tickets.crearOportunidad);

//LOGIN, USUARIOS Y PLANTAS
router.get('/api/usuarios/:id', usuarios.getUsuario);
router.post('/api/login', usuarios.login);
router.get('/api/plantas',plantas.getAllPlantas);
router.get('/api/plantas/:id', plantas.getPlanta);
router.get('/api/configuracion/:userId', configuracion.getPlantasUsuario);

//RUTINAS
router.post('/api/rutina',rutinas.crearRutina);
router.get('/api/rutina/:id', rutinas.getRutina);
router.get('/api/rutinasusuario/:idPlanta/:idOperador', rutinas.getRutinasUsuario);
router.get('/api/preguntastiporutina/:idTipoRutina/:turno', rutinas.getPreguntasTipoRutina);
router.get('/api/tiporutinas', rutinas.getTipoRutinas);
router.get('/api/actividadesrutinas/:id', rutinas.getActividadesRutina);
router.get('/api/rutinadiaria/:idOperador', rutinas.getRutinaDiaria);

//MOTIVOS OPORTUNIDADES Y DESCRIPCIONES.
router.get('/api/motivosoportunidades', motivos.getAllMotivosOportunidades);
router.get('/api/motivosdesestabilizaciones/:id', motivos.getDesestabilizacionByDescripcionId);
router.get('/api/descripcionmotivos/:id', motivos.getDescripcionByMotivoId);

//CLIENTES
router.get('/api/clientesplanta/:idPlanta', clientes.getClientesByPlanta);

//ASISTENCIAS
router.post('/api/asistencia', asistencias.createAsistencia);
router.get('/api/asistenciausuario/:idOperador', asistencias.getAsistenciaUsuario);

//SYNC OFFLINE
router.get('/api/sync-preguntasrutina', syncoffline.getPreguntasRutinas);
router.get('/api/sync-tiporutinas', syncoffline.getTipoRutinas);
router.post('/api/sync-oportunidades', syncoffline.syncOportunidades);
router.post('/api/sync-rutinas', syncoffline.syncRutinas);

//AZURE
router.get('/api/azurelistarimagenesporcontenedor/:containername', azurestorage.listarImagenesPorContenedor);
//router.post('/api/azurestoragecrearcontainer', azurestorage.crearContainer);
router.post('/api/azurecrearcontenedorsubirimagen', azurestorage.crearContenedorSubirImagen);
//router.get('/api/azurestoragegetblobwithsas', azurestorage.getBlobUrlWithSas);


//SINCRONIZACION SALESFORCE
router.post('/api/postactividadtest', sincronizacionsalesforce.postActividadTest);
router.post('/api/posttiporutinatest', sincronizacionsalesforce.postTipoRutinaTest);
router.get('/api/loginSalesforce', sincronizacionsalesforce.loginSalesforce);

module.exports = router;
