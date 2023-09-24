<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Coin Details</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <div class="no-padding">
    <div class="tradingview-widget-container">
      <div id="tradingview_86161"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://in.tradingview.com/symbols/ADAUSDT/?exchange=BINANCE" rel="noopener" target="_blank"><span
            class="blue-text">ADAUSDT Rates</span></a>
        by TradingView
      </div>
    </div>
  </div>
</template>

  
<script lang="ts">

import {
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButton,
} from "@ionic/vue";
 
import { onMounted } from "vue";
export default {
  name: "ChartView",
  components: {
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButton,
  },
  setup() {
    function initChart() {
      // eslint-disable-next-line no-undef
      new TradingView.MediumWidget({
        symbols: [["BINANCE:ADAUSDT|12M"]],
        style: 1,
        chartOnly: false,
        width: "100%",
        height: "100%",
        locale: "in",
        colorTheme: "light",
        gridLineColor: "rgba(240, 243, 250, 0)",
        trendLineColor: "rgba(33, 150, 243, 1)",
        fontColor: "#787B86",
        underLineColor: "rgba(33, 150, 243, 0.3)",
        underLineBottomColor: "rgba(33, 150, 243, 0.0)",
        isTransparent: false,
        autosize: true,
        container_id: "tradingview_86161",
      });
    }
    onMounted(() => {
      let externalScript = document.createElement("script");
      externalScript.setAttribute("src", "https://s3.tradingview.com/tv.js");
      document.head.appendChild(externalScript);
      setTimeout(() => {
        initChart();
      }, 1500);
    });
    return {};
  },
};
</script>

<!-- TradingView Widget END -->

<style></style>
