// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur/models/database.js                                                                                             
// ==========================================================================================================
// import des modules nécessaires
const mongoose = require('mongoose');
require('dotenv').config({path: '../config/.env'})
const DBURL = process.env.DBURL; // "mongodb+srv://thivoz:qiDIL2d7rifeHIew@nodetesttask.sqmnygk.mongodb.net/?retryWrites=true&w=majority"

// ==============================
// connexion à la BASE DE DONNEES
// ==============================
mongoose.set("strictQuery", false);
mongoose.connect(DBURL)
.then(() => {
    console.log('Connecté à la base MongoDB Atlas.')
})
.catch((err) => {
    console.log('erreur de connexion à la base MongoDB Atlas. err ='+err)
})


// Models
//require('./categorie');
//require('./recette');