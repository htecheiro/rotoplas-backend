const db = require('./db');

function getTipoRutinas(req, res) {
  db.many('select sfid, nombre__c from  ' + process.env.DATABASE_SCHEMA + '.tiporutina__c order by name')
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

/* endpoint */
function getRutina(req, res) {
  var idRutina = req.params.id;
  db.one('select * from  ' + process.env.DATABASE_SCHEMA + '.rutinas__c where id_rutinas_heroku__c = $1', idRutina)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
          res.status(404).send({message:'La rutina solicitada no existe.'});
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
    });
}


/* endpoint */
function getActividadesRutina(req, res){
  var idRutina = req.params.id;
  db.many('SELECT actividadrutina.id_actividadesrutina__c, preguntarutina.name, actividadrutina.valor_si_no__c, actividadrutina.valornumerico__c, actividadrutina.observaciones__c FROM  ' + process.env.DATABASE_SCHEMA + '.rutinas__c INNER JOIN  ' + process.env.DATABASE_SCHEMA + '.actividadrutina__c as actividadrutina ON (rutinas__c.id_rutinas_heroku__c = actividadrutina.id_rutinas_heroku__c) INNER JOIN  ' + process.env.DATABASE_SCHEMA + '.preguntarutina__c as preguntarutina ON (actividadrutina.id_pregunta_rutina__c = preguntarutina.sfid) WHERE rutinas__c.id_rutinas_heroku__c = $1', idRutina)
  .then(function(data){
    res.status(200).send({
        data: data
      });
  }).catch(function(err){
    if(err.received == 0){
        res.status(404).send({message:'No hay actividades registradas para la Rutina seleccionada.'});
    }else{
        res.status(500).send({message:'Error en el servidor: ' + err});
    }
  });
}

/* endpoint */
function getRutinasUsuario(req, res) {
  var idPlanta = req.params.idPlanta;
  var idOperador = req.params.idOperador;
  db.many('SELECT rutina.id_rutinas_heroku__c, rutina.name, preguntarutina.turno__c, tiporutina.nombre__c, actividadrutina.idrutina__c, rutina.rutaimagen__c, rutina.observacion__c, rutina.idtiporutina__c, rutina.usuarioapp__c, rutina.idplanta__c, planta.formato__c, planta.determinante__c, createddate_heroku__c FROM ' + process.env.DATABASE_SCHEMA + '.actividadrutina__c as actividadrutina RIGHT JOIN ' + process.env.DATABASE_SCHEMA + '.preguntarutina__c as preguntarutina ON (preguntarutina.sfid = actividadrutina.id_pregunta_rutina__c) INNER JOIN ' + process.env.DATABASE_SCHEMA + '.rutinas__c as rutina on (rutina.sfid = actividadrutina.idrutina__c) INNER JOIN ' + process.env.DATABASE_SCHEMA + '.planta__c as planta on (planta.sfid = rutina.idplanta__c) INNER JOIN ' + process.env.DATABASE_SCHEMA + '.tiporutina__c as tiporutina on (tiporutina.sfid = rutina.idtiporutina__c) WHERE idplanta__c = $1 and usuarioapp__c = $2 GROUP BY rutina.id_rutinas_heroku__c, rutina.name, preguntarutina.turno__c, tiporutina.nombre__c, actividadrutina.idrutina__c, rutina.rutaimagen__c, rutina.observacion__c, rutina.idtiporutina__c, rutina.usuarioapp__c, rutina.idplanta__c, rutina.createddate, planta.formato__c, planta.determinante__c, createddate_heroku__c ORDER BY rutina.createddate_heroku__c DESC', [idPlanta, idOperador])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay rutinas registradas para la planta y operador.'});
        }else{
            res.status(500).send({message:'Error en el servidor: ' + err});
        }
    });
}

/* endpoint */
function getPreguntasTipoRutina(req, res) {
  var idTiporutina = req.params.idTipoRutina;
  var turno = req.params.turno;
  db.many('select * from  ' + process.env.DATABASE_SCHEMA + '.preguntarutina__c where idtiporutina__c = $1 and turno__c = $2 order by orden__c', [idTiporutina, turno])
    .then(function (data) {
      res.status(200).send({
          data: data
        });
      }).catch(function(err){
        if(err.received == 0){
            res.status(404).send({message:'No hay preguntas registradas para el tipo de rutina seleccionado.'});
        }else{
            res.status(500).send({message:'Error en el servidor ' + err});
        }
    });
}


function createActividadRutina(id_rutinas_heroku__c, actividadesRutina, callback) {
  for(var i in actividadesRutina) {
    db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.actividadrutina__c (id_rutinas_heroku__c, id_pregunta_rutina__c,' +
            'valor_si_no__c, valornumerico__c, observaciones__c) values ($1, $2, $3, $4, $5)',
            [id_rutinas_heroku__c, actividadesRutina[i].id_pregunta_rutina__c,
            actividadesRutina[i].valor_si_no__c, actividadesRutina[i].valornumerico__c, actividadesRutina[i].observaciones__c] )
    .then(function(data){
        callback(data, id_rutinas_heroku__c);
    })
    .catch(function(err){
      callback(err);
    });
  }
}

/* endpoint */
function crearRutina(req, res) {
  db.query('insert into  ' + process.env.DATABASE_SCHEMA + '.rutinas__c(observacion__c, idplanta__c, usuarioapp__c, idtiporutina__c, rutaimagen__c, createddate_heroku__c)' +
      'values( ${observacion__c}, ${idplanta__c}, ${usuarioapp__c}, ${idtiporutina__c}, ${rutaimagen__c}, ${createddate_heroku__c}) RETURNING id_rutinas_heroku__c',
    req.body)
    .then(function (data) {
        createActividadRutina(data[0].id_rutinas_heroku__c, req.body.actividadrutina__c, function(data, id_rutinas_heroku__c){
        //res.status(200).send({message: "La Rutina número " + id_rutinas_heroku__c + " y sus Actividades se crearon con éxito.",
        res.status(200).send({message: "La Rutina y sus Actividades se crearon con éxito.",
                              id_rutina_heroku__c: id_rutinas_heroku__c});
      });
    })
    .catch(function(err) {
      if(err){
        res.status(404).send({message:'Se produjo un error al crear la Rutina y sus Actividades. ' + err});
      }
    });
}

/* endpoint */
function getRutinaDiaria (req, res){
  var idOperador = req.params.idOperador;
  db.one("select id_rutinas_heroku__c, createddate from  " + process.env.DATABASE_SCHEMA + ".rutinas__c where usuarioapp__c = $1 and createddate BETWEEN (select DATE 'now') AND (select DATE 'tomorrow') order by createddate desc" , idOperador)
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
  getRutina: getRutina,
  getRutinasUsuario: getRutinasUsuario,
  getPreguntasTipoRutina: getPreguntasTipoRutina,
  crearRutina: crearRutina,
  getTipoRutinas: getTipoRutinas,
  getActividadesRutina: getActividadesRutina,
  getRutinaDiaria: getRutinaDiaria
};
