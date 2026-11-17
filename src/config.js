// Toutes les informations modifiables du faire-part sont regroupées ici.

import musique from './assets/musique.mp3.mpeg?url'

export const COUPLE = {
  bride: 'Marie Claire',
  groom: 'Narcisse',
  initials: ['N', 'M'],
}

// Date affichée sous la zone à gratter
export const DATE_LABEL = {
  short: '08 · 02 · 2027',
  long: 'Lundi 8 février 2027',
  place: "MAIRIE DE SEME-KPODJI",
}

// Cible du compte à rebours (heure d'accueil des invités, UTC+1)
export const EVENT_DATE = new Date('2027-02-08T14:30:00+01:00')

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
  url: 'https://forms.gle/ehemAYH7jTJvGBob7',
  deadline: '18 janvier 2027',
  label: 'Je confirme ma présence',
}

// Musique d'ambiance (fichier placé dans src/assets/)
export const MUSIC_SRC = musique
