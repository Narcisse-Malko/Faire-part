// Toutes les informations modifiables du faire-part sont regroupées ici.

import musique from './assets/musique.mp3.mpeg?url'

export const COUPLE = {
  bride: 'Marie-Claire',
  groom: 'Narcisse',
  brideLastName: 'ADJAGNISSODE',
  groomLastName: "N'OUEMOU",
  initials: ['N', 'M'],
}

// Date affichée sous la zone à gratter
export const DATE_LABEL = {
  short: '04 · 02 · 2027',
  long: 'Jeudi 4 février 2027',
  place: "ARRONDISSEMENT D'AGBLANGANDAN",
}

// Cible du compte à rebours (heure d'accueil des invités, UTC+1)
export const EVENT_DATE = new Date('2027-02-04T14:30:00+01:00')

// Programme de la journée. `icon` correspond à une clé de components/Icons.jsx
export const PROGRAM = [
  { time: '14h30', title: 'Accueil des invités', icon: 'welcome' },
  { time: '15h00', title: 'Cérémonie civile', icon: 'rings' },
  { time: '15h45', title: 'Séance photo', icon: 'camera' },
  { time: '17h00', title: 'Cocktail', icon: 'glasses' },
  { time: '19h30', title: 'Départ des mariés', icon: 'car' },
]

// Confirmation de présence (RSVP)
// `url` : lien vers votre formulaire (Google Forms, Tally, etc.)
//   ou vers WhatsApp, par exemple https://wa.me/22900000000?text=Je%20serai%20pr%C3%A9sent
// `deadline` : date limite de réponse affichée aux invités, ou null pour ne rien afficher
export const RSVP = {
  // Adresse de l'application Web Google Apps Script (voir apps-script/README.md).
  // Tant qu'elle est vide, le bouton renvoie vers le formulaire Google ci-dessous.
  endpoint: 'https://script.google.com/macros/s/AKfycbyrrb_K1ReCASug1KgH7WN2MyWXkDIvzOTQ0G2gRsduzjlDyrpHzFOApzvVrsFT_upO/exec',
  url: 'https://forms.gle/ehemAYH7jTJvGBob7',
  deadline: '18 janvier 2027',
  label: 'Je confirme ma présence',
  // Mot affiché sous la confirmation de présence (laisser vide pour le masquer)
  giftNote: '« Votre présence est notre plus beau cadeau. Si vous souhaitez malgré tout nous faire plaisir, une petite enveloppe nous aidera dans nos projets de jeunes mariés. »',
}

// Invités : chaque invité reçoit son propre lien, par exemple …/Faire-part/?i=famille-dossou
// La clé est ce qui suit `?i=` dans le lien (minuscules, sans accents ni espaces).
// La valeur est le nom affiché, ou un objet { name, salutation } pour choisir
// la formule d'appel (« Cher », « Chère », « Chers »…).
// Par défaut : « Chère » pour Famille/Madame/Mme/Mlle, « Chers » si le nom
// contient « et » ou « & », sinon « Cher ».
// Un lien dont la clé n'est pas dans la liste affiche le faire-part générique.
export const GUESTS = {
  // Liste de test, à remplacer par les vrais invités
  'test-famille': 'Famille Test',            // → « Chère Famille Test »
  'test-couple': 'Jean et Awa Test',         // → « Chers Jean et Awa Test »
  'test-madame': 'Madame Test',              // → « Chère Madame Test »
  'test-monsieur': 'Koffi Test',             // → « Cher Koffi Test »
  'sidikatou': { name: 'Sidikatou', salutation: 'Chère' },
  'Madame Marie-Sabine ADJAGNISSODE': { name: 'Marie-Sabine ADJAGNISSODE', salutation: 'Chère' },
  'Couple NOUEMOU': { name: 'Emmanuel NOUEMOU et Félicité CHABI', salutation: 'Chers' },
  'Couple CODO': { name: 'Johnny CODO et Juanita NOUEMOU', salutation: 'Chers' },
  'Madame NOUEMOU': { name: 'CHODATON Iphigénie épouse NOUEMOU', salutation: 'Chère' },
  'madame-aliane': { name: 'Madame Aliane BEÏDO', salutation: 'Chère' },
  'abbe-loic': { name: 'Abbé Loïc Marcel AGLIGAN', salutation: 'Cher' },
  'test-amie': { name: 'Aïcha Test', salutation: 'Chère' }, // formule forcée
}

// Dress code : texte de la section et suggestions sous chaque silhouette
export const DRESS_CODE = {
  title: 'Tout de blanc vêtus',
  text: 'Pour célébrer notre union, nous vous invitons à vous habiller en blanc.',
  women: 'Robe, ensemble ou pagne blanc',
  men: 'Costume, boubou ou chemise blanche',
  shades: ['Blanc', 'Ivoire', 'Crème'],
}

// Musique d'ambiance (fichier placé dans src/assets/)
export const MUSIC_SRC = musique
