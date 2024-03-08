// ==========================================================================================================
// ESJ01_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ01_CRUD
// fichier: serveur/controleurs/recette.controleur.js
// ==========================================================================================================
// import des modules necessaire
require('../models/database');
const Recette = require('../models/recette');
const Categorie = require('../models/categorie');

/*****************************************/
// GET  homepage 
exports.homepage = async(req, res) => {
  try {
    // LECTURE des datas
    const limitNumber = 5;
    const tabCategories = await Categorie.find({}).limit(limitNumber);
    const latest = await Recette.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recette.find({ 'categorie': 'Thai' }).limit(limitNumber);
    const american = await Recette.find({ 'categorie': 'American' }).limit(limitNumber);
    const chinese = await Recette.find({ 'categorie': 'Chinese' }).limit(limitNumber);
    const food = { latest, thai, american, chinese };
    // Variables des liens dans la PAGE index.ejs
    const urlExploreDernieresRecettes = '/api/recette/explore-dernieres-recettes'
    const urlExploreHasard  = '/api/recette/explore-hasard'
    const urlExploreUneCategorieParID  = '/api/recette/categorie/'
    const urlExploreToutesCategories  = '/api/recette/categories/'
    const urlExploreUneRecetteParID  = '/api/recette/une-recette/'
    const urlSoumettreUneRecette  = '/api/recette/soumettre-recette'
    const urlPostCreerUneRecette  = '/api/recette/soumettre-recette'
    // RENDRE la PAGE: index.ejs
    const oTemplateData = {
      title: "Blog de cuisine - Accueil",
      urlExploreDernieresRecettes: urlExploreDernieresRecettes,
      urlExploreHasard: urlExploreHasard,
      urlExploreUneCategorieParID: urlExploreUneCategorieParID,
      urlExploreToutesCategories: urlExploreToutesCategories,
      urlExploreUneRecetteParID: urlExploreUneRecetteParID,
      urlSoumettreUneRecette : urlSoumettreUneRecette,
      tabCategories: tabCategories,
      food: food
    }
    res.status(200).render("index", oTemplateData);
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

// -----------------------------------------------------------------------------------------------------------
/*****************************************/
// GET  soummettrerUneRecette
exports.soummettrerUneRecette = async(req, res) => {
  // récupération des messages flash (informations & erreurs)
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  const urlPostSoumettreRecette = "/api/recette/soumettre-recette"
  // RENDRE la PAGE: soumettre-recette.ejs
  const oTemplateData = {
    title: "Blog de cuisine - Soumettre une recette",
    infoErrorsObj: infoErrorsObj,
    infoSubmitObj: infoSubmitObj,
    urlPostSoumettreRecette: urlPostSoumettreRecette
  }
  res.status(200).render("soumettre-recette", oTemplateData);
}

/*****************************************/
// POST  addRecette
exports.addRecette = async(req, res) => {
  const {nom, description, email, tabIngrediants, categorie} = req.body;
  const urlSoumettreUneRecette  = '/api/recette/soumettre-recette'
  try {
    // GESTION de l'image ---
    let imageDansFile = undefined;
    let nvImageNom = undefined;
    let uploadChemin = undefined;
    // image: controle et chargement...
    if(!req.files || Object.keys(req.files).length === 0){
      console.log("ERREUR: Aucun fichier image n'a été téléchargé.");
    } else {
      // LECTURE image & constitution d'un nom d'image unique
      imageDansFile = req.files.image;
      nvImageNom = Date.now() + imageDansFile.name;
      uploadChemin = require('path').resolve('./') + '/public/uploads/' + nvImageNom;
      // mv: déplacer l'image dans le dossier upload
      imageDansFile.mv(uploadChemin, function(err){
        if(err){
          // ERREUR: return erreur
          return res.satus(500).send(err);
        }
      })
    }
    // 
    // SAUVEGARDE de la recette
    const uneRecette = new Recette({
      nom: nom,
      description: description,
      email: email,
      tabIngrediants: tabIngrediants,
      categorie: categorie,
      image: nvImageNom
    });
    const oSav = await uneRecette.save();
    //
    // OK: messages + redirection
    // req flash messages de soummission...
    req.flash('infoSubmit', 'La recette a été ajoutée.')
    //res.redirect('/submit-recipe');
    res.redirect(urlSoumettreUneRecette);
  } catch (error) {
    // KO: messages d'errurs + redirection
    // req flash messages d'erreurs
    req.flash('infoErrors', error);
    //res.redirect('/submit-recipe');
    res.redirect(urlSoumettreUneRecette);
  }
}
// -----------------------------------------------------------------------------------------------------------

/*****************************************/
// UPDATE  updateRecette
// async function updateRecette(){
//   try {
//     // Mettre à jour la recette : raclette
//     const res = await Recette.updateOne({ nom: 'New raclette update' }, { nom: 'raclette' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//     console.log(res)
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecette();

/*****************************************/
// DELETE  deleteRecette
// async function deleteRecette(){
//   try {
//     // Supprimer la recette : raclette    
//     await Recette.deleteOne({ name: 'raclette' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecette();





/*****************************************/
// GET  exploreOneRecette
exports.exploreOneRecette = async(req, res) => {
    try {
      const id = req.params.id; // id de la recette
      const uneRecette = await Recette.findById(id);
      // RENDRE la PAGE: recette.ejs
      const oTemplateData = {
        title: "Blog de cuisine - Recette",
        recette: uneRecette
      }
      res.status(200).render("recette", oTemplateData);
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
} 

/*****************************************/
// POST  rechercheRecette
exports.rechercheRecette = async(req, res) => {
  const {rechercheTerme} = req.body;
  try {
    // Recherche d'un Terme dans un texte parmis les recettes de cuisine
    let tabRecettes = await Recette.find( { $text: { $search: rechercheTerme, $diacriticSensitive: true } });
    // calcul des liens
    // lien vers un recette par son id: <a href="/api/recette/une-recette/<%= itemRecette._id %>" class="col text-center category__link">
    // lien vers l'image: <img src="/uploads/<%= itemRecette.image %>" alt="<%= itemRecette.nom %>" loading="lazy">
    const lienVersUneRecette = '/api/recette/une-recette/'
    const lienVersImage = '/uploads/'
    // RENDRE la PAGE: resultat-recherche.ejs
    const oTemplateData = {
      title: "Blog de cuisine - Résultat de la recherche",
      lienVersUneRecette: lienVersUneRecette,
      lienVersImage: lienVersImage,
      tabRecettes: tabRecettes
    }
    res.status(200).render("resultat-recherche", oTemplateData);
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/*****************************************/
// GET  exploreDernieresRecettes
exports.exploreDernieresRecettes = async(req, res) => {
  const limitNumber = 20;
  // liens
  const urlUneRecetteParSonID = '/api/recette/une-recette/'
  const lienVersImage = '/uploads/'
  try {
    // LECTURE des dernières recettes ( tri descendant : _id: -1  ) + ( limite de 20 )      
    const tabRecettes = await Recette.find({}).sort({ _id: -1 }).limit(limitNumber);
    // RENDRE la PAGE: resultat-recherche.ejs
    const oTemplateData = {
      title: "Blog de cuisine - Découvrez les dernières nouveautés",
      urlUneRecetteParSonID: urlUneRecetteParSonID,
      lienVersImage: lienVersImage,
      tabRecettes: tabRecettes
    }
    res.status(200).render("dernieres-recettes", oTemplateData);
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/*****************************************/
// GET  exploreRandom
exports.exploreAuHasard = async(req, res) => {
  // liens
  const urlUneRecetteParSonID = '/api/recette/une-recette/'
  const lienVersImage = '/uploads/'
  try {
    // Compter les Documents (ENEG.)
    // Random au hasard
    // LECTURE d'une recette au Hasard
    let count = await Recette.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let uneRecette = await Recette.findOne().skip(random).exec();
  // RENDRE la PAGE: recette-random.ejs
  const oTemplateData = {
    title: "Blog de cuisine - Découvrez les dernières nouveautés au hasard",
    urlUneRecetteParSonID: urlUneRecetteParSonID,
    lienVersImage: lienVersImage,
    recette: uneRecette
  }
  res.status(200).render("recette-random", oTemplateData);
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/*****************************************/
// GET  exploreCategories 
exports.exploreCategories = async(req, res) => {
//   try {
//     const limitNumber = 20;
//     const categories = await Categorie.find({}).limit(limitNumber);
//     res.render('categories', { title: 'Cooking Blog - Categoreis', categories } );
//   } catch (error) {
//     res.satus(500).send({message: error.message || "Error Occured" });
//   }
} 


/*****************************************/
// GET  exploreCategoriesById 
exports.exploreCategoriesById = async(req, res) => { 
//   try {
//     let categoryId = req.params.id;
//     const limitNumber = 20;
//     const categoryById = await Recette.find({ 'category': categoryId }).limit(limitNumber);
//     res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
//   } catch (error) {
//     res.satus(500).send({message: error.message || "Error Occured" });
//   }
} 



/* ====  DEUX FONCTIONS POUR INITIALISER LA BASE DE DONNEES DE TEST   === */
/* ====  à ne lancer qu'une seule fois & à commenter ensuite      T   === */
/**************************************************************************/
// insertDonneesCategoriesFactice                  insertDymmyCategoryData()
// async function insertDonneesCategoriesFactice(){
//   try {
//     await Categorie.insertMany([
//       {
//         "nom": "Dessert",
//         "image": "thai-food.jpg"
//       },
//       {
//         "nom": "Francais",
//         "image": "thai-food.jpg"
//       },
//       {
//         "nom": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "nom": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "nom": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "nom": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "nom": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "nom": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

//Appel: pour mettre à jour la base
//insertDonneesCategoriesFactice();


/**************************************************************************/
// insertDonneesRecettesFactice                      insertDymmyRecipeData()
// async function insertDonneesRecettesFactice(){
//   console.log('tentative d insertion dans recette');
//   try {
//     await Recette.insertMany([
//       { 
//         "nom": "gauffre facile et légère",
//         "description": `1) Battre les blancs en neige avec une pincée de sel et les ajouter au restant en remuant délicatement.
//         2) Mettre la farine dans un saladier, y ajouter le sucre, les jaunes d'œufs et le beurre ramolli.
//         3) Délayer peu à peu le tout en y ajoutant le lait pour qu'il n'y ait pas de grumeaux.
//         4) Incorporer les blancs en neige délicatement.
//         4) Cuire le tout dans un gaufrier légèrement beurré.
//         5) bon appétit`,
//         "email": "https://www.marmiton.org/recettes/recette_gaufres-faciles-et-legeres_87278.aspx",
//         "tabIngrediants": [
//           "1) une pincée de sel",
//           "2) 20 grammes de beure",
//           "3) 30 grammes de sucre",
//           "4) 200 grammes de farine",
//           "5) 3 oeufs",
//           "6) 25 cl de lait",
//         ],
//         "categorie": "Dessert", 
//         "image": "gauffre-recette-facile.jpeg"
//       },
//       { 
//         "nom": "Biscuits sablés au beurre",
//         "description": `1) Casser l'oeuf dans un saladier, y ajouter une pincée de sel, le sucre et le sucre vanillé. Mélanger avec une cuillère de bois jusqu'à ce que l'appareil blanchisse.
//         2) Ajouter la farine, puis mélanger avec les doigts pour obtenir du sable.
//         3) Ajouter le beurre et pétrir pour obtenir une pâte bien homogène.
//         4) Frapper la pâte en la lançant d'une main à l'autre jusqu'à obtenir une boule régulière. Si la pâte semble trop grasse et molle, y rajouter un peu de farine.
//         5) Laisser reposer la pâte au réfrigérateur durant un quart d'heure. Préchauffer le four à 180°C (thermostat 6) ***.
//         6) Etaler de la farine sur la table et sur le rouleau à pâtisserie, puis étaler la pâte sur 5 millimètres d'épaisseur.
//         7) Découper au couteau, à l'emporte-pièces ou avec un verre les formes que vous souhaitez.
//         8) Poser ces formes sur une tôle beurrée ou recouverte de papier sulfurisé.
//         9) Mettre à four durant 20 min.`,
//         "email": "https://www.marmiton.org/recettes/recette_biscuits-sables-au-beurre_31237.aspx",
//         "tabIngrediants": [
//           "1) 125 grammes de beurre",
//           "2) 120 grammes de sucre",
//           "3) 250 grammes de farine",
//           "4) un sacher de sucre vanillé",
//           "5) un oeuf",
//         ],
//         "categorie": "Dessert", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);



//   } catch (error) {
//     console.log('err', + error)
//   }
//}

//Appel: pour mettre à jour la base
//insertDonneesRecettesFactice();