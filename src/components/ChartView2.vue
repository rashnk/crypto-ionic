<template>
  <ion-header>
    <ion-toolbar v-if="header">
      <ion-title> Coin Details </ion-title>
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
    showHeader: Boolean,
  },
  emits: ["closeModal"],
  setup(props, { emit }) {
    const header = ref(props.showHeader);
    const chartTheme = ref('light');
    function initChart() {
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        autosize: false,
        width: screen.width,
        height: document.documentElement.clientHeight - 60,
        symbol: `BINANCE:${props.coin.s}`,
        interval: "15",
        timezone: "Asia/Kolkata",
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
      let externalScript = "";

      externalScript = document.getElementById("tv_script_1");
      if (externalScript) {
        // loaded
        console.log(externalScript);
        initChart();
      } else {
        externalScript = document.createElement("script");
        externalScript.setAttribute("src", "https://s3.tradingview.com/tv.js");
        externalScript.setAttribute("id", "tv_script_1");
        document.head.appendChild(externalScript);

        externalScript.addEventListener("load", function () {
          console.log(externalScript);
          initChart();
        });
      }
      //setTimeout(() => {}, 1500);
    });
    return { dismissModal, header };
  },
};
</script>

<!-- TradingView Widget END -->

<style>
</style>
