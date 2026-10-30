import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useTeamStore = defineStore('team', {
  state: () => ({
    isLoading: false,
    leagues: [],
    teams: [],
  }),

  getters: {
    totalTeams: state => state.teams.length,

    getLeagueById: state => leagueId => {
      return state.leagues.find(league => String(league.id) === String(leagueId))
    },

    getTeamById: state => teamId => {
      return state.teams.find(team => String(team.id) === String(teamId))
    },
  },

  actions: {
    async init () {
      console.log('Initialisation du store des équipes...')
      this.isLoading = true

      try {
        await Promise.all([
          this.fetchLeagues({ withLoader: false }),
          this.fetchTeams({ withLoader: false }),
        ])
        console.log('Store des équipes initialisé')
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchLeagues ({ withLoader = true } = {}) {
      if (withLoader) {
        this.isLoading = true
      }

      try {
        const response = await api.get('/leagues')

        this.leagues = response.data.data
      } catch (error) {
        console.error('Erreur lors du chargement des ligues:', error.message)
        this.leagues = []
      } finally {
        if (withLoader) {
          this.isLoading = false
        }
      }
    },

    async fetchTeams ({ withLoader = true } = {}) {
      if (withLoader) {
        this.isLoading = true
      }

      try {
        const response = await api.get('/teams?limit=1000&sport=Soccer')

        this.teams = response.data.data
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error.message)
        this.teams = []
      } finally {
        if (withLoader) {
          this.isLoading = false
        }
      }
    },
  },
})
