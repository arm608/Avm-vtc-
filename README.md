# AVM VTC – Site du chauffeur privé à Nantes

Site statique professionnel (HTML/CSS/JS, aucun serveur ni abonnement nécessaire).

## Pages
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil façon appli : carte, « Où allez-vous ? », prix par véhicule, réservation WhatsApp en 1 bouton |
| `vtc-aeroport-nantes.html` | Page Google « VTC aéroport Nantes » |
| `vtc-gare-nantes.html` | Page Google « VTC gare de Nantes » |
| `mentions-legales.html` | Mentions légales (obligatoires) |

## Application installable (PWA)
Une fois le site en ligne (en **https**), les clients peuvent l'installer sur leur téléphone comme une appli :
- **iPhone** : Safari → Partager → « Sur l'écran d'accueil »
- **Android** : Chrome → bouton « Installer l'application » (affiché automatiquement sur le site)

Fichiers concernés : `manifest.webmanifest`, `sw.js`, `assets/icon-192.png`, `assets/icon-512.png`.
Après une modification du site, changez `VERSION` dans `sw.js` pour que les téléphones récupèrent la nouvelle version.

## Carte et recherche d'adresses
Services gratuits, appelés directement depuis le navigateur du client (aucune clé nécessaire) :
- fonds de carte CARTO / OpenStreetMap, bibliothèque Leaflet (incluse dans `assets/vendor/leaflet`)
- suggestions d'adresses : Photon (photon.komoot.io)
- distance et durée : OSRM (router.project-osrm.org)

Si l'un de ces services ne répond pas, le site calcule quand même un prix estimé (distance à vol d'oiseau × 1,3) et la réservation fonctionne. Les forfaits (aéroport, La Baule…) sont détectés automatiquement d'après les adresses.
Si le site devient très fréquenté, passez à un service payant (Google Maps, Mapbox) pour la fiabilité.

## Ce qui fait venir des clients et augmente le chiffre d'affaires
- **Devis immédiat** : forfaits fixes, trajet sur mesure au km, mise à disposition à l'heure, berline / van / premium, aller-retour.
- **Réservation WhatsApp en 1 clic** : vous recevez trajet, date, heure, véhicule, prix et prénom déjà rédigés.
- **Boutons Appeler / WhatsApp** toujours visibles sur mobile.
- **Référencement local Nantes** : pages dédiées aéroport et gare, données structurées Google (TaxiService + FAQ), communes desservies, `sitemap.xml`.
- **Montée en gamme** : van, premium, offre entreprises, commission pour hôtels/conciergeries, fidélité et parrainage.

## À personnaliser AVANT la mise en ligne
1. **`config.js`** : e-mail, n° registre VTC, lien avis Google, prix, forfaits, et **vos vrais avis clients** (`reviews`).
2. **Photo de votre véhicule** : déposez-la sous `images/vehicule.jpg` (format paysage). Sinon une illustration s'affiche.
3. **Nom de domaine** : remplacez `https://www.avm-vtc.fr` dans `index.html`, les 2 pages, `sitemap.xml` et `robots.txt`.
4. **`mentions-legales.html`** : SIRET, adresse, hébergeur.

Les pages aéroport et gare ont été générées à partir de l'en-tête et du pied de page de `index.html` : si vous modifiez le menu, modifiez-le dans les 3 fichiers.

## Mise en ligne
- **Netlify** (le plus simple) : glisser-déposer le dossier sur app.netlify.com/drop, puis brancher votre nom de domaine.
- ou **GitHub Pages** : Settings → Pages → branche `main`.
- Ensuite : déclarer le site dans **Google Search Console** (envoyer `sitemap.xml`) et ajouter le lien sur votre **fiche Google Business Profile**.
