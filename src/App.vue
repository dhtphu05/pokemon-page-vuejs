<script setup>
import { ref, computed } from 'vue'
import pokemonCard from './components/pokemonCard.vue';
import PokemonDetails from './components/PokemonDetails.vue';
const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0',
  electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
  fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
  flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
};

const pokemonListDisplay = ref([]);
const searchQuery = ref('');
const offset = ref(0);
const limit = ref(10);

async function getPokemonDetails(id){
  try{
    const response= await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const data = await response.json();
    const pokemonSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`);

    data.species = await pokemonSpecies.json();
    return data;
  }
  catch(error){
    console.error('Error fetching pokemon details:', error);
    return null;
  }
}

async function getPokemonEvolution(pokemon){
  const response= await fetch(pokemon.evolution);
  const data = await response.json();
  console.log(data);
  return data;
}
// async function renderAllPokemon(){

// }
async function fetchAllPokemon(){
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898`);
  const data = await response.json();
  return data.results;
}
async function renderAllPokemon(){
  const data = await fetchAllPokemon();
  const newPokemon = await Promise.all(
    data.map(async (pokemon, index) => {
      const id = index + 1;
      const details = await getPokemonDetails(id);
      return {
        id: id,
        name: pokemon.name,
        types: details?.types.map(t => t.type.name) || [],
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        height: details?.height,
        weight: details?.weight,
        abilities: details?.abilities.map(a => a.ability.name) || [],
        stats: details?.stats.map(s => ({ name: s.stat.name, value: s.base_stat })) || [],
        entry: details?.species.flavor_text_entries[0].flavor_text,
        evolution: details?.species.evolution_chain.url




      };
    })
  );
  console.log(newPokemon);
  pokemonListDisplay.value = newPokemon;
}
const pokemonToShow=ref([]);
async function displayPokemon(){
  console.log(offset.value);
  console.log(limit.value);
  const pokemonRender = pokemonListDisplay.value.slice(0, offset.value + limit.value);
  offset.value += limit.value;
  pokemonToShow.value = pokemonRender;
  return pokemonRender;
}

const filteredPokemon = computed( () =>{
  if(!searchQuery.value){
    return pokemonToShow.value;
  }
  return pokemonListDisplay.value.filter(pokemon =>
    pokemon.name.includes(searchQuery.value.toLowerCase())
  );
})
async function initializePokemon() {
  await renderAllPokemon();
  await displayPokemon();
}
const evolutionList=ref([]);
const evolutionListDisplay=ref([]);
async function extractEvolution(pokemon){
  const data = await getPokemonEvolution(pokemon);
  // data= data.chain;
  let dataChain=data.chain;
  while(dataChain.evolves_to.length>0){
    evolutionList.value.push(dataChain.species.name);
    dataChain=dataChain.evolves_to[0];
  }
  evolutionList.value.push(dataChain.species.name);
  console.log(evolutionList.value);
  for(let pokemon of evolutionList.value){
    evolutionListDisplay.value.push({
      name: pokemon,
      image: findImage(pokemon)
    });
  }
  console.log(evolutionListDisplay.value);





}
function findImage(namePokemon){
  for(let pokemon of pokemonListDisplay.value){
    if(pokemon.name==namePokemon){
      return pokemon.image;
    }
  }
}
console.log(pokemonListDisplay.value);
const selectedPokemon=ref(null);
function selectPokemon(pokemon){
  selectedPokemon.value=pokemon;
  extractEvolution(pokemon);
}
//add event click card to show details

function handleBack(){
  selectedPokemon.value=null;
  evolutionList.value=[];
  evolutionListDisplay.value=[];
}
initializePokemon();






</script>

<template>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
  <div id="#app">
    <div v-if="!selectedPokemon">
    <div class="search">
      <input type="text" v-model="searchQuery" id="search-input" placeholder="Search Pokemon">
    </div>
    <div class="container-pokemon">
      <pokemonCard
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        :type-colors="typeColors"
        @click="selectPokemon(pokemon)"
      />

    </div>
    <div class="load-more">
      <button v-show="!searchQuery && offset < pokemonListDisplay.length" @click="displayPokemon" id="load-more">Load more</button>
    </div>
  </div>
  <PokemonDetails v-else :pokemon="selectedPokemon" :evolution-list-display="evolutionListDisplay" :type-colors="typeColors" @back="handleBack"/>


  </div>
</template>

<script>
//props selectedPokemon to show details
export default {
  components: {
    pokemonCard,
    PokemonDetails
  },
  setup(){
    return {
      typeColors,
      pokemonToShow,
      searchQuery,
      offset,
      limit,
      filteredPokemon,
      selectedPokemon,
      displayPokemon,
      selectPokemon,
      evolutionListDisplay,

    }
  }
}


</script>
<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}
.container-pokemon{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
    gap:40px;

}
#load-more{
    display: flex;
    justify-self: center;
    align-items: center;
    background-color: aliceblue;
    padding: 10px;
    border-radius: 10px;

}


.type-container{
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 10px;
    .type-pokemon{
        padding: 5px;
        border-radius: 5px;
        background-color: #f1f1f1;
        font-weight: bold;
    }
}
#search-input{
    display:flex;
    justify-self: center;
    border-radius: 15px;
    width: 600px;
    height: 50px;
    font-size: 15px;
    padding: 20px;
}
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
