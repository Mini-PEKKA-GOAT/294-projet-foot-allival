# ⚽ Footix — Projet Vue.js & Vuetify

Application web qui affiche des équipes de football à partir d'une API publique, avec recherche, filtre, tri, page de détail et favoris.

- **Site en ligne** : [Footix](https://294-projet-foot-allival.vercel.app)
- **Projet** : Module ICT-294 — Réaliser le front-end d'une application web
- **Dépôt** : `294-projet-foot-allival`

---

## 1. 🎨 Présentation du projet

### Concept
- **API choisie** : l'API Sports de DIVTEC (`https://apis.divtec.me/api/sports`)
    - *Pourquoi* : API proposée dans le cours, sport que j'aime bien, et que je regarde régulièrement)
- **Public cible** : Fans de football qui veulent retrouver rapidement des infos sur leurs clubs)
- **Objectifs de l'application** :
    - Parcourir les équipes de football disponibles dans l'API
    - Trouver rapidement une équipe grâce à la recherche, au filtre par ligue et au tri
    - Consulter les informations détaillées d'un club
    - Garder ses équipes préférées dans une liste de favoris

### Fonctionnalités principales
- **Liste des équipes** (page d'accueil) : grille de cartes avec le logo, le nom, la ligue et le pays de chaque équipe, chargée depuis l'API
- **Recherche / Filtre / Tri** :
    - recherche par nom d'équipe, insensible aux majuscules
    - filtre par ligue, via un menu déroulant construit à partir des équipes chargées
    - tri alphabétique A → Z / Z → A
    - les trois se combinent et se mettent à jour instantanément
- **Vue détail** (`/teams/:id`) : logo, nom, ligue, pays, et les autres informations du club renvoyées par l'API (abréviation, stade, capacité du stade, localisation, année de création…)
- **Favoris** : bouton cœur sur chaque carte pour ajouter ou retirer une équipe, avec un message de confirmation (snackbar), et une page « Mes favoris » qui les regroupe
- **Persistance locale** : les favoris sont enregistrés dans le `localStorage` (clé `team_favorites`) et restent après un rechargement de la page
- **Retours utilisateur** : squelettes pendant le chargement, message d'erreur si l'API ne répond pas, message si une recherche ne donne aucun résultat ou s'il n'y a aucun favori

### Aperçu visuel
![Screenshot de l'application](img/screenshot.png)

---

## 2. 📚 Parcours d'apprentissage

### Ressources utilisées
#### Documentation & tutos
- [Vue 3 Docs](https://vuejs.org/guide/introduction.html)
- [Vuetify Docs](https://vuetifyjs.com/en/components/all/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Axios Docs](https://axios-http.com/fr/docs/intro)
- [Public APIs List](https://github.com/public-apis/public-apis)
- Exercice Pokédex de [devjs.ch](https://devjs.ch), adapté étape par étape à l'API des équipes
- Documentation Swagger de l'API : [apis.divtec.me/api/sports/docs](https://apis.divtec.me/api/sports/docs)

---

## 3. 🛠️ Outils et méthodologie

### Environnement de développement
- **IDE** : WebStorm
- **Versioning** : Git + GitHub
- **Déploiement** : Vercel, relié au dépôt GitHub (déploiement automatique à chaque push sur `main`)
- **Dépendances principales** : Vue 3, Vuetify 3, Pinia, Axios, Vue Router (routes générées à partir du dossier `pages/`)
- **Outils du template Vuetify** : auto-import des composants et des fonctions Vue (`ref`, `computed`…), ESLint
- **Variables d'environnement** : `.env` (non versionné) + `.env.example`. L'API n'a pas besoin de clé : seule son adresse est configurée.

### Installation & Run
1. Cloner le repo :
   ```bash
   git clone https://github.com/<ton-compte>/294-projet-foot-allival.git
   cd 294-projet-foot-allival
   ```
2. Installer les dépendances :
   ```bash
   npm install
   
   ```
3.   Contenu attendu :
   ```
   VITE_API_URL=https://apis.divtec.me/api/sports
   ```
4. Lancer en local :
   ```bash
   npm run dev
   ```
5. Construire la version de production :
   ```bash
   npm run build
   ```

> ⚠️ Vite lit le `.env` uniquement au démarrage et au build. Après une modification, il faut relancer `npm run dev`. Sur Vercel, la variable `VITE_API_URL` est définie dans **Settings → Environment Variables**, et il faut redéployer après chaque changement.

### Méthodologie
- Découpage en composants réutilisables (`TeamCard` est utilisé sur la page d'accueil et sur la page des favoris)
- Props claires (`TeamCard` reçoit une équipe via la prop `team`)
- Store global avec Pinia : tous les appels API et les favoris passent par `teamStore`
- Computed chaînés pour la recherche, le filtre et le tri, sans jamais modifier les données du store
- Commits réguliers avec des messages explicites
- Tests manuels dans le navigateur, en local et sur la version en ligne

### Choix techniques
- **API sélectionnée** : API Sports de DIVTEC 
- **Endpoints utilisés** :
    - `GET /teams?limit=100&sport=Soccer` : liste des équipes de football
    - `GET /leagues` : liste des ligues
- **Format des réponses** : l'API renvoie `{ data: [...], pagination: {...} }`, les éléments sont donc lus dans `data`
- **Limites / quotas connus** :
    - maximum 100 équipes chargées par requête (`limit=100`)
    - seules les équipes de football sont chargées (`sport=Soccer`)

### Architecture
```
src/
├── App.vue                 → layout principal (header, contenu, footer) + initialisation du store
├── pages/
│   ├── index.vue           → liste des équipes + recherche, filtre, tri
│   ├── teams/[id].vue      → détail d'une équipe
│   ├── favoris.vue         → équipes favorites
│   └── a-propos.vue        → page « À propos »
├── components/
│   ├── AppHeader.vue       → en-tête et navigation
│   ├── AppFooter.vue       → pied de page
│   └── TeamCard.vue        → carte d'une équipe (logo, nom, ligue, bouton favori)
├── stores/
│   └── teamStore.js        → store Pinia : équipes, ligues, favoris
├── plugins/
│   └── axios.js            → instance Axios configurée avec VITE_API_URL
└── utils/
    └── imageUrl.js         → construit l'URL complète des images
```

**Data-flow résumé :**
1. Au démarrage, `App.vue` appelle `teamStore.init()`
2. Le store charge les équipes et les ligues en parallèle via Axios, puis récupère les favoris dans le `localStorage`
3. Les pages lisent les données du store (`teams`, `getTeamById`, `getFavorites`…) et se mettent à jour automatiquement grâce à la réactivité
4. Quand l'utilisateur clique sur le cœur d'une carte, `TeamCard` appelle `teamStore.toggleFavorite(team)` : le store met à jour la liste, la sauvegarde dans le `localStorage`, et toutes les pages concernées se mettent à jour
5. La recherche, le filtre et le tri sont des computed dans `index.vue` : ils transforment une copie des équipes sans toucher au store

---

## 4. 🧪 Tests et validation

### Tests techniques
- ✅ Appels API fonctionnels en local et sur Vercel
- ✅ Navigation entre la liste et la page de détail
- ✅ Variable d'environnement prise en compte sur Vercel après redéploiement
- ✅ Persistance des favoris vérifiée après un rechargement de la page
- ✅ Rechargement direct d'une page de détail (`/teams/...`) sur la version en ligne

### Tests d'accessibilité
- ✅ Contraste des couleurs (Vuetify par défaut)
- ✅ Labels sur les champs de recherche et de filtre
- ✅ Navigation au clavier possible

### Tests d'erreurs & fallback
- ✅ API inaccessible → message d'erreur clair avec l'adresse de l'API
- ✅ Recherche ou filtre sans résultat → « Aucune équipe ne correspond à votre recherche. »
- ✅ Aucun favori → message expliquant comment en ajouter
- ✅ Équipe introuvable sur la page de détail → « Équipe non trouvée. »

---

## 5. 🤖 Usage d'intelligence artificielle

**⚠️ TRANSPARENCE OBLIGATOIRE**

### IA utilisée
- **Nom** : Claude (Anthropic)
- **Version** : Opus 5.5, Fable 5.2 pour la doc
- **Contexte** : Debugging et explications

### Utilisation détaillée
**Domaines d'aide** (pourcentages à compléter honnêtement) :
- Aide au code général : 15%
- Aide à la structuration du projet : 25%
- Debugging : 90%
- Recherche d'idées : 0%

**Ce pour quoi l'IA a été utilisée concrètement :**
- Comprendre et corriger des erreurs : format de réponse `{ data, pagination }`, adresse de l'API incomplète dans le `.env`, variable d'environnement manquante sur Vercel, footer affiché deux fois, règle ESLint `unicorn/no-array-sort`
- Expliquer le fonctionnement des variables d'environnement avec Vite et Vercel, et du déploiement via GitHub
- Rédiger des messages de commit et ce README

**Compréhension et adaptation**

- Ce que fait le code généré (ex. : les computed chaînés de `index.vue`, `toggleFavorite` dans le store)
- Comment il a été adapté au projet (ex. : filtre par ligue au lieu du filtre par type, `response.data.data`, comparaison des id avec `String()`)

### Parties codées manuellement
- Composants principaux : 95% personnel
- Store & persistance : 80% personnel
- Routing & navigation : 85% personnel
- Tests & validation : 100% personnel

### Apprentissage personnel
- Ce que j'ai appris grâce à l'IA : A savoir ou chercher quand l'API est indisponible
- Comment elle m'a aidé à progresser : Je ne lui demandais pas des réponses, uniquement qu'elle m'aide, ou qu'elle m'explique comment faire.

---

## 6. 🎯 Bilan personnel

### Ce que j'ai appris
- Compétences techniques acquises : Pinia, computed chaînés, Axios, variables d'environnement, déploiement Vercel.
- Concepts difficiles maîtrisés : Comprendre comment le .env fonctionnait, ce qu'il fallait que je fasse ou pas dessus. 

### Difficultés rencontrées
- **Les équipes ne s'affichaient plus** après le passage au store : l'API renvoie `{ data, pagination }` et pas directement un tableau. Solution : lire `response.data.data`
- **L'API n'était pas trouvée** : l'adresse dans le `.env` ne contenait pas `/api/sports`. Solution : corriger `VITE_API_URL` et relancer le serveur
- **Le site marchait en local mais pas en ligne** : Vite remplace les variables d'environnement au moment du build, et le `.env` n'est pas envoyé sur GitHub. Solution : définir `VITE_API_URL` dans les réglages de Vercel, puis redéployer
- **Footer affiché deux fois** : `AppFooter` était présent à la fois dans `App.vue` et dans `layouts/default.vue`. Solution : le retirer du layout
- **Erreur ESLint sur `sort()`** : la règle `unicorn/no-array-sort` impose `toSorted()`, qui renvoie une copie triée
- **Équipe introuvable par son id** : l'id de la route est une chaîne alors que l'API peut renvoyer des nombres. Solution : comparer avec `String()`
- Moments de blocage et aide reçue : à compléter

### Réussites et fiertés
- Aspects du projet dont je suis fier : Apprendre comment faire pour utiliser une API, et coder un site web de A à Z.
- Progrès constatés depuis le début : Tout ce  que j'ai appris

### Améliorations possibles
- Charger toutes les équipes avec la pagination de l'API, au lieu de 100 maximum
- Ajouter d'autres sports, avec un filtre par sport
- Utiliser les ligues chargées depuis l'API (`/leagues`) pour afficher plus d'informations
- Afficher les informations de la page de détail avec des libellés en français et des icônes

---

## 7. 📚 Références & Sources
- Documentation de l'API : [API Sports DIVTEC (Swagger)](https://apis.divtec.me/api/sports/docs)
- Exercice de base : Pokédex de [devjs.ch](https://devjs.ch)
- Documentation : [Vue 3](https://vuejs.org/), [Vuetify](https://vuetifyjs.com/), [Pinia](https://pinia.vuejs.org/), [Axios](https://axios-http.com/fr/), [Vite — variables d'environnement](https://vite.dev/guide/env-and-mode), [Vercel — variables d'environnement](https://vercel.com/docs/environment-variables)
- Usage de l'IA : voir la section 5