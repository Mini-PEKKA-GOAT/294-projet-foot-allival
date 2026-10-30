<template>
  <!-- v-container : conteneur Vuetify qui centre le contenu et ajoute des marges latérales -->
  <v-container>

    <!-- Titre principal de la page
         - text-h3 : taille de texte prédéfinie par Vuetify (titre de niveau 3)
         - text-center : centre le texte horizontalement
         - my-6 : marge verticale (haut + bas) de taille 6 -->
    <h1 class="text-h3 text-center my-6">Footix</h1>

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

// storeToRefs : permet de récupérer les données du store sans perdre leur réactivité
  import { storeToRefs } from 'pinia'

  // Composant qui affiche la carte d'une équipe (src/components/TeamCard.vue)
  import TeamCard from '@/components/TeamCard.vue'

  // Store Pinia des équipes (src/stores/teamStore.js) : c'est lui qui charge les équipes depuis l'API
  import { useTeamStore } from '@/stores/teamStore'

  // Instancier le store
  const teamStore = useTeamStore()

  // Destructurer le state en gardant la réactivité
  // storeToRefs convertit chaque propriété du state en ref :
  // le template se met à jour automatiquement quand le store a fini de charger les équipes
  const { teams } = storeToRefs(teamStore)
</script>
