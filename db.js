
const mysql = require('mysql2/promise');
const fs = require('node:fs');
const path = require('node:path');

const chaves = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];

const faltantes = chaves.filter(
    (chave) => !process.env[chave]?.trim()
);

if (faltantes.length > 0) {
    throw new Error(
        `Configure as variáveis: ${faltantes.join(', ')}`
    );
}

const certificado = fs.readFileSync(
    path.join(__dirname, 'ca (1).pem')
);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: certificado,
        rejectUnauthorized: true,
        verifyIdentity: true
    },
    connectionLimit: 3,
    connectTimeout: 10000,
    dateStrings: true
});

module.exports = pool;
