<template>
  <!--
  Carte d'une équipe
    * :to crée un lien vers la page de détail de l'équipe
    * hover ajoute un effet d'élévation au survol
  -->
  <v-card
    class="team-card"
    hover
    :to="`/teams/${team.id}`"
  >
    <!--
    Logo de l'équipe
      * :src construit l'URL complète de l'image avec getImageUrl
      * ma-4 ajoute une marge tout autour du logo
      * height="200" fixe la hauteur de l'image pour que toutes les cartes soient alignées
    -->
    <v-img
      :alt="team.name"
      class="ma-4"
      height="200"
      :src="getImageUrl(team.image)"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-4"
            indeterminate
          />
        </div>
      </template>
    </v-img>

    <!-- Nom de l'équipe -->
    <v-card-title>{{ team.name }}</v-card-title>

    <!-- Ligue et pays de l'équipe -->
    <v-card-subtitle>{{ team.league }} : {{ team.country }}</v-card-subtitle>

    <!--
    Actions de la carte
      * v-spacer pousse le bouton à droite
      * Le bouton coeur toggle le favori
    -->
    <v-card-actions>
      <v-spacer />
      <!--
      Bouton pour ajouter/retirer des favoris
        * @click.stop.prevent empêche la navigation vers la page de détail
        * .stop arrête la propagation de l'événement (ne remonte pas à v-card)
        * .prevent empêche le comportement par défaut du router-link
        * L'icône change selon l'état favori (coeur plein ou vide)
        * La couleur change : rouge si favori, grise sinon
      -->
      <v-btn
        :color="teamStore.isFavorite(team) ? 'red' : ''"
        :icon="teamStore.isFavorite(team) ? 'mdi-heart' : 'mdi-heart-outline'"
        variant="text"
        @click.stop.prevent="handleToggleFavorite()"
      />
    </v-card-actions>

    <!--
    Snackbar de confirmation
      * v-model contrôle l'affichage
      * timeout="2000" masque automatiquement après 2 secondes
      * Le message change selon l'action (ajout ou retrait)
    -->
    <v-snackbar
      v-model="showSnackbar"
      color="primary"
      :timeout="2000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
  import { useTeamStore } from '@/stores/teamStore'
  import { getImageUrl } from '@/utils/imageUrl'

  /**
   * Props du composant TeamCard
   * @property {Object} team - Objet équipe avec id, name, image, league, country, etc.
   */
  const { team } = defineProps({
    team: {
      type: Object,
      required: true,
    },
  })

  const teamStore = useTeamStore()

  // Snackbar de confirmation
  const showSnackbar = ref(false)
  const snackbarMessage = ref('')

  /**
   * Toggle le favori et affiche un snackbar de confirmation
   */
  function handleToggleFavorite () {
    const wasFavorite = teamStore.isFavorite(team)
    teamStore.toggleFavorite(team)
    snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
    showSnackbar.value = true
  }
</script>
