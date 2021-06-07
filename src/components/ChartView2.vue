<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Coin Details</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="no-padding">
    <div class="tradingview-widget-container">
      <div id="tradingview_chart"></div>
      <!-- <div class="tradingview-widget-copyright">
        <a
          href="https://in.tradingview.com/symbols/ADAUSDT/?exchange=BINANCE"
          rel="noopener"
          target="_blank"
          >
          <span class="blue-text"></span></a > by TradingView
      </div> -->
    </div>
  </ion-content>
</template>

<script>
import { onMounted, ref } from "vue";
import {
  IonButtons,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonButton,
} from "@ionic/vue";
export default {
  name: "ChartView2",
  components: {
    IonButtons,
    IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    IonButton,
  },
  props: {
    coin: Object,
  },
  emits: ["closeModal"],
  setup(props, { emit }) {
    const chartTheme = ref();
    function initChart() {
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        autosize: false,
        width: screen.width,
        height: screen.height - 60,
        symbol: `BINANCE:${props.coin.s}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: chartTheme.value,
        style: "1",
        locale: "in",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        save_image: false,
        container_id: "tradingview_chart",
      });
    }

    function dismissModal() {
      emit("closeModal");
      //console.log("closeModal");
    }

    function loadTheme() {
      const theme = localStorage.getItem("theme");
      if (theme) {
        chartTheme.value = theme;
      }
    }

    onMounted(() => {
      loadTheme();

      let externalScript = document.createElement("script");
      externalScript.setAttribute("src", "https://s3.tradingview.com/tv.js");
      document.head.appendChild(externalScript);
      setTimeout(() => {
        initChart();
      }, 1500);
    });
    return { dismissModal };
  },
};
</script>

<!-- TradingView Widget END -->

<style>
</style>
