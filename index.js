const fs = require('fs');
const pm2 = require('pm2');
const os = require('os');

const workerManager = require('./workers/workermanager');
const csvManager = require('./csv/csvmanager');

function processCSVs() {
    if(csvManager.getCSVCount() == 0) {
        
        if(workerManager.getWorkerCount() == os.cpus().length * workerManager.getNumOfWorkerPerCore()){
            console.log('all the work is done !');
            process.exit(1);
        }

        return;
    }

    const csvFile = csvManager.popCSV();
    const worker = workerManager.popWorker();

    pm2.sendDataToProcessId(worker, {
        type: 'process:msg',
        data: {
            file: csvFile,
        },
        topic: "sirene-invader-v2"
    }, (error, result) => {
        if (error) console.error(error);
    });
}

function main(args) {

    if(args.length < 3){
        console.log('Please enter a file to be indexed');
        return;
    }

    const csvFile = args[2];

    if(!fs.existsSync(csvFile)) {
        console.log('The file to be indexed doesnt exist');
        return;
    }

    csvManager.splitCSV(csvFile);

    pm2.connect(async function (err) {
        if(err) {
            console.log(err);
            return;
        }

        pm2.launchBus(function (err, pm2bus) {
            pm2bus.on('process:done', function (packet) {
                workerManager.pushWorker(packet.data.pId, (pId) => {
                    console.log(`worker number ${pId} done !`);
                    processCSVs();
                });
            })

            pm2bus.on('process:ready', function (packet) {
                workerManager.pushWorker(packet.data.pId, (pId) => {
                    console.log(`worker number ${pId} ready !`);
                    processCSVs();
                });
            })
        });

        workerManager.startWorkers();
    });
}

main(process.argv);