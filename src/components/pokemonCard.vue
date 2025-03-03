<!-- components/PokemonCard.vue -->
<template>
    <RouterLink :to="{
      name: 'pokemon-details',
      params: { pokemonName: pokemon.name },
      state: {
        pokemon: pokemonn,
        typeColors: typeColors
      }
    }" class="card">
        <div class="id">{{ '#' + pokemon.id }}</div>
        <img :src="pokemon.image" :alt="pokemon.name">
        <h3>{{ pokemon.name }}</h3>
        <div class="type-container">
            <span v-for="type in pokemon.types" :key="type" class="type-pokemon"
                :style="{ backgroundColor: typeColors[type] }">
                {{ type }}
            </span>
        </div>
      </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    pokemon: {
        type: Object,
        required: true
    },
    typeColors: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
a{
    text-decoration: none;
    color: black;
}
.card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    background-color: #FFFFFF;
    border-radius: 15px;
    box-shadow: rgb(72, 71, 71) 0px 0px 5px;
    width: 200px;
    height: 300px;

}
.type-container {
    display: flex;
    gap: 10px;
    span{
        padding: 5px;
        border-radius: 5px;
    }
}

.card img {
    width: 100px;
    height: 100px;
}

.card h3 {
    font-size: 20px;
    font-weight: bold;
}

.card p {
    font-size: 15px;
}

.card:hover {
    scale: 1.1;
}
</style>
