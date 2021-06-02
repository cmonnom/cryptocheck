import Vue from "vue";
import Vuex from "vuex";
import data from "../assets/portFolio.json";
import transactionData from "../assets/transactions.json";
const { DateTime } = require("luxon");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cryptoValues: {},
    cryptoValuesHistory: {},
    times: [],
    historyTimes: [],
    rates: {},
    historyRates: {},
    // portFolio: {},
    // totalPurchased: 0,
    // totalSold: 0,
    portFolio: data.portFolio,
    totalPurchased: data.totalPurchased,
    totalSold: data.totalSold,
    totalCurrent: 0,
    totalStarted: 0,
    currencies: [],
    earnings: [],
    bought: transactionData.bought,
    sold: transactionData.sold,
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
      var array = Object.values(state.cryptoValues);
      var cryptoLength = array.length > 0 ? array[0].length : 0;
      if (cryptoLength != state.times.length) {
        state.cryptoValues = {};
        state.times = [];
        state.earnings = [];
        localStorage.setItem("cryptoValues", "{}");
        localStorage.setItem("times", "[]");
        localStorage.setItem("earnings", "[]");
      }
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
      var date = payload.date;
      // console.log("appendCrypto", date);
      if (!date) {
        date = DateTime.now().toFormat("yyyy-LL-dd HH:mm:ss");
      }
      state.times.push(date);
      // //fix earnings[0]
      // if (state.earnings[0] == -state.totalPurchased) {
      //   state.earnings[0] = null;
      // }
      localStorage.setItem("cryptoValues", JSON.stringify(state.cryptoValues));
      localStorage.setItem("times", JSON.stringify(state.times));
      localStorage.setItem("earnings", JSON.stringify(state.earnings));
    },
    // updateHistory(state, payload) {},
    clearStorage(state) {
      state.cryptoValues = {};
      state.times = [];
      state.earnings = [];
      localStorage.setItem("cryptoValues", "{}");
      localStorage.setItem("times", "[]");
      localStorage.setItem("earnings", "[]");
    },
    updatePortFolio(state, payload) {
      state.portFolio = payload.portFolio;
      state.totalPurchased = payload.totalPurchased;
      state.totalSold = payload.totalSold;
    },
    updateHistoryTimes(state, payload) {
      state.historyTimes = payload;
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
    getBoughtData: (state) => {
      var dates = [];
      var labels = [];
      var values = [];
      var sorted = state.bought.sort((a, b) => (a.date > b.date ? 1 : -1));
      var lastValue = 0;
      for (var i = 0; i < sorted.length; i++) {
        dates.push(sorted[i].date);
        labels.push(sorted[i].currency);
        var newValue = sorted[i].amount + lastValue;
        values.push(newValue);
        lastValue = newValue;
      }
      return {
        dates: dates,
        labels: labels,
        values: values,
      };
    },
    getSoldData: (state) => {
      var dates = [];
      var labels = [];
      var values = [];
      var sorted = state.sold.sort((a, b) => (a.date > b.date ? 1 : -1));
      var lastValue = 0;
      for (var i = 0; i < sorted.length; i++) {
        dates.push(sorted[i].date);
        labels.push(sorted[i].currency);
        var newValue = sorted[i].amount + lastValue;
        values.push(newValue);
        lastValue = newValue;
      }
      return {
        dates: dates,
        labels: labels,
        values: values,
      };
    },
    getBoughtTransactions: (state) => {
      return state.bought;
    },
    getSoldTransactions: (state) => {
      return state.sold;
    },
  },
  actions: {},
  modules: {},
});
