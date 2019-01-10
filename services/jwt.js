'use strict'
//jwt services

var jwt = require('jwt-simple');
var moment = require('moment'); // fecha de creacion y expiracion tokens
var secret = 'clave-secreta';

exports.createToken = function(data){ // exports paraexportarlos --> le pasamos ppor parametro un objeto de usuario.
	// guarda dentro de un token la informacion del usuario logeado.
	var payload = {
		usuarioapp__c: data.usuarioapp__c,
		correoelectronicoc__c:data.correoelectronicoc__c,
		iat: moment().unix(), //fecha de creacion del token
		exp: moment().add(30, 'days').unix //expiracion token
	};
	return jwt.encode(payload, secret); //secret --> genera clave secreta para el gethash
}
