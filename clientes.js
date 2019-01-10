const db = require('./db');

function getClientesByPlanta(req, res) {
  var idPlanta = req.params.idPlanta;
  db.many('select sfid, name from  ' + process.env.DATABASE_SCHEMA + '.account where planta_del_del__c = $1', idPlanta)
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No existen Clientes asociados a la Planta.'});
        }else{
          res.status(500).send({message:'Error en el servidor ' + err});
        }
    });
}

module.exports = {
  getClientesByPlanta: getClientesByPlanta
}
