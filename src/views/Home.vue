<template>
  <div class="home flex-container">
    <div class="half-div" ref="cryptoTable">
      <button class="button1" @click="refresh">Refresh</button>
      <button class="button1" @click="clearStorage">Clear Storage</button>
      <div class="pb-2"><CryptoTable /></div>
      <div><CryptoPlot show="Earnings" plotId="earningsPlot" /></div>
    </div>
    <div class="half-div" ref="cryptoPlot">
      <CryptoPlot show="All" plotId="allPlot" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CryptoTable from "@/components/CryptoTable.vue";
import CryptoPlot from "@/components/CryptoPlot.vue";

export default {
  name: "Home",
  components: {
    CryptoTable,
    CryptoPlot,
  },
  data() {
    return {
      apiUrl: "https://api.coinbase.com/v2/exchange-rates",
    };
  },
  methods: {
    refresh() {
      this.axios
        .get(this.apiUrl, {
          params: {},
        })
        .then((response) => {
          this.$store.commit("appendCrypto", {
            rates: response.data.data.rates,
          });
          // console.log(this.$store.state.cryptoValues);
        })
        .catch((error) => {
          alert(error);
        });
    },
    clearStorage() {
      this.$store.commit("clearStorage");
    },
  },
  mounted() {
    this.refresh();
    setInterval(this.refresh, 600000);
  },
  computed: {
    portFolio() {
      return this.$store.getters.getPortFolio;
    },
  },
};
</script>

<style>
.half-div {
  flex: 50%;
  /* padding: 2em; */
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}
.home {
  padding: 2em;
}
.pb-2 {
  padding-bottom: 2em;
}
.button1 {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  /* color: #bfceca; */
  text-align: center;
  transition: all 0.2s;
}
.button1:hover {
  color: #000000;
  background-color: #35b897;
}
@media all and (max-width: 30em) {
  .button1 {
    display: block;
    margin: 0.4em auto;
  }
}
</style>
