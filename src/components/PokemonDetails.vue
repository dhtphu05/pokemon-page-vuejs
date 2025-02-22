<template>
  <div class="back-button">
    <button @click="$emit('back')" > > Back </button>
  </div>
  <div class="container" v-if="pokemon">
    <div class="pokemon__image">
      <img :src="pokemon?.image" :alt="pokemon?.name">
    </div>
    <div class="labels" >

      <div v-for="type in pokemon.types" :key="type" class="label" :style="{backgroundColor: typeColors[type]}">{{ type }}</div>
    </div>
    <div class="pokemon__name">{{ pokemon.name }}</div>
    <div class="pokemon__entry">{{ pokemon.entry }}</div>
    <div class="pokemon__details-wrap" v-if="pokemon">
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

        <div class="detail-tag" v-for="ability in pokemon.abilities" :key="ability" >
          {{ ability }}
        </div>

      </div>
    </div>
    <div class="stats">
      <h3 class="label">Stats</h3>
      <div class="detail__wrap">
        <div class="tag">
          <div class="tag__label HP">HP</div>
          <div class="tag__detail">45</div>
        </div>
        <div class="tag">
          <div class="tag__label ATK">ATK</div>
          <div class="tag__detail">49</div>
        </div>
        <div class="tag">
          <div class="tag__label DEF">DEF</div>
          <div class="tag__detail">49</div>
        </div>
        <div class="tag">
          <div class="tag__label SpA">SpA</div>
          <div class="tag__detail">65</div>
        </div>
        <div class="tag">
          <div class="tag__label SpD">SpD</div>
          <div class="tag__detail">65</div>
        </div>
        <div class="tag">
          <div class="tag__label SPD">SPD</div>
          <div class="tag__detail">45</div>
        </div>
      </div>
    </div>
    <div class="evolution">
      <h3 class="label">Evolution</h3>
      <div class="evolution__wrap">
        <div class="evolution">
          <div class="form">
            <h4 class="name">bulbasaur</h4><img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="bulbasaur">
          </div>
        </div>
        <div class="divider">&gt;</div>
        <div class="evolution">
          <div class="form">
            <h4 class="name">ivysaur</h4><img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" alt="ivysaur">
          </div>
        </div>
        <div class="divider">&gt;</div>
        <div class="evolution">
          <div class="form">
            <h4 class="name">venusaur</h4><img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" alt="venusaur">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    typeColors: {
      type: Object,
      required: true
    },
    selectedPokemon: {
      type: Object,
      required: true
    }
  }
};



</script>


<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
