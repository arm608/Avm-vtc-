/* =====================================================================
   CONFIGURATION AVM VTC — c'est le SEUL fichier à modifier au quotidien.
   Coordonnées, prix, forfaits et avis clients se changent ici.
   ===================================================================== */
window.AVM_CONFIG = {
  // ---- Coordonnées -------------------------------------------------------
  // Numéro au format international, sans espaces ni "+" (ex : 33612345678)
  phone: "33600000000",
  // Numéro affiché sur le site
  phoneLabel: "06 00 00 00 00",
  email: "contact@avm-vtc.fr",
  city: "Nantes",
  region: "Nantes & Loire-Atlantique",
  // Numéro d'inscription au registre des exploitants VTC (obligatoire)
  registre: "EVTC000000000",
  // Lien de votre fiche Google Business Profile ("Demander des avis" → copier le lien)
  googleReviewUrl: "https://www.google.com/maps/search/AVM+VTC+Nantes",

  // ---- Remises -----------------------------------------------------------
  firstBookingDiscount: 0.10, // 10 % sur la 1ʳᵉ réservation directe (0 = désactivé)
  roundTripDiscount: 0.05,    // 5 % sur l'aller-retour

  // ---- Tarification hors forfait ----------------------------------------
  pricing: {
    base: 8,        // prise en charge (€)
    perKm: 1.8,     // prix au km (€)
    minimum: 25,    // course minimum (€)
    perHour: 50,    // mise à disposition, par heure (€)
    minHours: 2
  },

  // ---- Véhicules (coef appliqué au prix berline) -------------------------
  vehicles: [
    { id: "berline", label: "Berline", detail: "4 pers. · 3 valises", coef: 1 },
    { id: "van",     label: "Van",     detail: "7 pers. · 7 valises", coef: 1.35 },
    { id: "premium", label: "Premium", detail: "Classe affaires",     coef: 1.6 }
  ],

  // ---- Forfaits à prix fixe (prix berline, TTC) --------------------------
  // group : airport | station | coast | tourism | city
  routes: [
    { id: "nte",       group: "airport", label: "Nantes centre ↔ Aéroport Nantes Atlantique", price: 35 },
    { id: "gare-nte",  group: "station", label: "Gare de Nantes ↔ Aéroport Nantes Atlantique", price: 35 },
    { id: "gare",      group: "station", label: "Gare de Nantes ↔ Nantes et agglomération",   price: 25 },
    { id: "stnaz",     group: "coast",   label: "Nantes ↔ Saint-Nazaire",                     price: 110 },
    { id: "labaule",   group: "coast",   label: "Nantes ↔ La Baule",                          price: 130 },
    { id: "pornic",    group: "coast",   label: "Nantes ↔ Pornic",                            price: 100 },
    { id: "puydufou",  group: "tourism", label: "Nantes ↔ Puy du Fou",                        price: 140 },
    { id: "angers",    group: "city",    label: "Nantes ↔ Angers",                            price: 150 },
    { id: "rennes",    group: "city",    label: "Nantes ↔ Rennes",                            price: 190 }
  ],

  // ---- Avis clients ------------------------------------------------------
  // Ajoutez ici de VRAIS avis (copiés depuis Google). Tant que la liste est vide,
  // le site invite simplement les clients à laisser un avis.
  // Exemple : { name: "Julie M.", text: "Chauffeur ponctuel et très agréable.", trip: "Aéroport" }
  reviews: []
};
