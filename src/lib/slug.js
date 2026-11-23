// Transforme une clé d'invité en morceau de lien propre :
// « Couple NOUEMOU » → « couple-nouemou », « Hélène » → « helene ».
export function slug(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
