// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur/models/categorie.js
// ==========================================================================================================
// import des modules necessaire
const mongoose = require('mongoose');
// modèle (UserSchema)--------------------------------------------------------------------------------------
// clé unique:
const CategorieSchema = new mongoose.Schema({
  nom: { type: String, required: 'nom est obligatoire.' },
  image: { type: String, required: 'image ets obligatoire.' },
});
// table----------------------------------------------------------------------------------------------------
// CREER le Modèle à partir du Schéma: (Modèle/Class,  Schéma,  Collection/Table)   
const Categorie = mongoose.model('Categorie', CategorieSchema, 'table-categories');
//
// Export:
module.exports = Categorie;