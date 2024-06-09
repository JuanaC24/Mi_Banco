require('dotenv').config();
const readline = require('readline');
const { Client } = require('pg');

// Función auxiliar para iniciar y conectar el cliente de la base de datos
function initializeDatabase() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    client.connect();
    return client;
}

const client = initializeDatabase();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (input) => resolve(input.trim()));
    });
}

// Función para manejar errores y realizar rollback
function handleError(error, client) {
    console.error('Error en la operación:', error.message);
    client.query('ROLLBACK');
}

async function registrarTransferencia() {
    const descripcion = await prompt('Ingrese la descripción de la transferencia: ');
    const fecha = await prompt('Ingrese la fecha de la transferencia (YYYY-MM-DD): ');
    const monto = await prompt('Ingrese el monto de la transferencia: ');
    const cuenta_origen = await prompt('Ingrese el ID de la cuenta de origen: ');
    const cuenta_destino = await prompt('Ingrese el ID de la cuenta destino: ');

    const montoFloat = parseFloat(monto);
    const cuentaOrigenInt = parseInt(cuenta_origen, 10);
    const cuentaDestinoInt = parseInt(cuenta_destino, 10);

    if (isNaN(montoFloat) || montoFloat <= 0 || isNaN(cuentaOrigenInt) || isNaN(cuentaDestinoInt)) {
        console.error('Error: Entrada inválida, asegúrese de que el monto y los IDs de las cuentas sean números.');
        return;
    }

    try {
        await client.query('BEGIN');
        await client.query('UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2', [montoFloat, cuentaOrigenInt]);
        await client.query('UPDATE cuentas SET saldo = saldo + $1 WHERE id = $3', [montoFloat, cuentaDestinoInt]);
        const result = await client.query('INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES ($1, $2, $3, $4, $5) RETURNING *', [descripcion, fecha, montoFloat, cuentaOrigenInt, cuentaDestinoInt]);
        await client.query('COMMIT');
        console.log('Última transferencia registrada:', result.rows[0]);
    } catch (error) {
        handleError(error, client);
    }
}

async function consultarUltimasTransferencias() {
    const cuenta_id = await prompt('Ingrese el ID de la cuenta para ver las últimas transferencias: ');
    try {
        const result = await client.query('SELECT * FROM transferencias WHERE cuenta_origen = $1 OR cuenta_destino = $1 ORDER BY id DESC LIMIT 10', [parseInt(cuenta_id, 10)]);
        console.log('Últimas 10 transferencias:', result.rows);
    } catch (error) {
        console.error('Error al consultar transferencias:', error.message);
    }
}

async function consultarSaldo() {
    const cuenta_id = await prompt('Ingrese el ID de la cuenta para consultar el saldo: ');
    try {
        const result = await client.query('SELECT saldo FROM cuentas WHERE id = $1', [parseInt(cuenta_id, 10)]);
        if (result.rows.length > 0) {
            console.log('Saldo de la cuenta:', result.rows[0].saldo);
        } else {
            console.log('Cuenta no encontrada');
        }
    } catch (error) {
        console.error('Error al consultar saldo:', error.message);
    }
}

async function main() {
    console.log('Seleccione una opción:');
    console.log('1. Registrar una nueva transferencia');
    console.log('2. Consultar los últimos 10 registros de una cuenta');
    console.log('3. Consultar el saldo de una cuenta');
    console.log('4. Salir');

    const option = await prompt('Ingrese su opción: ');

    switch (option) {
        case '1':
            await registrarTransferencia();
            break;
        case '2':
            await consultarUltimasTransferencias();
            break;
        case '3':
            await consultarSaldo();
            break;
        case '4':
            rl.close();
            client.end();
            return;
        default:
            console.log('Opción no válida');
    }

    main(); // Reinicia el menú después de cada operación
}

main();
