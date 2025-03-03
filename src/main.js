import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import PokemonDetails from './components/PokemonDetails.vue'

const router = createRouter({
  history: createWebHistory('/pokemon-page-vuejs/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:pokemonName',
      name: 'pokemon-details',
      component: PokemonDetails,
      props: true

    }
  ]
})
createApp(App).use(router).mount('#app')

