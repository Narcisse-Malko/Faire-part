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
  // Lien Google Maps du lieu. Pour le lien exact : ouvrir Google Maps, toucher
  // le lieu, « Partager » → « Copier le lien », puis coller ici à la place.
  mapUrl: 'https://maps.app.goo.gl/4sp9aLV9Pqvf6quU7',
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

// Accès au faire-part : un seul lien, le lien général, à envoyer à tous les invités :
//   https://narcisse-malko.github.io/Faire-part/?i=invites-6cd948bf
// L'invité tape son nom ; s'il figure dans GUESTS ci-dessous, son invitation s'ouvre.
// Tout autre lien affiche « lien non valide ». Changer `generalCode` change le lien.
export const LINKS = {
  generalCode: 'invites-6cd948bf',
}

// Invités : la clé identifie l'invitation (et sa ligne dans la feuille Google) ;
// ne pas la changer une fois que l'invité a répondu.
// La valeur est le nom affiché, ou un objet { name, salutation } pour choisir
// la formule d'appel (« Cher », « Chère », « Chers »…).
// Par défaut : « Chère » pour Famille/Madame/Mme/Mlle, « Chers » si le nom
// contient « et » ou « & », sinon « Cher ».
export const GUESTS = {
  'Madame Marie-Sabine ADJAGNISSODE': { name: 'Marie-Sabine ADJAGNISSODE', salutation: 'Chère' },
  'madame-marie-ornellie': { name: 'Marie-Ornellie ADJAGNISSODE', salutation: 'Chère' },
  'couple-nouemou': { name: 'Emmanuel NOUEMOU et Félicité CHABI', salutation: 'Chers' },
  'couple-montcho': { name: 'Eugène Montcho  et Josiane Montcho', salutation: 'Chers' },
  'couple-gbovi': { name: 'Marc GBOVI et Leiseil GBOVI', salutation: 'Chers' },
  'couple-adjagnissode': { name: 'Marcel ADJAGNISSODE et Saadatou LAWANI', salutation: 'Chers' },
  'couple-toudonou': { name: 'Henoc TOUDONOU et Marie-Marcelle ADJAGNISSODE', salutation: 'Chers' },
  'couple-hounvio': { name: 'Fréjus HOUNVIO et Aimée HOUNVIO', salutation: 'Chers' },
  'couple-codo': { name: 'Johnny CODO et Juanita NOUEMOU', salutation: 'Chers' },
  'madame-nouemou': { name: 'CHODATON Iphigénie épouse NOUEMOU', salutation: 'Chère' },
  'madame-aliane': { name: 'Aliane BEÏDO', salutation: 'Chère' },
  'madame-lepajollec': { name: 'Elisabeth LEPAJOLLEC', salutation: 'Chère' },
  'monsieur-gasset': {name: 'Valentin GASSET', salutation: 'Cher'},
  'couple-nouveau': { name: 'Narcisse NOUEMOU et Sidikatou ADJAGNISSODE', salutation: 'Chers' },
  'madame-lidwine': { name: 'Lidwine QUENUM', salutation: 'Chère' },
  'monsieur-diouf': {name: 'Léopold Khekhane DIOUF', salutation: 'Cher'},
  'abbe-loic': { name: 'Abbé Loïc Marcel AGLIGAN', salutation: 'Cher' },
  'abbe-providence': { name: 'Abbé Providence GBEHOUN', salutation: 'Cher' },
  'abbe-gilles': { name: 'Abbé Gilles HOUENOU', salutation: 'Cher' },
  'abbe-alexandre': { name: 'Abbé Alexandre HOUNTANGNI', salutation: 'Cher' },
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
