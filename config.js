/* =====================================================================
   CONFIGURATION AVM VTC — c'est le SEUL fichier à modifier au quotidien.
   Coordonnées, prix, forfaits et avis clients se changent ici.
   ===================================================================== */
window.AVM_CONFIG = {
  // ---- Coordonnées -------------------------------------------------------
  phone: "33781754677",            // format international, sans "+" ni espaces
  phoneLabel: "07 81 75 46 77",    // numéro affiché
  email: "contact@avm-vtc.fr",
  city: "Nantes",
  region: "Nantes & Loire-Atlantique",
  registre: "EVTC000000000",       // n° d'inscription au registre VTC (obligatoire)
  googleReviewUrl: "https://www.google.com/maps/search/AVM+VTC+Nantes",

  // ---- Remises -----------------------------------------------------------
  firstBookingDiscount: 0.10,      // 10 % sur la 1ʳᵉ réservation directe (0 = désactivé)

  // ---- Tarification au kilomètre (hors forfait) --------------------------
  pricing: {
    base: 8,        // prise en charge (€)
    perKm: 1.8,     // prix au km (€)
    minimum: 25     // course minimum (€)
  },

  // ---- Véhicules (coef appliqué au prix berline) -------------------------
  vehicles: [
    { id: "berline", label: "Berline", icon: "🚘", seats: 4, detail: "Confort · 3 valises",       coef: 1 },
    { id: "van",     label: "Van",     icon: "🚐", seats: 7, detail: "Familles, groupes, bagages", coef: 1.35 },
    { id: "premium", label: "Premium", icon: "✨", seats: 4, detail: "Classe affaires",            coef: 1.6 }
  ],

  // ---- Zone « Nantes » pour les forfaits (centre + rayon en km) ----------
  nantesZone: { lat: 47.2184, lon: -1.5536, radiusKm: 10 },

  // ---- Forfaits à prix fixe (prix berline, TTC) --------------------------
  // Si un trajet part de la zone Nantes et arrive près d'un lieu ci-dessous
  // (ou l'inverse), le prix du forfait s'applique automatiquement.
  // chip : raccourci affiché sous « Où allez-vous ? »
  routes: [
    { id: "nte",      group: "airport", label: "Nantes ↔ Aéroport Nantes Atlantique", price: 35,  place: "Aéroport Nantes Atlantique", lat: 47.1569, lon: -1.6080, r: 2.5, chip: "✈️ Aéroport" },
    { id: "gare",     group: "station", label: "Gare de Nantes ↔ Nantes et agglomération", price: 25, place: "Gare de Nantes, Nantes", lat: 47.2172, lon: -1.5420, r: 0.4, chip: "🚆 Gare" },
    { id: "stnaz",    group: "coast",   label: "Nantes ↔ Saint-Nazaire", price: 110, place: "Saint-Nazaire", lat: 47.2735, lon: -2.2138, r: 6 },
    { id: "labaule",  group: "coast",   label: "Nantes ↔ La Baule",      price: 130, place: "La Baule-Escoublac", lat: 47.2867, lon: -2.3910, r: 5, chip: "🏖️ La Baule" },
    { id: "pornic",   group: "coast",   label: "Nantes ↔ Pornic",        price: 100, place: "Pornic", lat: 47.1150, lon: -2.1030, r: 5 },
    { id: "puydufou", group: "tourism", label: "Nantes ↔ Puy du Fou",    price: 140, place: "Puy du Fou, Les Epesses", lat: 46.8899, lon: -0.9300, r: 3, chip: "🏰 Puy du Fou" },
    { id: "angers",   group: "city",    label: "Nantes ↔ Angers",        price: 150, place: "Angers", lat: 47.4784, lon: -0.5632, r: 7 },
    { id: "rennes",   group: "city",    label: "Nantes ↔ Rennes",        price: 190, place: "Rennes", lat: 48.1173, lon: -1.6778, r: 8 }
  ],

  // ---- Avis clients ------------------------------------------------------
  // Ajoutez ici de VRAIS avis (copiés depuis Google).
  // Exemple : { name: "Julie M.", text: "Chauffeur ponctuel et très agréable.", trip: "Aéroport" }
  reviews: []
};
