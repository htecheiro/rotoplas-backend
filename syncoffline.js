const db = require('./db');

function getPreguntasRutinas(req, res) {
  db.many('select name, turno__c, rutina__c, sfid, id, tipo_de_respuesta__c, idtiporutina__c, orden__c from ' + process.env.DATABASE_SCHEMA + '.preguntarutina__c order by id ASC ')
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron registros para las preguntas rutina.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}

function getTipoRutinas(req, res) {
  db.many('select sfid, nombre__c from  ' + process.env.DATABASE_SCHEMA + '.tiporutina__c order by id')
    .then(function (data) {
      res.status(200).send({ data: data });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'No se encontraron tipos de rutina.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}


function syncOportunidades(req, res) {
  for(var i in req.body.oportunidades) {
    db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.case(description, enviaagua__c, origin, idplanta__c, operadorapp__c, reason, descripciondefalla__c, motivodedesestabilizacion__c, accountid, createddate_heroku__c)' +
        'values( ${description}, ${enviaagua__c}, ${origin}, ${idplanta__c}, ${operadorapp__c}, ${reason}, ${descripciondefalla__c} , ${motivodedesestabilizacion__c}, ${accountid}, ${createddate_heroku__c}) ',
        req.body.oportunidades[i].description,
        req.body.oportunidades[i].enviaagua__c,
        req.body.oportunidades[i].origin,
        req.body.oportunidades[i].idplanta__c,
        req.body.oportunidades[i].operadorapp__c,
        req.body.oportunidades[i].reason,
        req.body.oportunidades[i].descripciondefalla__c,
        req.body.oportunidades[i].motivodedesestabilizacion__c,
        req.body.oportunidades[i].accountid,
        req.body.oportunidades[i].createddate_heroku__c)
      .then(function (data) {
        res.status(200).send({message: 'Las oportunidades se sincronizaron con éxito. '});
      })
      .catch(function(err) {
        if(err){
          res.status(404).send({message:'Falló al sincronizar las Oportunidades. ' + err});
        }
      });
  }
}


/* local */
function syncActividadRutina(id_rutinas_heroku__c, actividadesRutina, callback) {
  for(var i in actividadesRutina) {
    db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.actividadrutina__c (id_rutinas_heroku__c, id_pregunta_rutina__c,' +
            'valor_si_no__c, valornumerico__c, observaciones__c) values ($1, $2, $3, $4, $5)',
            [id_rutinas_heroku__c, actividadesRutina[i].id_pregunta_rutina__c,
            actividadesRutina[i].valor_si_no__c, actividadesRutina[i].valornumerico__c, actividadesRutina[i].observaciones__c] )
    .then(function(data){
        callback("success");
    })
    .catch(function(err){
      callback(err);
    });
  }
}

/* local */
function syncRutina(rutina, callback) {
  db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.rutinas__c(observacion__c, idplanta__c, usuarioapp__c, idtiporutina__c, rutaimagen__c, createddate_heroku__c)' +
      'values( ${observacion__c}, ${idplanta__c}, ${usuarioapp__c}, ${idtiporutina__c}, ${rutaimagen__c}, ${createddate_heroku__c}) RETURNING id_rutinas_heroku__c',
    rutina)
    .then(function (data) {
        syncActividadRutina(data[0].id_rutinas_heroku__c, rutina.actividadrutina__c, function(data){
        callback(data);
      });
    })
    .catch(function(err) {
      if(err){
        callback(err);
      }
    });
}

/* endpoint */
function syncRutinas(req, res){
  //recibe una lista de rutinas y cada rutina contiene una lista de actividades rutina.
  //luego itera las rutinas y llama al metodo syncRutina.
  for(var i in req.body.rutinas) {
    syncRutina(req.body.rutinas[i], function(data){
        //console.info("sync actividadrutina: " + data);
    });
    //console.info("sync rutina: ");
  }
  res.status(200).send({message: "Las Rutinas se sincronizaron con éxito.", status: "success"});
}


module.exports = {
  getPreguntasRutinas: getPreguntasRutinas,
  getTipoRutinas: getTipoRutinas,
  syncOportunidades: syncOportunidades,
  syncRutinas: syncRutinas
};
