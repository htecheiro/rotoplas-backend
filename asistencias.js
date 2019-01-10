const db = require('./db');

function createAsistencia(req, res) {
  var d = Date.now();
  var createddate_heroku__c = new Date(d);
  db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.asistencia__c (tipo__c, usuarioapp__c, geolocalizacion__latitude__s, geolocalizacion__longitude__s, createddate_heroku__c) values( $1, $2, $3, $4, $5 )',
    [req.body.tipo__c, req.body.usuarioapp__c, req.body.geolocalizacion__latitude__s, req.body.geolocalizacion__longitude__s, createddate_heroku__c])
    .then(function (data) {
      res.status(200).send({message: 'La ' + req.body.tipo__c + ' en Planta se realizó con éxito. ' });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al intentar la ' + req.body.tipo__c + ' en Planta.' + err});
      }
    });
}

/* endpoint */
function getAsistenciaUsuario(req, res) {

  var idOperador = req.params.idOperador;
  db.many("select id_asistencia__c, createddate_heroku__c, tipo__c, usuarioapp__c, name from  " + process.env.DATABASE_SCHEMA + ".asistencia__c where usuarioapp__c = $1 and createddate_heroku__c BETWEEN (select DATE 'now') AND (select DATE 'tomorrow') order by createddate_heroku__c desc" , idOperador)
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(200).send({ data: [] });
          //res.status(404).send({asistencias:err.received, message:'No se han registrado entradas o salidas en el dia.'});
        }else{
          res.status(500).send({message:'Error en el servidor. ' + err});
        }
    });
}


module.exports = {
  createAsistencia: createAsistencia,
  getAsistenciaUsuario: getAsistenciaUsuario
};
