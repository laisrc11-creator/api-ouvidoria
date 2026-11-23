
const mysql = require('mysql2/promise');

const chaves = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_CA_BASE64'
];

const faltantes = chaves.filter(
    (chave) => !process.env[chave]?.trim()
);

if (faltantes.length > 0) {
    throw new Error(
        `Configure as variáveis: ${faltantes.join(', ')}`
    );
}

const certificado = Buffer.from(
    process.env.DB_CA_BASE64,
    'base64'
).toString('utf8');

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
