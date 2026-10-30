<template>
  <v-app>
    <app-header />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />
  </v-app>
</template>

<script setup>
  import AppFooter from '@/components/AppFooter.vue'
  // Imports des composants de layout
  import AppHeader from '@/components/AppHeader.vue'

  // Import du store des équipes
  import { useTeamStore } from '@/stores/teamStore'

  // Initialisation du store au montage de l'application
  // onMounted est auto-importé grâce à unplugin-auto-import
  onMounted(async () => {
    const teamStore = useTeamStore()
    // init() charge les équipes et les ligues en parallèle
    await teamStore.init()
  })
</script>
