const db = require('./db');
var https = require('https');

var username = 'desarrollo@rotoplas.com.desarrollo';
var password = 'sal3sforcetandilEyso4acRGWh3MwFxo4m3sO7U';
clientId = '3MVG9AzPSkglhtpsxfvVKovjnOeTVIYnBoFZe6jrEW.1LkhDWsCVjnFjgCG4GOSd8EOMxNdXH8yKOTTTj2GRf';
clientSecret = '8524502280722798143';

function performRequest(host, path, method, data, success) {
  var dataString = data;
  var headers = null;

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  } else {
      //JORGE DACEV: HARDCODE DE PRUEBA!!!
      if(host == 'test.salesforce.com'){ //DOMINIO DE LOGIN, necesita form-urlencoded
          headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cache-Control": "no-cache"
            };
      } else { //DOMINIO DE ALTA DE ACTIVIDADES POR EJEMPLO, necesita application/json
          headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          };
      }
    };

  var options = {
    host: host,
    path: path,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
      var responseString = '';
      res.on('data', function(d) {
        responseString += d;
      });

      res.on('end', function() {
        var parsed = JSON.parse(responseString);
        var responseObject = JSON.parse(responseString);
        success(responseObject);
      });
  });

  req.on('error', function(e) {
      console.log("Error en la comunicacion con SalesForce: " + e.message);
  });

  req.write(dataString);
  req.end();
}

function loginSalesforce() {
  var message = "grant_type=password&client_id=" + clientId + "&client_secret=" + clientSecret + "&username=" + username + "&password=" + password;
  performRequest("test.salesforce.com", "/services/oauth2/token", "POST", message, function(data) {
      console.log("loginSalesforce performRequest" + JSON.stringify(data));
      return data.access_token;
  });
}

function postActividadesTestSalesforce(idtiporutina, nombre, idsalesforce) {

    console.info('Datos de actividades enviados a salesforcerotoplas');
    console.info(idtiporutina);
    console.info(nombre);
    console.info(idsalesforce);

    performRequest('cs96.salesforce.com', '/services/apexrest/Actividades', 'PUT',
      {
        nombre: nombre,
        idsalesforce: idsalesforce
      }, function(data) {
          console.log("postActividadesTestSalesforce performRequest" + data);
      });
}


function postTipoRutinaTest(req, res, next) {
  db.none('insert into  ' + process.env.DATABASE_SCHEMA + '.tiporutinatest(nombre, idsalesforce)'
        + 'values(${nombre}, ${idsalesforce})', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function postActividadTest(req, res, next) {

  postActividadesTestSalesforce(req.body.idtiporutina, req.body.nombre, req.body.idsalesforce);

  var id = parseInt(req.params.id);
  db.none('insert into  ' + process.env.DATABASE_SCHEMA + '.actividadestest(idtiporutina, nombre, idsalesforce)'
        + 'values(${idtiporutina}, ${nombre}, ${idsalesforce})', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  postActividadTest: postActividadTest,
  postTipoRutinaTest: postTipoRutinaTest,
  loginSalesforce: loginSalesforce
};
