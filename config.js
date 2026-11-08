/* =====================================================================
   CONFIGURATION AVM VTC — c'est le SEUL fichier à modifier.
   Changez vos coordonnées, vos prix et vos forfaits ici.
   ===================================================================== */
window.AVM_CONFIG = {
  // Numéro au format international, sans espaces ni "+" (ex : 33612345678)
  phone: "33600000000",
  // Numéro affiché sur le site
  phoneLabel: "06 00 00 00 00",
  // Ville / zone desservie
  city: "Paris & Île-de-France",
  // Numéro d'inscription au registre VTC (obligatoire)
  registre: "EVTC000000000",
  // Lien vers votre fiche Google pour laisser un avis
  googleReviewUrl: "https://www.google.com/maps",

  // Remise 1ʳᵉ réservation directe (0.10 = 10 %). Mettre 0 pour désactiver.
  firstBookingDiscount: 0.10,
  // Remise aller-retour
  roundTripDiscount: 0.05,

  // Tarification hors forfait
  pricing: {
    base: 10,        // prise en charge (€)
    perKm: 1.9,      // prix au km (€)
    minimum: 30,     // course minimum (€)
    perHour: 55,     // mise à disposition, par heure (€)
    minHours: 2
  },

  // Catégories de véhicule : coef appliqué au prix berline
  vehicles: [
    { id: "berline", label: "Berline", detail: "4 pers. · 3 valises", coef: 1 },
    { id: "van",     label: "Van",     detail: "7 pers. · 7 valises", coef: 1.35 },
    { id: "premium", label: "Premium", detail: "Classe affaires",     coef: 1.6 }
  ],

  // Forfaits à prix fixe (prix berline). "group" sert aux liens de la page.
  routes: [
    { id: "cdg",    group: "airport", label: "Paris ↔ Aéroport CDG",        price: 65 },
    { id: "orly",   group: "airport", label: "Paris ↔ Aéroport Orly",       price: 50 },
    { id: "bva",    group: "airport", label: "Paris ↔ Aéroport Beauvais",   price: 130 },
    { id: "cdgory", group: "airport", label: "CDG ↔ Orly",                  price: 85 },
    { id: "gare",   group: "station", label: "Gare ↔ Paris intra-muros",    price: 35 },
    { id: "disney", group: "other",   label: "Paris ↔ Disneyland",          price: 85 },
    { id: "vers",   group: "other",   label: "Paris ↔ Versailles",          price: 60 }
  ]
};
