<template>
  <!-- v-card : carte Vuetify qui contient les infos d'une équipe -->
  <v-card hover :to="`/teams/${team.id}`">

    <!-- v-img : image du logo de l'équipe
         - :alt : texte alternatif (accessibilité / si l'image ne charge pas), ici le nom de l'équipe
         - ma-4 : marge de taille 4 tout autour de l'image
         - height="200" : hauteur fixe de 200px pour que toutes les cartes soient alignées
         - :src : URL complète de l'image, construite par la fonction getImageUrl -->
    <v-img
      :alt="team.name"
      class="ma-4"
      height="200"
      :src="getImageUrl(team.image)"
    />

    <!-- Titre de la carte : affiche le nom de l'équipe grâce à l'interpolation {{ }} -->
    <v-card-title>{{ team.name }}</v-card-title>

    <!-- Sous-titre de la carte : affiche la ligue et le pays de l'équipe -->
    <v-card-subtitle>
      {{ team.league }} : {{ team.country }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
// defineProps : déclare les données que le composant reçoit de son parent.
// Ici, le parent (index.vue) lui passe une équipe via :team="team".
// - type: Object   : la prop doit être un objet (une équipe de l'API)
// - required: true : Vue affiche un avertissement si on oublie de la passer
  defineProps({
    team: {
      type: Object,
      required: true,
    },
  })

  // Transforme le chemin d'image renvoyé par l'API (ex : "/images/sports/teams/1.webp")
  // en URL complète (ex : "https://apis.divtec.me/images/sports/teams/1.webp").
  // new URL(chemin, base) : comme le chemin commence par "/", il est ajouté
  // à la racine du domaine de l'API, et "/api/sports" est ignoré.
  function getImageUrl (image) {
    return new URL(image, import.meta.env.VITE_API_URL).href
  }
</script>
