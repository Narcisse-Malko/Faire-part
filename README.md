# Faire-part de mariage · Narcisse & Marie Claire

Application web mobile-first en React 19, Vite et Tailwind CSS 4.

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm run build    # génère dist/index.html, un fichier unique prêt à héberger
```

## Modifier le contenu

Tout se trouve dans `src/config.js` : prénoms, initiales du sceau, date affichée,
date cible du compte à rebours, programme de la journée et musique.

## Musique d'ambiance

Par défaut, une mélodie douce est générée par le navigateur (Web Audio API), sans fichier.
Pour utiliser votre propre morceau, déposez-le dans `src/assets/` puis, dans `src/config.js` :

```js
import musique from './assets/musique.mp3'
export const MUSIC_SRC = musique
```

La musique démarre au premier geste de l'invité (ouverture de l'enveloppe),
car les navigateurs bloquent toute lecture automatique avant une interaction.
Le bouton rond en bas à droite permet de la couper.

## Structure

- `components/Envelope.jsx` : écran d'accueil, enveloppe et animation d'ouverture
- `components/WaxSeal.jsx` : cachet de cire N&M en SVG
- `components/FloralArch.jsx` : arche florale reposant sur deux tours Tata
- `components/ScratchDate.jsx` : carte à gratter en canvas
- `components/Timeline.jsx` et `Icons.jsx` : programme de la journée
- `components/Countdown.jsx` : compte à rebours
- `components/AudioPlayer.jsx` et `lib/ambient.js` : lecteur audio
- `components/Tata.jsx` : motifs architecturaux Tata somba (tours, frises, séparateurs)
