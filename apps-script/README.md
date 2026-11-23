# Confirmations de présence

Les réponses des invités arrivent dans la feuille Google
**Mariage – Confirmations de présence** :
https://docs.google.com/spreadsheets/d/1tQ1rClNL1xG7f8rty1my779-DuorSv6_obKhO_Q4r_g/edit

## Installation (une seule fois, environ 5 minutes)

1. Ouvrir la feuille ci-dessus, puis **Extensions → Apps Script**.
2. Effacer le contenu de `Code.gs` et coller celui de [Code.gs](Code.gs).
3. Cliquer sur **Enregistrer** (icône disquette).
4. **Déployer → Nouveau déploiement** → roue dentée → **Application Web**.
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
5. Cliquer sur **Déployer**, puis autoriser l'accès avec votre compte Google
   (Google affiche « application non validée » : *Paramètres avancés → Accéder au projet*).
6. Copier l'**URL de l'application Web** (elle finit par `/exec`) et la coller dans
   `RSVP.endpoint` de [src/config.js](../src/config.js).

## Fonctionnement

- Une ligne par personne : date, clé du lien, nom, « Présent » ou « Absent ».
- Invitation à plusieurs (couple…) : chaque personne répond pour elle-même et a sa
  propre ligne, avec une clé de la forme `couple-nouemou/emmanuel-nouemou`.
  Les personnes sont lues dans le nom de l'invitation (de part et d'autre de « et »),
  ou dans `people: ['…', '…']` si on l'indique dans `GUESTS` (src/config.js).
- Si un invité nominatif change sa réponse, sa ligne est mise à jour (pas de doublon).
- Un visiteur arrivé par le lien général tape son nom ; chaque envoi ajoute une ligne.
- Pour compter les présents : filtrer la colonne **Réponse** sur « Présent »,
  ou écrire `=NB.SI(D:D;"Présent")` dans une cellule libre.

Si vous modifiez `Code.gs` plus tard : **Déployer → Gérer les déploiements → Modifier →
Nouvelle version**, pour garder la même URL.
