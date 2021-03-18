<template>
  <div>
    <table>
      <tr>
        <th>Crypto</th>
        <th>Started</th>
        <th>Currently</th>
        <th>Profit</th>
        <th>Change</th>
        <th>Duration</th>
      </tr>
      <tr v-for="(row, index) in this.portFolioTable" :key="index">
        <td class="label">{{ row.name }}</td>
        <td class="number">{{ row.startingValue }}</td>
        <td class="number">{{ row.currentValue }}</td>
        <td class="number">{{ row.profit }}</td>
        <td class="number">{{ row.change }}</td>
        <td class="label">{{ row.duration }}</td>
      </tr>
    </table>
    <div class="left-button">
      <button @click="fetchValues">Refresh</button>
    </div>
  </div>
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
      cryptoValues: {},
      portFolioTable: [],
      apiUrl: "https://api.coinbase.com/v2/exchange-rates",
    };
  },
  methods: {
    loadPortFolio() {
      this.portFolio = {
        LTC: {
          amount: 1.19541358,
          startingValue: 236.3,
          startedDate: "03/17/2021",
        },
        XRP: {
          amount: 39.6122,
          startingValue: 18.41,
          startedDate: "03/17/2021",
        },
        ETH: {
          amount: 0.07350651,
          startingValue: 130.49,
          startedDate: "03/17/2021",
        },
        BTC: {
          amount: 0.00127901,
          startingValue: 70.45,
          startedDate: "03/17/2021",
        },
        EOS: {
          amount: 2.7779,
          startingValue: 10.93,
          startedDate: "03/17/2021",
        },
        XLM: {
          amount: 575.6638849,
          startingValue: 231.09,
          startedDate: "03/18/2021",
        },
        BSV: { amount: 0.0116, startingValue: 2.23, startedDate: "03/17/2021" },
        DAI: { amount: 5.9607, startingValue: 6.0, startedDate: "03/17/2021" },
        GRT: {
          amount: 10.76813743,
          startingValue: 17.84,
          startedDate: "03/17/2021",
        },
        BCH: {
          amount: 0.01164053,
          startingValue: 6.0,
          startedDate: "03/17/2021",
        },
      };
    },
    fetchValues() {
      this.axios
        .get(this.apiUrl, {
          params: {},
        })
        .then((response) => {
          this.cryptoValues = response.data.data.rates;
          console.log("cryptoValues:", this.cryptoValues);
        })
        .catch((error) => {
          alert(error);
        });
    },
    calcPortfolioValues() {
      if (!this.cryptoValues) {
        return;
      }
      this.portFolioTable = [];
      var currencies = Object.keys(this.portFolio).sort();
      var totalStarting = 0;
      var totalCurrent = 0;
      for (var i = 0; i < currencies.length; i++) {
        var c = currencies[i];
        var startingValue = this.portFolio[c].startingValue;
        var exchangeRate = this.cryptoValues[c];
        if (exchangeRate) {
          var currentValue = this.portFolio[c].amount / exchangeRate;
          var profit = currentValue - startingValue;
          var pctProfit = profit / startingValue;
          this.portFolioTable.push({
            name: c,
            startingValue: Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(startingValue),
            currentValue: Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(currentValue),
            profit: Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(profit),
            change: Intl.NumberFormat("en-US", {
              style: "percent",
              minimumFractionDigits: 2,
            }).format(pctProfit),
            duration: "N/A",
          });
          totalStarting += startingValue;
          totalCurrent += currentValue;
        } else {
          this.portFolioTable.push({
            name: c,
            startingValue: Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(startingValue),
            currentValue: "N/A",
            profit: "N/A",
            change: "N/A",
            duration: "N/A",
          });
        }
      }
      var totalProfit = totalCurrent - totalStarting;
      var totalChange = totalProfit / totalStarting;
      this.portFolioTable.push({
        name: "TOTAL",
        startingValue: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(totalStarting),
        currentValue: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(totalCurrent),
        profit: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(totalProfit),
        change: Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
        }).format(totalChange),
        duration: "N/A",
      });
    },
  },
  mounted() {
    this.loadPortFolio();
    this.fetchValues();
    this.calcPortfolioValues();
  },
  watch: {
    cryptoValues: "calcPortfolioValues",
  },
};
</script>

<style>
th,
td {
  padding: 5px 15px 5px 15px;
  border-bottom: 1px solid #ddd;
}
td.number {
  text-align: left;
}
td.label {
  text-align: right;
}
.left-button {
  text-align: left;
}
</style>
