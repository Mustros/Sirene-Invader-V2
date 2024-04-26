# Sirene Invader V2

Ce projet sous Node.js vise a lire un fichier CSV, le diviser en fichiers CSV plus petits et insérer les données dans une base de données MongoDB en utilisation la parallélisation afin d'améliorer l'efficacité du processus.


## Prérequis

- Installer MongoDB
- Installer PM2

## Démarrer le programme

    npm install
    npm run start

## A la fin du programme
Pour supprimer toutes les taches de font en cours :

    pm2 delete all

## Avant de relancer le programme
Pour supprimer tous les fichiers CSV générés :

    del /s splitted\*
Pour vider les fichiers de logs :

    copy /y nul logs\error.log & copy /y nul logs\workerlog.log
