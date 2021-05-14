<template>
  <div :id="plotId"></div>
</template>

<script>
import Plotly from "plotly.js-dist";
import { mapGetters } from "vuex";
export default {
  name: "CryptoPlot",
  props: {
    show: String,
    plotId: String,
  },
  data: () => {
    return {
      plotlyConfig: {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          "sendDataToCloud",
          "editInChartStudio",
          "select2d",
          "lasso2d",
          "hoverClosestCartesian",
          "hoverCompareCartesian",
          "toggleSpikelines",
          "autoScale2d",
        ],
        responsive: true,
      },
    };
  },
  methods: {
    updatePlot() {
      var traceDataLayout = {};
      if (this.showAll) {
        traceDataLayout = this.getAllTraceDataLayout();
      } else {
        traceDataLayout = this.getEarningsTraceDataLayout();
        Plotly.react(this.plotId, [], traceDataLayout.layout); //force achange detection in Plotly data
      }
      Plotly.react(this.plotId, traceDataLayout.data, traceDataLayout.layout);
    },
    getAllTraceDataLayout() {
      var data = [];
      var annotations = [];
      var odd = true;
      for (var i = 0; i < this.currencies.length; i++) {
        var key = this.currencies[i];
        var value = this.cryptoValues[key];
        if (!value) {
          continue;
        }
        var trace = {
          type: "scattergl",
          x: this.timeline,
          y: value,
          name: key,
          yaxis: "y" + (data.length == 0 ? "" : data.length + 1),
          xaxis: "x" + (odd ? "" : "2"),
        };
        var startValue = value && value[0] ? value[0] : 0;
        var endValue =
          value && value[value.length - 1] ? value[value.length - 1] : 0;
        var pctDiff = (endValue - startValue) / startValue;
        var middleY = (Math.max(...trace.y) + Math.min(...trace.y)) / 2;
        annotations.push({
          text: this.formatPercent(pctDiff),
          showarrow: false,
          xref: trace.xaxis,
          yref: trace.yaxis,
          x: trace.x[Math.floor(trace.x.length * 0.95)],
          y: middleY,
          bgcolor: "#FFFFFF",
        });
        odd = !odd;
        data.push(trace);
      }
      var rowGroupCount = Math.ceil(data.length / 2);
      var layout = {
        grid: { rows: rowGroupCount, columns: 2, ygap: 0.1 },
        height: window.innerHeight * 0.9,
        autosize: true,
        margin: {
          t: 20,
          r: 5,
        },
        showlegend: false,
        annotations: annotations,
      };
      var subplots = [];
      for (i = 0; i < rowGroupCount; i++) {
        subplots.push([]);
      }
      var counter = 0;
      for (i = 0; i < data.length; i = i + 2) {
        var dataLeft = data[i];
        var dataRight = data[i + 1];
        var groupLeft = null;
        var groupRight = null;
        if (dataLeft) {
          groupLeft = data[i].xaxis + data[i].yaxis;
        }
        if (dataRight) {
          groupRight = data[i + 1].xaxis + data[i + 1].yaxis;
        }
        subplots[counter] = [groupLeft, groupRight];
        counter++;
      }
      for (i = 1; i <= data.length; i++) {
        var title = "";
        if (i - 1 < this.currencies.length) {
          title = this.currencies[i - 1];
        }
        layout["yaxis" + i] = {
          tickformat: "$,.2f",
          title: title,
          //   rangemode: "tozero",
        };
      }
      layout.grid.subplots = subplots;
      //   layout.grid.subplots = [
      //     ["xy", "x2y2"],
      //     ["xy3", "x2y4"],
      //     ["xy5", "x2y6"],
      //     ["xy7", "x2y8"],
      //     ["xy9", "x2y10"],
      //   ];
      //   var toprint = data.map((d) => d.xaxis + d.yaxis);
      //   console.log(toprint, subplots);
      return { data: data, layout: layout };
    },
    getEarningsTraceDataLayout() {
      var data = [];
      var earningTrace = {
        type: "scattergl",
        x: this.timeline,
        y: this.earnings,
        name: "Earnings",
      };
      for (var i = 0; i < this.currencies.length; i++) {
        var key = this.currencies[i];
        var trace = {
          //   stackgroup: "one",
          x: this.timeline,
          y: this.portFolioOverTime[key],
          name: key,
        };
        data.push(trace);
      }
      data.push(earningTrace);
      var annotations = [];
      annotations.push({
        text: "Earnings",
        showarrow: false,
        xref: "x",
        yref: "y",
        x: earningTrace.x[0],
        ax: 100,
        y: earningTrace.y[0],
        font: {
          color: this.$store.getters.getColor(data.length - 1),
        },
        bgcolor: "#FFFFFF",
      });

      var layout = {
        height: window.innerHeight / 2,
        autosize: true,
        margin: {
          t: 40,
          r: 5,
        },
        showlegend: false,
        title: "Earnings",
        yaxis: {
          tickformat: "$,.2f",
          rangemode: "tozero",
        },
        annotations: annotations,
      };
      return { data: data, layout: layout };
    },
    formatPercent(value) {
      return Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      }).format(value);
    },
  },
  computed: {
    ...mapGetters({
      cryptoValues: "getCryptoValues",
      portFolio: "getPortFolio",
      timeline: "getTimeline",
      currencies: "getCurrencies",
      earnings: "getEarnings",
      totalPurchased: "getTotalPurchased",
      portFolioOverTime: "getPortFolioOverTime",
    }),
    showAll() {
      return this.show == "All";
    },
  },
  watch: {
    timeline: "updatePlot",
  },
  mounted() {
    var traceDataLayout = {};
    if (this.showAll) {
      traceDataLayout = this.getAllTraceDataLayout();
    } else {
      traceDataLayout = this.getEarningsTraceDataLayout();
    }
    Plotly.plot(
      this.plotId,
      traceDataLayout.data,
      traceDataLayout.layout,
      this.plotlyConfig
    );
  },
};
</script>
