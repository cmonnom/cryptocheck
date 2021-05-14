<template>
  <div>
    <table>
      <tr>
        <th>Crypto</th>
        <th title="Amount after last transaction">Started</th>
        <th title="Current crypto value in portfolio">Current Value</th>
        <th title="Change since last transaction">Profit</th>
        <th title="Pct change since last transaction">Change</th>
        <th>Duration</th>
        <th colspan="2">
          <v-file-input
            ref="portFolioInput"
            truncate-length="15"
            accept=".json"
            label="Upload portfolio"
            @change="handleNewPortFolio"
          ></v-file-input>
        </th>
      </tr>
      <tr
        :class="row.color"
        v-for="(row, index) in this.portFolioTable"
        :key="index"
      >
        <td class="label" :style="getTextColor(index)">
          <b>{{ row.name }}</b>
        </td>
        <td class="number">{{ row.startingValue }}</td>
        <td class="number">{{ row.currentValue }}</td>
        <td>
          {{ row.profit }}
        </td>
        <td class="number">{{ row.change }}</td>
        <td class="label">{{ row.duration }}</td>
      </tr>

      <tr>
        <th></th>
        <th></th>
        <th title="Current Portfolio value">Current Value</th>
        <th title="Change since last transaction">Profit</th>
        <th title="Pct change since last transaction">Change</th>
        <th title="Current Value - Diff">If Sell All</th>
        <th></th>
        <th>Diff</th>
      </tr>
      <tr class="top">
        <td class="label">TOTAL</td>
        <td class="label"></td>
        <td class="number">{{ totalCurrentFormatted }}</td>
        <td class="number">{{ totalProfitFormatted }}</td>
        <td class="number">{{ totalProfitPctFormatted }}</td>
        <td class="number">
          <div class="right">{{ totalCurrentFormatted }}</div>
          <div class="right">
            <span v-show="calcBankBalanceFormatted > 0">+</span>
            {{ calcBankBalanceFormatted }}
          </div>
          <div class="right">= {{ calcIfSoldAllFormatted }}</div>
        </td>
        <td class="number">
          <div class="right">Sold:</div>
          <div class="right">Bought:</div>
        </td>
        <td class="number">
          <div class="right">{{ totalSoldFormatted }}</div>
          <div class="right">-{{ totalBoughtFormatted }}</div>
          <div class="right">
            = <span :class="balanceColor">{{ calcBankBalanceFormatted }} </span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { DateTime } = require("luxon");
export default {
  name: "CryptoTable",
  props: {},
  data: () => {
    return {
      portFolioTable: [],
      previousPortFolio: {},
    };
  },
  methods: {
    calcPortfolioValues() {
      if (!this.rates) {
        return;
      }
      this.portFolioTable = [];
      // var totalStarting = 0;
      var now = DateTime.now();
      for (var i = 0; i < this.currencies.length; i++) {
        var c = this.currencies[i];
        var startingValue = this.portFolio[c].startingValue;
        var exchangeRate = this.rates[c];
        var startedDate = DateTime.fromISO(this.portFolio[c].startedDate);
        var durationDays = Math.round(
          now.diff(startedDate, "minutes").toObject().minutes / (24 * 60)
        );
        var durationString =
          durationDays > 1 ? durationDays + " days" : durationDays + " day";
        if (exchangeRate) {
          var currentValue = this.portFolio[c].amount / exchangeRate;
          var profit = currentValue - startingValue;
          var color = "";
          if (profit < 0) {
            color = "red--text";
          } else if (profit > 0) {
            color = "green--text";
          }
          var pctProfit = profit / startingValue;
          // var hasChanged = this.previousPortFolio[c] != profit;
          this.previousPortFolio[c] = profit;
          this.portFolioTable.push({
            name: c,
            startingValue: this.formatCurrency(startingValue),
            currentValue: this.formatCurrency(currentValue),
            profit: this.formatCurrency(profit),
            change: this.formatPercent(pctProfit),
            duration: durationString,
            color: color,
          });
        } else {
          this.portFolioTable.push({
            name: c,
            startingValue: this.formatCurrency(startingValue),
            currentValue: "N/A",
            profit: "N/A",
            change: "N/A",
            duration: durationString,
            color: "",
          });
        }
      }
    },
    formatCurrency(value) {
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
    formatPercent(value) {
      return Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      }).format(value);
    },
    getTextColor(index) {
      return "color:" + this.$store.getters.getColor(index);
    },
    clearFileInput() {
      this.$refs.portFolioInput.reset();
    },
    handleNewPortFolio(file) {
      if (!file) {
        return;
      }
      this.$emit("new-port-folio", file);
    },
  },
  mounted() {
    this.calcPortfolioValues();
  },
  computed: {
    totalCurrentFormatted() {
      return this.formatCurrency(this.totalCurrent);
    },
    totalBoughtFormatted() {
      return this.formatCurrency(this.totalPurchased);
    },
    totalSoldFormatted() {
      return this.formatCurrency(this.totalSold);
    },
    totalProfitFormatted() {
      return this.formatCurrency(this.calcProfit);
    },
    totalProfitPctFormatted() {
      if (this.totalCurrent == 0) {
        return this.formatPercent(0);
      }
      return this.formatPercent(this.calcProfit / this.totalCurrent);
    },
    totalInterestFormatted() {
      return this.formatCurrency(this.calcInterest);
    },
    calcProfit() {
      return this.totalCurrent - this.totalStarted;
      //return this.totalSold - this.totalPurchased + this.calcInterest;
    },
    calcInterest() {
      var interest = this.totalCurrent - this.totalPurchased;
      return interest;
    },
    calcBankBalance() {
      return this.totalSold - this.totalPurchased;
    },
    calcBankBalanceFormatted() {
      return this.formatCurrency(this.calcBankBalance);
    },
    calcIfSoldAll() {
      return this.calcBankBalance + this.totalCurrent;
    },
    calcIfSoldAllFormatted() {
      return this.formatCurrency(this.calcIfSoldAll);
    },
    balanceColor() {
      if (this.calcBankBalance < 0) {
        return "red--text";
      } else {
        return "green--text";
      }
    },
    ...mapGetters({
      rates: "getRates",
      portFolio: "getPortFolio",
      totalPurchased: "getTotalPurchased",
      totalSold: "getTotalSold",
      currencies: "getCurrencies",
      totalCurrent: "getTotalCurrent",
      totalStarted: "getTotalStarted",
    }),
  },
  watch: {
    rates: "calcPortfolioValues",
  },
};
</script>

<style>
th,
td {
  padding: 2px 10px 2px 10px;
  border-bottom: 1px solid #ddd;
}
td.number {
  text-align: left;
}
td.label {
  text-align: right;
}
.right {
  text-align: right;
}
.left-button {
  text-align: left;
}
.bold {
  font-weight: bold;
}
.top {
  vertical-align: top;
}
</style>
