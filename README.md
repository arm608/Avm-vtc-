# AVM VTC – Site du chauffeur privé à Nantes

Site statique professionnel (HTML/CSS/JS, aucun serveur ni abonnement nécessaire).

## Pages
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : devis immédiat, services, forfaits, véhicule, entreprises, fidélité, avis, zones desservies, FAQ |
| `vtc-aeroport-nantes.html` | Page Google « VTC aéroport Nantes » |
| `vtc-gare-nantes.html` | Page Google « VTC gare de Nantes » |
| `mentions-legales.html` | Mentions légales (obligatoires) |

## Ce qui fait venir des clients et augmente le chiffre d'affaires
- **Devis immédiat** : forfaits fixes, trajet sur mesure au km, mise à disposition à l'heure, berline / van / premium, aller-retour.
- **Réservation WhatsApp en 1 clic** : vous recevez trajet, date, heure, véhicule, prix et prénom déjà rédigés.
- **Boutons Appeler / WhatsApp** toujours visibles sur mobile.
- **Référencement local Nantes** : pages dédiées aéroport et gare, données structurées Google (TaxiService + FAQ), communes desservies, `sitemap.xml`.
- **Montée en gamme** : van, premium, offre entreprises, commission pour hôtels/conciergeries, fidélité et parrainage.

## À personnaliser AVANT la mise en ligne
1. **`config.js`** : téléphone, e-mail, n° registre VTC, lien avis Google, prix, forfaits, et **vos vrais avis clients** (`reviews`).
2. **Photo de votre véhicule** : déposez-la sous `images/vehicule.jpg` (format paysage). Sinon une illustration s'affiche.
3. **Nom de domaine** : remplacez `https://www.avm-vtc.fr` dans `index.html`, les 2 pages, `sitemap.xml` et `robots.txt`.
4. **Téléphone dans les données Google** : `"telephone"` dans le bloc `ld+json` de `index.html`.
5. **`mentions-legales.html`** : SIRET, adresse, hébergeur.

Les pages aéroport et gare ont été générées à partir de l'en-tête et du pied de page de `index.html` : si vous modifiez le menu, modifiez-le dans les 3 fichiers.

## Mise en ligne
- **Netlify** (le plus simple) : glisser-déposer le dossier sur app.netlify.com/drop, puis brancher votre nom de domaine.
- ou **GitHub Pages** : Settings → Pages → branche `main`.
- Ensuite : déclarer le site dans **Google Search Console** (envoyer `sitemap.xml`) et ajouter le lien sur votre **fiche Google Business Profile**.
