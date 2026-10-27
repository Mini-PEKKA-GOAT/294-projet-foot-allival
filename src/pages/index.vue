<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Équipes sportives
    </h1>

    <!-- Grille responsive : 1 carte (mobile), 2 (tablette), 3 (moyen), 4 (grand écran) -->
    <v-row>
      <v-col
        v-for="team in teams"
        :key="team.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card>
          <v-img
            :alt="team.name"
            class="ma-4"
            height="200"
            :src="getImageUrl(team.image)"
          />

          <v-card-title>{{ team.name }}</v-card-title>

          <v-card-subtitle>
            {{ team.league }} : {{ team.country }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getImageUrl } from '@/utils/imageUrl'

  // Variable réactive : tableau vide au départ
  const teams = ref([])

  // Chargement des données une fois la page affichée
  onMounted(async () => {
    const response = await fetch('https://apis.divtec.me/api/sports/teams?limit=1000')
    const json = await response.json()
    // L'API renvoie { data: [...], pagination: {...} } : les équipes sont dans "data"
    teams.value = json.data
    console.log(teams.value)
  })
</script>
