const fs = require('fs');
const mongoose = require("mongoose");

const stock = require("../models/etablissementModel.js");
const dbUtils = require("../utils/dbutils.js");

function MarkAsDone() {
    process.send({
        type: 'process:done',
        data: {
            pId: process.env.pm_id
        }
    });
}

function MarkAsReady() {
    process.send({
        type: 'process:ready',
        data: {
            pId: process.env.pm_id
        }
    });
}

MarkAsReady();

process.on('message', async function (packet) {
    try {
        await dbUtils.createConnection();
        const csvStr = fs.readFileSync(packet.data.file);
        const models = csvStr.toString().split("\n").map((line) => {
            const data = line.split(",");
            const stock = {
                _id: new mongoose.Types.ObjectId().toString(),
                siren: data[0].replace(/['"]+/g, '') || undefined, //
                nic: data[1].replace(/['"]+/g, '') || undefined, //
                siret: data[2].replace(/['"]+/g, '') || undefined, //
                dateCreationEtablissement: data[4].replace(/['"]+/g, '') || undefined, //
                dateDernierTraitementEtablissement: data[8].replace(/['"]+/g, '') || undefined,
                typeVoieEtablissement: data[14].replace(/['"]+/g, '') || undefined,
                libelleVoieEtablissement: data[15].replace(/['"]+/g, '') || undefined,
                codePostalEtablissement: data[16].replace(/['"]+/g, '') || undefined,
                libelleCommuneEtablissement: data[17].replace(/['"]+/g, '') || undefined,
                codeCommuneEtablissement: data[20].replace(/['"]+/g, '') || undefined,
                dateDebut: data[39].replace(/['"]+/g, '') || undefined,
                etatAdministratifEtablissement: data[40].replace(/['"]+/g, '') || undefined
            };
            return Object.fromEntries(Object.entries(stock).filter(([, value]) => value !== undefined));
        });
        if (models) {
            console.log(`Inserting from ${packet.data.file} : ${models.length}`);
            const data = await stock.EtablissementModel.collection.insertMany(models);
            console.log(`Inserted ${data.insertedCount} documents in MongoDB`);
            await dbUtils.closeConnection();
        }
    } catch (err) {
        console.error(err)
    }
    MarkAsDone();
});