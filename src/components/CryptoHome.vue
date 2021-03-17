<template>
  <div></div>
</template>

<script>
export default {
  name: "CryptoHome",
  props: {
    msg: String,
  },
  data: () => {
    return {
      portFolio: {},
      apiUrl: "https://api.coinbase.com/v2/exchange-rates",
    };
  },
  methods: {
    loadPortFolio() {
      this.portFolio = {
        LTC: { amount: 1.19541358, startingValue: 236.3 },
        XRP: { amount: 39.6122, startingValue: 18.41 },
        ETH: { amount: 0.07350651, startingValue: 130.49 },
        BTC: { amount: 0.00127901, startingValue: 70.45 },
        EOS: { amount: 2.7779, startingValue: 10.93 },
        XLM: { amount: 90.1255, startingValue: 35.5 },
        BSV: { amount: 0.0116, startingValue: 2.23 },
        DAI: { amount: 5.9607, startingValue: 6.0 },
        GRT: { amount: 10.76813743, startingValue: 17.84 },
        BCH: { amount: 0.01164053, startingValue: 6.0 },
      };
    },
    fetchValues() {},
  },
  mounted() {
    this.loadPortFolio();
    this.fetchValues();
  },
};
</script>
