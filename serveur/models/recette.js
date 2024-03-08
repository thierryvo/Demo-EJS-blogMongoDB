// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur/models/recette.js
// ==========================================================================================================
// import des modules necessaire
const mongoose = require('mongoose');
// modèle (UserSchema)--------------------------------------------------------------------------------------
// clé unique:
const RecetteSchema = new mongoose.Schema({
  nom: { type: String, required: 'nom est obligatoire.' },
  description: { type: String, required: 'description est obligatoire.' },
  email: { type: String, required: 'email est obligatoire.' },
  tabIngrediants: { type: Array, required: 'tabIngediants est obligatoire.' },
  categorie: { type: String,
    enum: ['Francais', 'American', 'Chinese', 'Mexican', 'Indian', 'Dessert'],
    required: 'categorie est obligatoire.'
  },
  image: { type: String, required: 'image est obligatoire.'
  },
});
// index ---------------------------------------------------------------------------------------------------
// nom, description:
RecetteSchema.index({ nom: 'text', description: 'text' });
// Indexation générique  (WildCard Indexing):
//            RecetteSchema.index({ "$**" : 'text' });
// table----------------------------------------------------------------------------------------------------
// CREER le Modèle à partir du Schéma: (Modèle/Class,  Schéma,  Collection/Table)   
const Recette = mongoose.model('Recette', RecetteSchema, 'table-recettes');
//
// Export:
module.exports = Recette;