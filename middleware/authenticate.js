'use strict'
var jwt = require('jwt-simple');
var moment = require('moment'); // fecha de creacion y expiracion tokens
var secret = 'clave-secreta';

exports.ensureAuth = function(req,res,next){ // snext : slair del middleware
if(!req.headers.authorization){
	return res.status(403).send({message:'la peticion no tiene la cabecera de autenticacion'});
}
	var token = req.headers.authorization.replace(/['"] + /g,''); //replace elimina las comillas del string que nos devuelve el token
	//Decodificar token.
try{
		var payload = jwt.decode(token,secret);// le pasamos el header y la clave secreta para decodificar
		// si la fecha de expiracion es menor a la fecha actual,  qy a paso y expiro.
		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'el token ha expirado'});
		}
	}
	catch(ex){
		return res.status(404).send({message:'token no valido'});
	}
	req.data = payload;
	next();
}
