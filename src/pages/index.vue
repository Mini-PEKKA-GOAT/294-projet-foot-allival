<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Footix
      <span class="text-subtitle-1">({{ teamStore.totalTeams }})</span>
    </h1>

    <!-- Barre de recherche -->
    <v-row class="mb-4">
      <!--
      Champ de recherche par nom
        * v-model lie la valeur au ref searchQuery (binding bidirectionnel)
        * clearable ajoute un bouton pour vider le champ
        * prepend-inner-icon ajoute une icône à l'intérieur du champ
      -->
      <v-col cols="12" md="4" sm="6">
        <v-text-field
          v-model="searchQuery"
          clearable
          density="compact"
          hide-details
          label="Rechercher une équipe"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
    </v-row>

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

    <!--
    Message si aucun résultat
      * v-else-if vérifie que la liste filtrée est vide
    -->
    <v-alert
      v-else-if="filteredBySearch.length === 0"
      class="mb-6"
      type="info"
      variant="tonal"
    >
      Aucune équipe ne correspond à votre recherche.
    </v-alert>

    <!--
    Grille de cartes des équipes
      * On itère sur filteredBySearch (et non teamStore.teams)
      * Ainsi la grille se met à jour automatiquement quand on tape dans le champ
    -->
    <v-row v-else>
      <v-col
        v-for="team in filteredBySearch"
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

  // Récupération du store des équipes
  const teamStore = useTeamStore()

  // URL de l'API pour le message d'erreur
  const apiUrl = import.meta.env.VITE_API_URL || 'https://apis.divtec.me/api/sports'

  // Variable réactive pour la recherche
  // ref() est auto-importé grâce à unplugin-auto-import
  const searchQuery = ref('')

  /**
   * Computed : filtre les équipes par nom
   * Se recalcule automatiquement quand searchQuery change
   * Ne modifie jamais les données du store (teamStore.teams reste intact)
   */
  const filteredBySearch = computed(() => {
    // Si le champ est vide, retourner toutes les équipes
    if (!searchQuery.value) return teamStore.teams

    // Convertir la recherche en minuscules pour une comparaison insensible à la casse
    const query = searchQuery.value.toLowerCase()

    // Filtrer : ne garder que les équipes dont le nom contient la recherche
    return teamStore.teams.filter(team =>
      team.name.toLowerCase().includes(query),
    )
  })
</script>
