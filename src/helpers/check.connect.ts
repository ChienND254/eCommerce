import { log } from 'console';
import mongoose from 'mongoose';
import os from 'os'
import process from 'process';
const _SECONDS = 5000
const countConnect = async (): Promise<void> => {
    const numConnections = mongoose.connections.length;
    log(`Number of connections: ${numConnections}`);
}

//check overload

const checkOverLoad = (): void => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss
        //Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5
        log(`Active connections:: ${numConnections}`)
        log(`Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
        if (numConnections > maxConnections) {
            log(`Connection overload detected`)
        }
    }, _SECONDS); // monitor 5s 
}
export { countConnect, checkOverLoad };