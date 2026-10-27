<template>
  <!-- v-container : conteneur Vuetify qui centre le contenu et ajoute des marges latérales -->
  <v-container>

    <!-- Titre principal de la page
         - text-h3 : taille de texte prédéfinie par Vuetify (titre de niveau 3)
         - text-center : centre le texte horizontalement
         - my-6 : marge verticale (haut + bas) de taille 6 -->
    <h1 class="text-h3 text-center my-6">Équipes sportives</h1>

    <!-- v-row : ligne de la grille Vuetify (basée sur 12 colonnes) -->
    <v-row>
      <!-- v-col : une colonne par équipe
           - v-for : répète cette colonne pour chaque équipe du tableau "teams"
           - :key : identifiant unique obligatoire pour que Vue suive chaque élément de la liste
           - cols="12" : sur mobile, la carte prend 12/12 → 1 carte par ligne
           - sm="6"    : dès les petits écrans (tablette), 6/12 → 2 cartes par ligne
           - md="4"    : dès les écrans moyens, 4/12 → 3 cartes par ligne
           - lg="3"    : dès les grands écrans, 3/12 → 4 cartes par ligne -->
      <v-col
        v-for="team in teams"
        :key="team.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <!-- team-card : composant TeamCard.vue qui affiche la carte d'une équipe
             - :team="team" : passe l'équipe actuelle de la boucle à la prop "team" du composant -->
        <team-card :team="team" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// <script setup> : syntaxe simplifiée de la Composition API de Vue 3.
// Tout ce qui est déclaré ici (variables, imports) est directement utilisable dans le template.

// onMounted : hook de cycle de vie, exécute du code une fois le composant affiché dans le DOM
// ref : crée une variable réactive (le template se met à jour automatiquement quand elle change)
  import { onMounted, ref } from 'vue'

  // Composant qui affiche la carte d'une équipe (src/components/TeamCard.vue)
  import TeamCard from '@/components/TeamCard.vue'

  // Tableau réactif qui contiendra la liste des équipes.
  // Il est vide au départ : rien ne s'affiche tant que les données ne sont pas chargées.
  const teams = ref([])

  // Au montage du composant, on va chercher les équipes sur l'API.
  // La fonction est "async" pour pouvoir utiliser "await" (attendre la réponse du serveur).
  onMounted(async () => {
    // Requête HTTP GET vers l'API :
    // - limit=100     : récupère jusqu'à 100 équipes
    // - sport=Soccer  : filtre uniquement les équipes de football
    const response = await fetch('https://apis.divtec.me/api/sports/teams?limit=100&sport=Soccer')

    // Convertit la réponse brute (texte) en objet JavaScript
    const json = await response.json()

    // L'API renvoie un objet de la forme { data: [...], pagination: {...} }.
    // Les équipes se trouvent dans "data", donc on les stocke dans notre variable réactive.
    // ⚠️ Avec ref, on doit passer par ".value" pour lire ou modifier la valeur dans le script.
    teams.value = json.data
  })
</script>
