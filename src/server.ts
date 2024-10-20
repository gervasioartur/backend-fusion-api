import 'reflect-metadata';

import app from './app';
import debugLib from 'debug';
import http from 'http';
import { dataSource } from './v1/persistence/data-source';

const debug = debugLib('backend-fusion:server');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Connect to the database and start the server.
 */
async function startServer() {
    try {
        console.log('Initializing database connection...');
        await dataSource.initialize();
        console.log('Data Source has been initialized successfully!');

        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        console.log('Server running on port: ' + port);
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        process.exit(1);  // Exit process on failure
    }
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val; // Named pipe
    }
    if (port >= 0) {
        return port; // Port number
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    debug('Listening on ' + bind);
}

/**
 * Capture unhandled promise rejections and exceptions
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

/**
 * Start the server
 */
startServer();
