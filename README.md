# AVM VTC – Site vitrine & réservation

Site statique (HTML/CSS/JS, aucun serveur nécessaire) pour une activité de chauffeur VTC.

## Ce que fait le site
- **Devis immédiat** : prix calculé en direct (forfaits, trajet sur mesure au km, mise à disposition à l'heure, berline / van / premium, aller-retour).
- **Réservation en 1 clic sur WhatsApp** : le message est pré-rempli avec trajet, date, heure, véhicule et prix.
- **Bouton Appeler / WhatsApp fixe** en bas de l'écran sur mobile.
- Sections : avantages de la réservation directe, services, grille de forfaits, compte entreprise & partenaires (hôtels), fidélité / parrainage, avis, FAQ.
- Référencement local (balises meta + données structurées schema.org).

## À personnaliser avant la mise en ligne
1. **`config.js`** : téléphone, ville, n° registre VTC, lien avis Google, prix au km, forfaits, remises.
2. **`index.html`** : bloc `application/ld+json` (téléphone, zone) et les **avis clients** (remplacer les exemples par de vrais avis).
3. **`mentions-legales.html`** : SIRET, adresse, hébergeur.

## Mise en ligne gratuite
- **GitHub Pages** : Settings → Pages → Branch `main` / root.
- ou **Netlify** : glisser-déposer le dossier sur app.netlify.com/drop.

Tester en local : ouvrir `index.html` dans un navigateur.
