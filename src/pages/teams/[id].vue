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
        v-if="logo"
        :alt="teamName"
        class="bg-grey-lighten-4"
        contain
        height="300"
        :src="logo"
      />

      <v-card-title class="text-h4">
        {{ teamName }}
      </v-card-title>

      <v-card-subtitle v-if="leagueName">
        {{ leagueName }}
      </v-card-subtitle>

      <v-card-text>
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
  import { getImageUrl } from '@/utils/imageUrl'

  const API_URL = 'https://apis.divtec.me/api/sports'

  const route = useRoute()

  const team = ref(null)

  // Champs déjà affichés ailleurs dans la carte
  const HIDDEN_KEYS = new Set([
    'id', 'name', 'nom', 'description',
    'logo', 'img', 'image', 'logo_url', 'image_url',
    'league', 'league_id', 'created_at', 'updated_at',
  ])

  const teamName = computed(() => team.value?.name ?? team.value?.nom ?? 'Équipe')

  const logo = computed(() => {
    const t = team.value
    const src = t?.logo ?? t?.logo_url ?? t?.img ?? t?.image ?? t?.image_url
    if (!src) return null
    // URL complète renvoyée par l'API : on l'utilise telle quelle
    return src.startsWith('http') ? src : getImageUrl(src)
  })

  const leagueName = computed(() => {
    const league = team.value?.league
    if (league && typeof league === 'object') return league.name ?? league.nom
    return typeof league === 'string' ? league : null
  })

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

  onMounted(async () => {
    const response = await fetch(`${API_URL}/teams/${route.params.id}`)
    if (!response.ok) return
    const json = await response.json()
    // Certaines API enveloppent la réponse dans { data: ... }
    team.value = json.data ?? json
  })
</script>
