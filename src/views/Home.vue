<template>
  <div @dragover="dragOverHandler">
    <v-app-bar dense flat app color="gray">
      <div class="d-flex align-center">
        <v-img
          alt="Crypto Check Logo"
          class="shrink mr-2"
          contain
          src="../assets/logo.png"
          transition="scale-transition"
          width="30"
        />
        <v-toolbar-title>Crypto Check</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="refresh" class="primary mr-2">
        <span>Refresh</span>
      </v-btn>
      <v-btn @click="fetchHistory" class="primary mr-2">
        <span>30 days</span>
      </v-btn>
      <v-btn @click="clearStorage" class="primary">
        <span>Clear Storage</span>
      </v-btn>
    </v-app-bar>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-tabs left v-model="tab">
            <v-tab key="0">Earnings</v-tab>
            <v-tab key="1">Transactions</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="0">
              <div class="pb-2">
                <CryptoTable
                  ref="cryptoTable"
                  @new-port-folio="handleNewPortFolio"
                />
              </div>
              <div><CryptoPlot show="Earnings" plotId="earningsPlot" /></div
            ></v-tab-item>
            <v-tab-item :key="1">
              <div class="pb-2">
                <CryptoSummary ref="cryptoSummary" />
              </div>
              <div>
                <CryptoPlot
                  show="Transactions"
                  plotId="transactionsPlot"
                /></div
            ></v-tab-item>
          </v-tabs-items>
        </v-col>
        <!-- <v-col v-show="fileDragging">
          <div @drop="handleFileDrop" max-width="500px">
            <v-card height="500px" class="primary">
              <v-container fill-height>
                <v-card-text>
                  <div class="d-flex justify-center title">
                    Drop portfolio here
                  </div>
                  <div class="d-flex justify-center">
                    <v-icon x-large>mdi-upload</v-icon>
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
          </div>
        </v-col> -->
        <v-col cols="12" md="6">
          <CryptoPlot show="All" plotId="allPlot" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CryptoTable from "@/components/CryptoTable.vue";
import CryptoPlot from "@/components/CryptoPlot.vue";
import CryptoSummary from "@/components/CryptoSummary.vue";
import { mapGetters } from "vuex";
const { DateTime } = require("luxon");

export default {
  name: "Home",
  components: {
    CryptoTable,
    CryptoPlot,
    CryptoSummary,
  },
  data() {
    return {
      apiExchangeUrl: "https://api.coinbase.com/v2/exchange-rates",
      apiHistoryUrlPart1: "https://api.coinbase.com/v2/prices/",
      apiHistoryUrlPart2: "/spot",
      fileDragging: false,
      tab: 0,
    };
  },
  methods: {
    refresh() {
      this.$store.commit("initFromStorage");
      this.axios
        .get(this.apiExchangeUrl, {
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
    fetchHistory() {
      this.clearStorage();
      var howFar = 30;
      //last 30 days
      var last30DaysDates = [];
      for (let i = howFar; i >= 1; i--) {
        var now = DateTime.now();
        var dayBefore = now.minus({ days: i });
        last30DaysDates.push(dayBefore.toISODate());
      }
      this.$store.commit("updateHistoryTimes", last30DaysDates);
      var queries = [];
      for (let j = 0; j < last30DaysDates.length; j++) {
        for (let i = 0; i < this.currencies.length; i++) {
          var key = this.currencies[i];
          var query = this.axios.get(
            this.apiHistoryUrlPart1 + key + "-USD" + this.apiHistoryUrlPart2,
            { params: { date: last30DaysDates[j] } }
          );
          queries.push(query);
        }
      }
      this.axios
        .all(queries)
        .then((results) => {
          //now have values sorted by date
          var rates = {};
          var currentDate = null;
          for (let i = 0; i < results.length; i++) {
            var result = results[i];
            var date = result.request.responseURL.split("date=")[1];
            if (!currentDate) {
              currentDate = date;
            }
            if (currentDate != date) {
              //commit and reset rates
              let dateTime = date + " 08:08:08";
              this.$store.commit("appendCrypto", {
                date: dateTime,
                rates: rates,
              });
              currentDate = date;
              rates = {};
            }
            var currency = result.data.data.base;
            var rate = 1 / result.data.data.amount;
            rates[currency] = rate;
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
    clearStorage() {
      this.$store.commit("clearStorage");
    },
    dragOverHandler(ev) {
      ev.preventDefault();
      this.fileDragging = true;
    },
    handleFileDrop(ev) {
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
      this.fileDragging = false;
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === "file") {
            var file = ev.dataTransfer.items[i].getAsFile();
            this.handleNewPortFolio(file);
            break;
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
          this.handleNewPortFolio(file);
          break;
        }
      }
    },
    validateJson(content) {
      var valid = true;
      valid &= content.length > 1;
      valid &= content.indexOf("script") == -1;
      valid &= content.indexOf("__") == -1;
      valid &= content.indexOf("\\") == -1;
      valid &= content.indexOf("portFolio") > -1;
      valid &= content.indexOf("totalPurchased") > -1;
      valid &= content.indexOf("totalSold") > -1;
      return valid;
    },
    handleNewPortFolio(file) {
      if (!file) {
        return;
      }
      var fr = new FileReader();
      fr.onload = (e) => {
        const content = e.target.result;
        this.handleNewPortFolioContent(content);
        this.$refs.cryptoTable.clearFileInput();
      };
      fr.readAsText(file);
    },
    handleNewPortFolioContent(content) {
      if (!content) {
        this.$refs.cryptoTable.clearFileInput();
        return;
      }
      if (!this.validateJson(content)) {
        this.$refs.cryptoTable.clearFileInput();
        return;
      }
      const result = JSON.parse(content);
      this.$store.commit("updatePortFolio", result);
    },
    portFolioFromUrl() {
      var url = this.$route.query.portFolio;
      if (!url) {
        return;
      }
      this.axios
        .get(url, {
          params: {},
        })
        .then((response) => {
          this.handleNewPortFolioContent(response.data);
        })
        .catch((error) => {
          alert(error);
        });
    },
  },
  mounted() {
    if (this.$route.query.portFolio) {
      this.portFolioFromUrl();
    } else {
      this.refresh();
    }
    setInterval(this.refresh, 600000);
  },
  computed: {
    portFolio() {
      return this.$store.getters.getPortFolio;
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
    portFolio: "refresh",
  },
};
</script>
