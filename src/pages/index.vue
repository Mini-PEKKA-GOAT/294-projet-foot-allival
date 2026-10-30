<template>
  <!-- Conteneur principal — centre le contenu et limite la largeur -->
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Footix
      <span class="text-subtitle-1">({{ teamStore.totalTeams }})</span>
    </h1>

    <!--
    Barre de recherche, filtre et tri
      * v-row avec 3 colonnes pour les contrôles
    -->
    <v-row class="mb-4">
      <!--
      Champ de recherche par nom
        * v-model lie la valeur au ref searchQuery
        * clearable ajoute un bouton pour vider le champ
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

      <!--
      Filtre par ligue
        * v-select affiche un menu déroulant avec les ligues disponibles
        * :items utilise la liste des ligues présentes dans les équipes chargées
      -->
      <v-col cols="12" md="4" sm="6">
        <v-select
          v-model="selectedLeague"
          clearable
          density="compact"
          hide-details
          :items="leagues"
          label="Filtrer par ligue"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
        />
      </v-col>

      <!--
      Bouton de tri
        * Alterne entre tri ascendant (A→Z) et descendant (Z→A)
        * L'icône change selon l'ordre actuel
      -->
      <v-col class="d-flex align-center" cols="12" md="4">
        <v-btn
          :prepend-icon="sortOrder === 'asc'
            ? 'mdi-sort-alphabetical-ascending'
            : 'mdi-sort-alphabetical-descending'"
          variant="outlined"
          @click="toggleSort"
        >
          Tri {{ sortOrder === 'asc' ? 'A → Z' : 'Z → A' }}
        </v-btn>
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
      * Affiché si la recherche ou le filtre ne donne aucun résultat
    -->
    <v-alert
      v-else-if="sortedTeams.length === 0"
      class="mb-6"
      type="info"
      variant="tonal"
    >
      Aucune équipe ne correspond à votre recherche.
    </v-alert>

    <!--
    Grille de cartes des équipes
      * On itère sur sortedTeams (le dernier computed de la chaîne)
    -->
    <v-row v-else>
      <v-col
        v-for="team in sortedTeams"
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

  /**
   * Variables réactives pour la recherche, le filtre et le tri
   * ref() est auto-importé grâce à unplugin-auto-import
   */
  const searchQuery = ref('')
  const selectedLeague = ref(null)
  const sortOrder = ref('asc')

  /**
   * Liste des ligues pour le menu déroulant
   * On récupère la ligue de chaque équipe, Set supprime les doublons,
   * puis on trie par ordre alphabétique
   */
  const leagues = computed(() => {
    return [...new Set(teamStore.teams.map(team => team.league))]
      .toSorted((a, b) => a.localeCompare(b, 'fr'))
  })

  /**
   * COMPUTED CHAÎNÉS : Chaque étape filtre ou transforme le résultat de la précédente
   * teams → filteredByLeague → filteredBySearch → sortedTeams
   */

  /**
   * Étape 1 : Filtrer par ligue
   * Si une ligue est sélectionnée, ne garder que les équipes de cette ligue
   */
  const filteredByLeague = computed(() => {
    if (!selectedLeague.value) return teamStore.teams
    return teamStore.teams.filter(team =>
      team.league === selectedLeague.value,
    )
  })

  /**
   * Étape 2 : Filtrer par recherche
   * Utilise filteredByLeague comme source (chaînage)
   * La recherche est insensible à la casse (toLowerCase)
   */
  const filteredBySearch = computed(() => {
    if (!searchQuery.value) return filteredByLeague.value
    const query = searchQuery.value.toLowerCase()
    return filteredByLeague.value.filter(team =>
      team.name.toLowerCase().includes(query),
    )
  })

  /**
   * Étape 3 : Trier par nom
   * toSorted() renvoie une copie triée sans modifier le tableau filtré
   * localeCompare('fr') gère les accents français
   */
  const sortedTeams = computed(() => {
    return filteredBySearch.value.toSorted((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'fr')
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  /**
   * Inverse l'ordre de tri entre ascendant et descendant
   */
  function toggleSort () {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
</script>
