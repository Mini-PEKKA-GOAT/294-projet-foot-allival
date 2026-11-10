import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useTeamStore = defineStore('team', {
  state: () => ({
    isLoading: false,
    leagues: [],
    teams: [],
    favorites: [],
  }),

  getters: {
    totalTeams: state => {
      return state.teams.length
    },

    // Nombre total de favoris
    totalFavorites: state => {
      return state.favorites.length
    },

    getLeagueById: state => {
      return leagueId => {
        return state.leagues.find(league => String(league.id) === String(leagueId))
      }
    },

    getTeamById: state => {
      return teamId => {
        return state.teams.find(team => String(team.id) === String(teamId))
      }
    },

    // Vérifie si une équipe est favorite
    isFavorite: state => {
      return team => {
        return state.favorites.includes(team.id)
      }
    },

    // Retourne les objets équipe favoris (pas juste les IDs)
    getFavorites: state => {
      const favoriteTeams = state.favorites.map(favoriteId => {
        return state.teams.find(team => team.id === favoriteId)
      })
      return favoriteTeams.filter(team => team !== undefined)
    },
  },

  actions: {
    async init () {
      this.isLoading = true
      try {
        await Promise.all([
          this.fetchLeagues({ withLoader: false }),
          this.fetchTeams({ withLoader: false }),
        ])
        this.loadFavorites()
        console.log('Store initialisé')
      } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error)
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
        const response = await api.get('/teams?limit=100&sport=Soccer')
        this.teams = response.data.data
        this.cleanupFavorites()
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error.message)
        this.teams = []
      } finally {
        if (withLoader) {
          this.isLoading = false
        }
      }
    },

    // Charge les favoris depuis localStorage
    loadFavorites () {
      try {
        const savedFavorites = localStorage.getItem('team_favorites')
        if (savedFavorites) {
          this.favorites = JSON.parse(savedFavorites)
          console.log('Favoris chargés :', this.favorites.length, 'éléments')
        } else {
          this.favorites = []
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris :', error)
        this.favorites = []
      }
    },

    // Sauvegarde les favoris dans localStorage
    saveFavorites () {
      try {
        localStorage.setItem('team_favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des favoris :', error)
      }
    },

    // Ajoute ou retire une équipe des favoris
    toggleFavorite (team) {
      const favoriteIndex = this.favorites.indexOf(
        team.id,
      )
      if (favoriteIndex === -1) {
        this.favorites.push(team.id)
      } else {
        this.favorites.splice(favoriteIndex, 1)
      }
      this.saveFavorites()
    },

    // Supprime les favoris dont l'équipe n'existe plus
    cleanupFavorites () {
      const initialCount = this.favorites.length
      this.favorites = this.favorites.filter(favoriteId => {
        return this.teams.some(team => team.id === favoriteId)
      })
      const removedCount = initialCount - this.favorites.length
      if (removedCount > 0) {
        console.log('Nettoyage :', removedCount, 'favoris obsolètes supprimés')
        this.saveFavorites()
      }
    },
  },
})
