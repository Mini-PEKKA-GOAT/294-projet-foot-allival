<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Mes favoris ({{ teamStore.totalFavorites }})
    </h1>

    <!-- Message si aucun favori -->
    <v-alert
      v-if="teamStore.totalFavorites === 0"
      class="mb-6"
      type="info"
      variant="tonal"
    >
      Vous n'avez pas encore d'équipe favorite.
      Cliquez sur le coeur d'une équipe pour l'ajouter !
    </v-alert>

    <!-- Grille de cartes des équipes favorites -->
    <v-row v-else>
      <v-col
        v-for="team in teamStore.getFavorites"
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
</script>
