// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur/routes/recetteRoutes.js                                                                                               
// ==========================================================================================================
// import des modules necessaire
const recetteControleur = require('../controleurs/recette.controleur');

/*************************************************/
/*** Récupération du routeur d'express           */
const routeur = require('express').Router();

/*************************************************/
/*** Routage de la ressource Recette             */
routeur.get('/', recetteControleur.homepage);
routeur.get('/une-recette/:id', recetteControleur.exploreOneRecette);
routeur.get('/categories', recetteControleur.exploreCategories);
routeur.get('/categorie/:id', recetteControleur.exploreCategoriesById);
routeur.post('/recherche', recetteControleur.rechercheRecette);
routeur.get('/explore-dernieres-recettes', recetteControleur.exploreDernieresRecettes);
routeur.get('/explore-hasard', recetteControleur.exploreAuHasard);
routeur.get('/soumettre-recette', recetteControleur.soummettrerUneRecette);
routeur.post('/soumettre-recette', recetteControleur.addRecette);

 
module.exports = routeur;