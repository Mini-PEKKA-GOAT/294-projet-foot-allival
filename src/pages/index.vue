<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Footix
      <span class="text-subtitle-1">({{ teamStore.totalTeams }})</span>
    </h1>

    <!-- État 1 : Loading — squelettes de chargement -->
    <v-row v-if="teamStore.isLoading">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-skeleton-loader
          height="350"
          type="image, article"
        />
      </v-col>
    </v-row>

    <!-- État 2 : Error — alerte si aucune équipe chargée -->
    <v-alert
      v-else-if="teamStore.teams.length === 0"
      class="mb-6"
      type="error"
      variant="tonal"
    >
      Impossible de charger les équipes. Vérifiez que l'API est accessible sur
      {{ apiUrl }}.
    </v-alert>

    <!-- État 3 : Data — grille de cartes des équipes -->
    <v-row v-else>
      <v-col
        v-for="team in teamStore.teams"
        :key="team.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <team-card :team="team" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import TeamCard from '@/components/TeamCard.vue'
  import { useTeamStore } from '@/stores/teamStore'

  const teamStore = useTeamStore()

  // URL de l'API pour le message d'erreur
  const apiUrl = import.meta.env.VITE_API_URL || 'https://apis.divtec.me/api/sports'
</script>
