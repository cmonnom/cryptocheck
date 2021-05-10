import Vue from "vue";
import Vuex from "vuex";
import data from "../assets/portFolio.json";
const { DateTime } = require("luxon");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cryptoValues: {},
    times: [],
    rates: {},
    portFolio: data.portFolio,
    totalPurchased: data.totalPurchased,
    totalSold: data.totalSold,
    totalCurrent: 0,
    totalStarted: 0,
    currencies: [],
    earnings: [],
    defaultColors: [
      "#1f77b4", // muted blue
      "#ff7f0e", // safety orange
      "#2ca02c", // cooked asparagus green
      "#d62728", // brick red
      "#9467bd", // muted purple
      "#8c564b", // chestnut brown
      "#e377c2", // raspberry yogurt pink
      "#7f7f7f", // middle gray
      "#bcbd22", // curry yellow-green
      "#17becf", // blue-teal
    ],
  },
  mutations: {
    initFromStorage(state) {
      state.cryptoValues = localStorage.getItem("cryptoValues")
        ? JSON.parse(localStorage.getItem("cryptoValues"))
        : {};
      state.times = localStorage.getItem("times")
        ? JSON.parse(localStorage.getItem("times"))
        : [];
      state.earnings = localStorage.getItem("earnings")
        ? JSON.parse(localStorage.getItem("earnings"))
        : [];
    },
    appendCrypto(state, payload) {
      var newCryptoValues = JSON.parse(JSON.stringify(state.cryptoValues));
      var currencies = [];
      for (const [key, value] of Object.entries(state.portFolio)) {
        if (!value.ignore) {
          currencies.push(key);
        }
      }
      currencies = currencies.sort();
      var totalCurrent = 0;
      var totalStarted = 0;
      for (var i = 0; i < currencies.length; i++) {
        var key = currencies[i];
        var values = newCryptoValues[key];
        if (!values) {
          values = [];
        }
        state.rates = payload.rates;
        state.currencies = currencies;
        var exchangeRate = state.rates[key];
        if (exchangeRate) {
          var currentValue = state.portFolio[key].amount / exchangeRate;
          totalCurrent += currentValue;
          totalStarted += state.portFolio[key].startingValue;
        }
        values.push(1 / payload.rates[key]);
        newCryptoValues[key] = values;
      }
      state.cryptoValues = newCryptoValues;
      state.totalCurrent = totalCurrent;
      state.totalStarted = totalStarted;
      var earning = totalCurrent - totalStarted;
      state.earnings.push(earning);
      state.times.push(DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss"));
      // //fix earnings[0]
      // if (state.earnings[0] == -state.totalPurchased) {
      //   state.earnings[0] = null;
      // }
      localStorage.setItem("cryptoValues", JSON.stringify(state.cryptoValues));
      localStorage.setItem("times", JSON.stringify(state.times));
      localStorage.setItem("earnings", JSON.stringify(state.earnings));
    },
    // appendEarnings(state, totalCurrent) {
    //   state.totalCurrent = totalCurrent;
    //   var earning = totalCurrent - state.totalPurchased;
    //   state.earnings.push(earning);
    //   localStorage.setItem("earnings", JSON.stringify(state.earnings));
    // },
    clearStorage(state) {
      state.cryptoValues = {};
      state.times = [];
      state.earnings = [];
      localStorage.setItem("cryptoValues", "{}");
      localStorage.setItem("times", "[]");
      localStorage.setItem("earnings", "[]");
    },
  },
  getters: {
    getCryptoValues: (state) => {
      return state.cryptoValues;
    },
    getRates: (state) => {
      return state.rates;
    },
    getPortFolio: (state) => {
      return state.portFolio;
    },
    getTotalPurchased: (state) => {
      return state.totalPurchased;
    },
    getTotalSold: (state) => {
      return state.totalSold;
    },
    getCurrencies: (state) => {
      return state.currencies;
    },
    getTimeline: (state) => {
      return state.times;
    },
    getEarnings: (state) => {
      return state.earnings;
    },
    getTotalCurrent: (state) => {
      return state.totalCurrent;
    },
    getTotalStarted: (state) => {
      return state.totalStarted;
    },
    getPortFolioOverTime: (state) => {
      var portFolioOverTime = {};
      for (var i = 0; i < state.currencies.length; i++) {
        var key = state.currencies[i];
        var rates = state.cryptoValues[key] ? state.cryptoValues[key] : [];
        var values = rates.map((a) => a * state.portFolio[key].amount);
        portFolioOverTime[key] = values;
      }
      return portFolioOverTime;
    },
    getColor: (state) => (index) => {
      var boundedIndex = index % state.defaultColors.length;
      return state.defaultColors[boundedIndex];
    },
  },
  actions: {},
  modules: {},
});
