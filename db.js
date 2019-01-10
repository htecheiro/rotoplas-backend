const initOptions = {
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};


const pgp = require('pg-promise')(initOptions);
var pgssl = require('pg');

pgssl.defaults.ssl = true;

//Nota: el connection string se toma desde las variables de entorno de HEROKU
//Si se quiere correr la aplicación de forma local, se deberá crear una variable de entorno
//en el sistema llamada DATABASE_URL que contenga el connection string copiado y pegado desde la configuración
//de HEROKU
const db = pgp(process.env.DATABASE_URL);

db.connect()
    .then(obj => {
        obj.done(); // success, release the connection;

    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

module.exports = db;
