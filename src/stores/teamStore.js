import { defineStore } from 'pinia'

/**
 * Store Pinia pour gérer les données des équipes.
 * Centralise les appels API et partage les données entre les pages.
 */
export const useTeamStore = defineStore('team', {
  /**
   * State — les données brutes du store.
   * Retourne une fonction qui retourne un objet (comme data() dans Options API).
   */
  state: () => ({
    // Liste de toutes les équipes chargées depuis l'API
    teams: [],
    // Liste des ligues
    leagues: [],
    // Indicateur de chargement — true pendant les appels API
    isLoading: false,
    // Message d'erreur en cas de problème
    error: null,
  }),

  /**
   * Getters — propriétés calculées basées sur le state.
   * Équivalent de computed() dans un composant.
   */
  getters: {
    /**
     * Nombre total d'équipes dans le store.
     * @param {Object} state - Le state du store
     * @returns {number}
     */
    totalTeams: state => {
      return state.teams.length
    },

    /**
     * Trouve une équipe par son identifiant.
     * Retourne une fonction (getter avec paramètre).
     * @param {Object} state - Le state du store
     * @returns {function(string): Object|undefined}
     */
    getTeamById: state => {
      return teamId => {
        return state.teams.find(team => String(team.id) === String(teamId))
      }
    },
  },

  /**
   * Actions — méthodes qui modifient le state.
   * Peuvent être asynchrones (appels API).
   * On accède au state avec `this`.
   */
  actions: {
    /**
     * Charge toutes les équipes depuis l'API.
     * Note : ne gère pas isLoading — c'est init() qui s'en charge.
     */
    async fetchTeams () {
      // - limit=100     : récupère jusqu'à 100 équipes
      // - sport=Soccer  : filtre uniquement les équipes de football
      const response = await fetch('https://apis.divtec.me/api/sports/teams?limit=100&sport=Soccer')

      // Vérifier que la réponse est OK (status 200-299)
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`)
      }

      // L'API renvoie { data: [...], pagination: {...} } : les équipes sont dans "data"
      const json = await response.json()
      this.teams = json.data
      console.log('Équipes chargées :', this.teams.length)
    },

    /**
     * Charge toutes les ligues depuis l'API.
     * Note : ne gère pas isLoading — c'est init() qui s'en charge.
     */
    async fetchLeagues () {
      const response = await fetch('https://apis.divtec.me/api/sports/leagues')

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`)
      }

      // Même format que pour les équipes : les ligues sont dans "data"
      const json = await response.json()
      this.leagues = json.data
      console.log('Ligues chargées :', this.leagues.length)
    },

    /**
     * Initialise le store : charge les équipes et les ligues en parallèle.
     * À appeler une seule fois au démarrage de l'application (dans App.vue).
     */
    async init () {
      console.log('Initialisation du store des équipes...')

      this.isLoading = true
      this.error = null

      try {
        // Promise.all exécute les deux requêtes en parallèle
        // Plus rapide que de les faire l'une après l'autre
        await Promise.all([
          this.fetchTeams(),
          this.fetchLeagues(),
        ])

        console.log('Store des équipes initialisé')
      } catch (error) {
        this.error = 'Erreur lors du chargement des données'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
