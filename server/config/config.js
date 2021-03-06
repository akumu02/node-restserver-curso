// =======================
// Puerto
// =======================
process.env.PORT = process.env.PORT || 3000;

// =======================
// Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Vencimiento del token
// =======================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =======================
// SEED de autenticación
// =======================
process.env.seed = process.env.seed || 'este-es-el-seed-desarrollo';

// =======================
// Base de datos
// =======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =======================
// Base de datos
// =======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '752965751007-q7u93p5ofdcrh6bojua7oacu4qd1smtm.apps.googleusercontent.com';