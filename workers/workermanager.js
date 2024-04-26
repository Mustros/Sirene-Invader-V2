const pm2 = require('pm2');

const NUM_WORKER_PER_CORE = 1;

const FREE_WORKERS = [];

function startWorkers() {
    for (let i = 0; i < NUM_WORKER_PER_CORE ; ++i) {
        pm2.start({
            script: './workers/worker.js',
            name: `worker${i}`,
            instances: "max",
            out_file: "./logs/workerlog.log",
            error_file: "./logs/error.log"
        }, (err, _) => {
            if (err) console.error(err);
        });
    }
}

function pushWorker(pId, callback) {
    FREE_WORKERS.push(pId);
    callback(pId);
}

function getWorkerCount() {
    return FREE_WORKERS.length;
}

function popWorker() {
    return FREE_WORKERS.pop();
}

function getNumOfWorkerPerCore() {
    return NUM_WORKER_PER_CORE;
}

module.exports = {
    startWorkers,
    pushWorker,
    getWorkerCount,
    popWorker,
    getNumOfWorkerPerCore
}