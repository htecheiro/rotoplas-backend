const db = require('./db');

function getAllMotivosOportunidades(req, res) {
  db.many('select * from  ' + process.env.DATABASE_SCHEMA + '.motivooportunidadc__c')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado oportunidades'});
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getDescripcionByMotivoId(req, res,next) {
  var motivoId = req.params.id;
  db.many('select * from  ' + process.env.DATABASE_SCHEMA + '.descripciondefalla__c where motivooportunidadc__c = $1', motivoId)
    .then(function (data) {
      console.log(data);
        res.status(200).send({
          data: data
      });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'No se ha encontrado la descripción'});
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getDesestabilizacionByDescripcionId(req, res) {
  var descripcionId = req.params.id;
  db.many('select * from  ' + process.env.DATABASE_SCHEMA + '.motivodedesestabilizacion__c where descripcionfalla__c = $1', descripcionId)
    .then(function (data){
      res.status(200).send({
          data: data
      });
    })
   .catch(function(err,data) {
      if(err.received == 0){
        res.status(404).send({message:'No existen desestabilizaciones'});
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

module.exports = {
getAllMotivosOportunidades: getAllMotivosOportunidades,
getDescripcionByMotivoId: getDescripcionByMotivoId,
getDesestabilizacionByDescripcionId: getDesestabilizacionByDescripcionId
}
