<template>
  <div>
    <table>
      <tr>
        <th>Crypto</th>
        <th>1 Week</th>
        <th>1 Month</th>
        <th>1 Year</th>
        <th>All</th>
      </tr>
      <tr v-for="(row, index) in this.transactionTable" :key="index">
        <td class="label" :style="getTextColor(index)">
          <b>{{ row.name }}</b>
        </td>
        <td class="number">
          <span :style="getTextColor(0)">{{ row.weekBought }}</span
          >/<span :style="getTextColor(1)">{{ row.weekSold }}</span>
        </td>
        <td class="number">
          <span :style="getTextColor(0)">{{ row.monthBought }}</span
          >/<span :style="getTextColor(1)">{{ row.monthSold }}</span>
        </td>
        <td class="number">
          <span :style="getTextColor(0)">{{ row.yearBought }}</span
          >/<span :style="getTextColor(1)">{{ row.yearSold }}</span>
        </td>
        <td class="number">
          <span :style="getTextColor(0)">{{ row.allBought }}</span
          >/<span :style="getTextColor(1)">{{ row.allSold }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const { DateTime } = require("luxon");
export default {
  name: "CryptoSummary",
  props: {},
  data: () => {
    return {
      transactionTable: [],
    };
  },
  methods: {
    calcTransactionValues() {
      if (!this.boughtTransactions) {
        return;
      }
      this.transactionTable = [];
      var week = DateTime.now().minus({ days: 7 });
      var month = DateTime.now().minus({ months: 1 });
      var year = DateTime.now().minus({ year: 1 });
      for (var i = 0; i < this.currencies.length; i++) {
        var c = this.currencies[i];
        var row = { name: c };
        var valueBoughtOverTime = this.boughtTransactions.filter(
          (b) => b.currency == c
        );
        var valueSoldOverTime = this.soldTransactions.filter(
          (b) => b.currency == c
        );
        var weekValueBought = 0;
        var monthValueBought = 0;
        var yearValueBought = 0;
        var allValueBought = 0;
        var weekValueSold = 0;
        var monthValueSold = 0;
        var yearValueSold = 0;
        var allValueSold = 0;
        for (let j = 0; j < valueBoughtOverTime.length; j++) {
          let current = valueBoughtOverTime[j];
          let currentDate = DateTime.fromISO(current.date);
          if (week <= currentDate) {
            weekValueBought += current.amount;
          }
          if (month <= currentDate) {
            monthValueBought += current.amount;
          }
          if (year <= currentDate) {
            yearValueBought += current.amount;
          }
          allValueBought += current.amount;
        }
        for (let j = 0; j < valueSoldOverTime.length; j++) {
          let current = valueSoldOverTime[j];
          let currentDate = DateTime.fromISO(current.date);
          if (week <= currentDate) {
            weekValueSold += current.amount;
          }
          if (month <= currentDate) {
            monthValueSold += current.amount;
          }
          if (year <= currentDate) {
            yearValueSold += current.amount;
          }
          allValueSold += current.amount;
        }
        row.weekBought = this.formatCurrency(weekValueBought);
        row.weekSold = this.formatCurrency(weekValueSold);
        row.monthBought = this.formatCurrency(monthValueBought);
        row.monthSold = this.formatCurrency(monthValueSold);
        row.yearBought = this.formatCurrency(yearValueBought);
        row.yearSold = this.formatCurrency(yearValueSold);
        row.allBought = this.formatCurrency(allValueBought);
        row.allSold = this.formatCurrency(allValueSold);
        this.transactionTable.push(row);
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
  },
  mounted() {
    this.calcTransactionValues();
  },
  computed: {
    ...mapGetters({
      currencies: "getCurrencies",
      boughtTransactions: "getBoughtTransactions",
      soldTransactions: "getSoldTransactions",
    }),
  },
  watch: {
    boughtTransactions: "calcTransactionValues",
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
