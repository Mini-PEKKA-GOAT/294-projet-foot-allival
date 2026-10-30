<template>
  <v-container>
    <!-- Bouton pour revenir à la page précédente (la liste des équipes) -->
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="$router.back()"
    >
      Retour
    </v-btn>

    <!-- Message d'erreur si aucune équipe ne correspond à l'ID de l'URL -->
    <v-alert
      v-if="!team"
      type="error"
      variant="tonal"
    >
      Équipe non trouvée.
    </v-alert>

    <!-- Carte de détail de l'équipe (affichée seulement si l'équipe existe) -->
    <v-card
      v-else
      class="mx-auto"
      max-width="800"
    >
      <!-- Logo de l'équipe, URL construite par getImageUrl -->
      <v-img
        :alt="team.name"
        height="300"
        :src="getImageUrl(team.image)"
      />

      <!-- Nom de l'équipe -->
      <v-card-title class="text-h4">
        {{ team.name }}
      </v-card-title>

      <!-- Ligue et pays -->
      <v-card-subtitle>
        {{ team.league }} : {{ team.country }}
      </v-card-subtitle>

      <v-card-text>
        <!-- Description de l'équipe (si l'API en fournit une) -->
        <p v-if="team.description" class="text-body-1 mb-4">
          {{ team.description }}
        </p>

        <!-- Affiche automatiquement tous les autres champs renvoyés par l'API -->
        <v-list v-if="details.length > 0" density="compact">
          <v-list-item
            v-for="detail in details"
            :key="detail.key"
            :subtitle="detail.label"
            :title="detail.value"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
// Import du store des équipes
  import { useTeamStore } from '@/stores/teamStore'
  // Fonction utilitaire qui transforme le chemin d'une image en URL complète
  import { getImageUrl } from '@/utils/imageUrl'

  // Récupérer l'ID depuis les paramètres de la route (ex : /teams/1 → id = "1")
  const route = useRoute()

  // Instancier le store
  const teamStore = useTeamStore()

  // Utiliser le getter du store pour trouver l'équipe
  // computed se met à jour automatiquement si l'ID change
  const team = computed(() => {
    return teamStore.getTeamById(route.params.id)
  })

  // Champs déjà affichés ailleurs dans la carte
  const HIDDEN_KEYS = new Set([
    'id', 'name', 'description', 'image',
    'league', 'country', 'created_at', 'updated_at',
  ])

  // Tous les autres champs de l'équipe (abréviation, stade, année de création, etc.)
  const details = computed(() => {
    if (!team.value) return []
    return Object.entries(team.value)
      .filter(([key, value]) =>
        !HIDDEN_KEYS.has(key)
        && value !== null && value !== ''
        && typeof value !== 'object',
      )
      .map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' '),
        value: String(value),
      }))
  })
</script>
