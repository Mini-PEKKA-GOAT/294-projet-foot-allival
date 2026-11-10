<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Mes favoris ({{ pokemonStore.totalFavorites }})
    </h1>

    <!-- Message si aucun favori -->
    <v-alert
      v-if="pokemonStore.totalFavorites === 0"
      class="mb-6"
      type="info"
      variant="tonal"
    >
      Vous n'avez pas encore de Pokémon favoris.
      Cliquez sur le coeur d'un Pokémon pour l'ajouter !
    </v-alert>

    <!-- Grille de cartes Pokémon favoris -->
    <v-row v-else>
      <v-col
        v-for="pokemon in pokemonStore.getFavorites"
        :key="pokemon.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <pokemon-card :pokemon="pokemon" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import PokemonCard from '@/components/PokemonCard.vue'
  import { usePokemonStore } from '@/stores/pokemonStore'

  const pokemonStore = usePokemonStore()
</script>
