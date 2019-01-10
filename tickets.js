const db = require('./db');

function getOportunidad(req, res) {
  var id = req.params.id;
  db.one('SELECT id_case_heroku_c__c, origin, casenumber, motivodedesestabilizacion__c, "case".createddate, subject status, enviaagua__c, descripciondefalla__c, reason, description, clientes.name as nombrecliente FROM  ' + process.env.DATABASE_SCHEMA + '.case INNER JOIN  ' + process.env.DATABASE_SCHEMA + '.account as clientes ON ("case".accountid = clientes.sfid) WHERE "case".id_case_heroku_c__c = $1', id)
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message:'La Oportunidad C que ha solicitado no existe.'});
      }
    });
}

function getOportunidadPorOperador(req, res){
  var idPlanta = req.params.idPlanta;
  var operador = req.params.idOperador;
    db.many('select * from  ' + process.env.DATABASE_SCHEMA + '.case where idplanta__c = $1 and operadorapp__c = $2 order by createddate_heroku__c desc', [idPlanta, operador])
    .then(function(data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function(err) {
      if(err.received == 0){
        res.status(404).send({message:'No existen Oportunidades C para el operador y la planta indicada.'});
      }
    });
}

function crearOportunidad(req, res) {
  db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.case(description, enviaagua__c, origin, idplanta__c, operadorapp__c, reason, descripciondefalla__c, motivodedesestabilizacion__c, accountid, createddate_heroku__c)' +
      'values( ${description}, ${enviaagua__c}, ${origin}, ${idplanta__c}, ${operadorapp__c}, ${reason}, ${descripciondefalla__c} , ${motivodedesestabilizacion__c}, ${accountid}, ${createddate_heroku__c}) RETURNING id_case_heroku_c__c',
    req.body)
    .then(function (data) {
      res.status(200).send({message: 'Se Creó Oportunidad C número ' + data[0].id_case_heroku_c__c,
                            id_case_heroku_c__c: data[0].id_case_heroku_c__c }
                          );
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Falló al crear Oportunidad C. ' + err});
      }
    });
}

module.exports = {
  getOportunidad: getOportunidad,
  getOportunidadPorOperador: getOportunidadPorOperador,
  crearOportunidad: crearOportunidad
};
