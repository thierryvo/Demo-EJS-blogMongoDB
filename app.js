// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur.js
// tuto chaine : https://www.youtube.com/watch?v=OEdPH4fV7vY
// git         : https://github.com/RaddyTheBrand/RecipeBlog-MongoDB-Node.js
// mongoDBaccès: https://www.mongodb.com/cloud/atlas/register
// test        :  node app.js
//                npm run dev          => lance nodemon, en Utilisant les scripts de package.json ***
// DESCRIPTION :  http://localhost:3000/api/recette
//
// installation: npm install express dotenv ejs
//               npm install mongodb mongoose validator
//               npm install express-session connect-flash express-fileupload cookie-parser
//               npm install express-ejs-layouts express-fileupload 
//               npm install nodemon --save-dev                                                                                                
// ==========================================================================================================
// import des modules nécessaires
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const urlSoumettreUneRecette  = '/api/recette/soumettre-recette'
require('dotenv').config({path: './serveur/config/.env'})

/*****************************************/
/* Initialisation de l'API (du serveur)  */
const appServeur = express();

/*****************************************/
/* Mise en place du paramétrage          */
  appServeur.use(express.json());
  appServeur.use(express.urlencoded({ extended: true }));
  appServeur.use(express.static('public'));
  appServeur.use(expressLayouts);
  appServeur.use(cookieParser('CookingBlogSecure'));
  appServeur.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
  }));
  appServeur.use(flash());
  appServeur.use(fileUpload());
  appServeur.set('layout', './layouts/main');
  appServeur.set("view engine", "ejs")

/*****************************************/
/* Mise en place du routage              */
appServeur.get('/', (req, res) => res.send(`Je suis en ligne (TEST01_EJS). Tout est OK pour l'instant."`));
// recette
const recetteRoutes = require('./serveur/routes/recetteRoutes.js')
appServeur.use('/api/recette', recetteRoutes);
//
//
appServeur.get('*', (req, res) => res.status(501).send("Qu'est-ce que tu fais bon sang de bois!?!")); // 501 ressource non implémenté

/******************************************************************/
/* Démarrer la connexion BASE DE DONNEES    (MongoDB Atlas)       */
require("./serveur/models/database")

/******************************************************************/
/* Démarrer le serveur: sur port 3000                             */
const port = process.env.PORT; // 3000;
appServeur.listen(port, () => {
    console.log("SERVEUR: EJS01_CRUD, demarré sur http://localhost:"+port);
});
