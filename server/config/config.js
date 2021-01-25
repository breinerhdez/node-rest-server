/**
 * Configuraciones generales
 *
 * Se utiliza el objeto process porque es global en toda la aplicación
 */

/**
 * Puerto
 * Configuración del puerto con el cual se despliega la aplicación
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Base de datos
 */
let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB =
    "mongodb+srv://cafe-node:5GP2k2vuVgEvy97@cluster0.8loof.mongodb.net/cafe";
}

process.env.URLDB = urlDB;
