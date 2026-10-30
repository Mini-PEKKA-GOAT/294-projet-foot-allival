// Fonction utilitaire qui transforme le chemin d'image renvoyé par l'API
// (ex : "/images/sports/teams/1.webp") en URL complète
// (ex : "https://apis.divtec.me/images/sports/teams/1.webp").
//
// new URL(chemin, base) : comme le chemin commence par "/", il est ajouté
// à la racine du domaine de l'API, et "/api/sports" (contenu dans VITE_API_URL) est ignoré.
//
// Utilisée par la carte d'équipe (liste) et par la page de détail d'une équipe.
export function getImageUrl (image) {
  return new URL(image, import.meta.env.VITE_API_URL).href
}
