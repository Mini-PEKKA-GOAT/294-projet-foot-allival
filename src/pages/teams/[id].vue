<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="$router.back()"
    >
      Retour
    </v-btn>

    <v-alert
      v-if="!team"
      type="error"
      variant="tonal"
    >
      Équipe non trouvée.
    </v-alert>

    <v-card
      v-else
      class="mx-auto"
      max-width="800"
    >
      <v-img
        :alt="team.name"
        height="300"
        :src="getImageUrl(team.image)"
      />

      <v-card-title class="text-h4">
        {{ team.name }}
      </v-card-title>

      <v-card-subtitle>
        {{ team.league }} : {{ team.country }}
      </v-card-subtitle>

      <v-card-text>
        <p v-if="team.description" class="text-body-1 mb-4">
          {{ team.description }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  // Import du store des équipes
  import { useTeamStore } from '@/stores/teamStore'
  import { getImageUrl } from '@/utils/imageUrl'

  // Récupérer l'ID depuis les paramètres de la route
  const route = useRoute()

  // Instancier le store
  const teamStore = useTeamStore()

  // Utiliser le getter du store pour trouver l'équipe
  // computed se met à jour automatiquement si l'ID change
  const team = computed(() => {
    return teamStore.getTeamById(route.params.id)
  })
</script>
