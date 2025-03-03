<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const defaultTypeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0',
  electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
  fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
  flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
};

defineProps({
  pokemonName: String
});

const pokemon = ref(null);
const typeColors = ref(defaultTypeColors);
const evolutionListDisplay = ref([]);
const isLoading = ref(true);

function goBack() {
  //i ưant to go back to the previous page, but it still in previuos page and not go back to the home page
  router.back();
}

onMounted(async () => {
  try {
    if (route.params.pokemonName) {
      await fetchPokemonData(route.params.pokemonName);
    }
  } catch (error) {
    console.error("Error initializing pokemon data:", error);
    isLoading.value = false;
  }
});

async function fetchPokemonData(name) {
  try {
    isLoading.value = true;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
    const speciesData = await speciesResponse.json();

    pokemon.value = {
      id: data.id,
      name: data.name,
      image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      types: data.types.map(t => t.type.name),
      height: data.height ,
      weight: data.weight ,
      abilities: data.abilities.map(a => a.ability.name),
      stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })) || [],
      entry: speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '',
      evolution: speciesData.evolution_chain.url
    };

    // Fetch evolution chain data
    await fetchEvolutionChain(pokemon.value.evolution);

    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching pokemon data:", error);
    isLoading.value = false;
  }
}

async function fetchEvolutionChain(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const evoChain = [];
    let evoData = data.chain;

    evoChain.push({
      name: evoData.species.name
    });

    while (evoData.evolves_to && evoData.evolves_to.length > 0) {
      evoData = evoData.evolves_to[0];
      evoChain.push({
        name: evoData.species.name
      });
    }

    evolutionListDisplay.value = await Promise.all(
      evoChain.map(async (evo) => {

          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo.name}`);
          const data = await response.json();
          return {
            name: evo.name,
            image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
          };


      })
    );
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
  }
}
</script>

<template>
  <div class="back-button">
    <button @click="goBack"> &lt; Back </button>
  </div>

  <div v-if="isLoading" class="loading">
    <p>Getting data from PokeDex...</p>
  </div>

  <div v-else-if="pokemon" class="container">
    <div class="pokemon__image">
      <img :src="pokemon.image" :alt="pokemon.name">
    </div>

    <div class="labels">
      <div v-for="type in pokemon.types" :key="type" class="label"
           :style="{backgroundColor: typeColors[type]}">
        {{ type }}
      </div>
    </div>

    <div class="pokemon__name">{{ pokemon.name }}</div>
    <div class="pokemon__entry">{{ pokemon.entry }}</div>

    <div class="pokemon__details-wrap">
      <div class="container-details">
        <div class="label">Height</div>
        <div class="detail-tag">{{ pokemon.height }}</div>
      </div>
      <div class="container-details">
        <div class="label">Weight</div>
        <div class="detail-tag">{{ pokemon.weight }}</div>
      </div>
    </div>

    <div class="ability">
      <h3 class="label">Abilities</h3>
      <div class="detail__wrap">
        <div class="detail-tag" v-for="ability in pokemon.abilities" :key="ability">
          {{ ability }}
        </div>
      </div>
    </div>

    <div class="stats" v-if="pokemon.stats && pokemon.stats.length >= 6">
      <h3 class="label">Stats</h3>
      <div class="detail__wrap">
        <div class="tag">
          <div class="tag__label HP">HP</div>
          <div class="tag__detail">{{ pokemon.stats[0].value }}</div>
        </div>
        <div class="tag">
          <div class="tag__label ATK">ATK</div>
          <div class="tag__detail">{{ pokemon.stats[1].value }}</div>
        </div>
        <div class="tag">
          <div class="tag__label DEF">DEF</div>
          <div class="tag__detail">{{ pokemon.stats[2].value }}</div>
        </div>
        <div class="tag">
          <div class="tag__label SpA">SpA</div>
          <div class="tag__detail">{{ pokemon.stats[3].value }}</div>
        </div>
        <div class="tag">
          <div class="tag__label SpD">SpD</div>
          <div class="tag__detail">{{ pokemon.stats[4].value }}</div>
        </div>
        <div class="tag">
          <div class="tag__label SPD">SPD</div>
          <div class="tag__detail">{{ pokemon.stats[5].value }}</div>
        </div>
      </div>
    </div>

    <div class="evolution" v-if="evolutionListDisplay.length > 0">
      <h3 class="label">Evolution</h3>
      <div class="evolution__wrap">
        <template v-for="(evo, index) in evolutionListDisplay" :key="evo.name">
          <div class="evolution">
            <div class="form">
              <h4 class="name">{{ evo.name }}</h4>
              <img :src="evo.image" :alt="evo.name">
            </div>
          </div>
          <div v-if="index < evolutionListDisplay.length - 1" class="divider">→</div>
        </template>
      </div>
    </div>
  </div>

</template>


<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;

}
.back-button {
  display: flex;
  /* justify-content: center; */
  margin-top: 20px;
  border: #FFFFFF;
  button {
    padding: 10px;
    border-radius: 10px;
    background-color: white;
    box-shadow: rgba(99,99,99,0.2) 0px 2px;
    border: none;
    margin-left: 50px;

    /* font-weight: bold; */
  }
}
.container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  background-color: #FFFFFF;
  width: 40%;
  justify-content: center;
  align-items: center;
  color: #2c3e50;
}

.container .pokemon__image {
  margin-top: 20px;
  width: 200px;
  height: 200px;
  overflow: hidden;
  color: #2c3e50;

  img {
    width: 100%;
    height: 100%;
  }
}
.container .labels {
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #2c3e50;

  .label{
    padding: 5px;
    border-radius: 5px;
    /* background-color: #f6f8fc; */
    font-weight: bold;
  }
}

.container .pokemon__name {
  font-size: 22.5px;
  font-weight: bold;
  font-weight: 700;
  margin-top: 10px;
  color: #2c3e50;

}
.container .pokemon__entry {
  font-size: 15px;
  margin-top: 10px;
  text-align: center;
  color: #2c3e50;


}
.loading{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color:gray;
}
.container .pokemon__details-wrap {
  display: flex;
  gap: 200px;
  margin-top: 10px;
  justify-content: space-around;
  align-items: center;
  .container-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .label {
      font-size: 17px;
      font-weight: 600;
    }
    .detail-tag {
      font-size: 15px;
      margin-top: 10px;
      width: 100px;
      height: 28px;
      border-radius: 30px;
      padding: 5px;
      display: flex;
      justify-content: center;
      background-color: #f6f8fc;
    }
  }
}
.container .ability {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  .label {
    font-size: 17px;
    font-weight: 600;
  }
  .detail__wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap:200px;
    .detail-tag {
      font-size: 15px;
      margin-top: 10px;
      width: 100px;
      height: 28px;
      border-radius: 30px;
      padding: 5px;
      display: flex;
      justify-content: center;
      background-color: #f6f8fc;
    }
  }
}
.container .stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  .label {
    font-size: 17px;
    font-weight: 600;
  }
  .detail__wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 50px;
    .tag {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 69px;
      background-color: #f6f8fc;
      border-radius: 30px;

      .tag__label {
        font-size: 10px;
        font-weight: 700;
        border-radius: 999999px;
        padding: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        width: 25px;
        height: 25px;
        box-shadow: rgba(99,99,99,0.2) 0px 2px;
        color:white;

      }
      .tag__detail {
        font-size: 15px;
        margin-top: 10px;

        border-radius: 30px;
        padding: 5px;
        display: flex;
        justify-content: center;
        background-color: #f6f8fc;
      }
    }
    .HP {
      background-color: #df2140;
    }
    .ATK {
      background-color: #ff994d;
    }
    .DEF {
      background-color: #eecd3d;
    }
    .SpA {
      background-color: #85ddff;
    }
    .SpD {
      background-color: #96da83;
    }
    .SPD {
      background-color: #fb94a8;
    }

  }
}
.container .evolution {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  .label {
    font-size: 17px;
    font-weight: 600;
  }
  .evolution__wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    .evolution {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .form {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .name {
          font-size: 15px;
          font-weight: 600;
        }
        img {
          width: 96px;
          height: 96px;
        }
      }
    }
    .divider {
      font-size: 20px;
      font-weight: 600;
    }
  }
}

</style>
