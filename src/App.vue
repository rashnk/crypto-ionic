<template>
  <ion-app>
    <ion-router-outlet />

    <ion-toast :is-open="toastRef.p1.state" :message="toastRef.p1.data.message" :duration="toastRef.p1.duration"
      @didDismiss="toastOpen('p1', false)">
    </ion-toast>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonRouterOutlet,
  useBackButton,
  useIonRouter,
  IonToast,
  // isPlatform,
  getPlatforms,
} from "@ionic/vue";

import {
  defineComponent,
  onMounted,
  provide,
  getCurrentInstance,
  reactive,
  ref,
} from "vue";
import { App } from "@capacitor/app";


import { Network } from "@capacitor/network";

import { BinanceAPI } from "@/services/binanceapi";
import { initializeAdmob, loadBannerAd } from "@/services/ads"


console.log(getPlatforms());
const { API } = BinanceAPI();
export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonToast,
  },
  setup() {
    const ionRouter = useIonRouter();
    const instance: any = getCurrentInstance();
    const marketData: any = reactive({ value: [] });
    const settings = reactive({});
    const network = reactive({ connected: false });
    const global = instance.appContext.config.globalProperties;
    let ws: any;
    let debounce = false;
    let debounceInterval = 3000;

    const toastRef: any = ref({
      p1: {
        state: false,
        duration: 2000,
        data: { message: "" },
      },
    });

    const toastOpen = (toast: string, state: boolean) => {
      toastRef.value[toast].state = state;
    };

    useBackButton(-1, () => {
      console.log('last',ionRouter.canGoBack())
      if (!ionRouter.canGoBack()) {
       
        App.exitApp();
      }
    });

    provide("marketData", marketData);
    provide("network", network);
    provide("settings", settings);

    Network.addListener("networkStatusChange", (status) => {
      console.log("Network status changed", status);
      network.connected = status.connected;
      if (!network.connected) {
        console.log("Network changed", network.connected);
        toastRef.value.p1.data.message = "Not connected to internet";
        toastOpen("p1", true);
      }
    });

    function receiveData(data: any[]) {
      //marketData.value = data;
      //console.log("debounce");
      if (marketData.value.length > 0) {
        //console.log("receive data");
        for (let index = 0; index < marketData.value.length; index++) {
          const coin: any = marketData.value[index];
          const dataCoin = data.find((dc) => dc.s === coin.s);
          if (dataCoin) {
            let price = Number(dataCoin["c"]);
            let prevPrice = Number(coin["c"]);
            coin["color"] = price >= prevPrice ? "plus" : "minus"; //show color based on previous val

            // update the data from new socket message data
            coin["s"] = dataCoin["s"]; //symbol
            coin["c"] = dataCoin["c"]; //price
            coin["q"] = dataCoin["q"]; //voulme
            coin["p"] = dataCoin["p"]; //price change
            coin["P"] = dataCoin["P"]; //percentage change
          }
        }
      } else {
        // filteredMarketData.value = filterData(baseCoin.value);
        marketData.value = data;
        localStorage.setItem("marketData", JSON.stringify(marketData.value));
      }
      //console.log("marketData.value", marketData.value);
      debounce = true;
      setTimeout(() => {
        debounce = false;
      }, debounceInterval);
    }
    function loadAds() {
      initializeAdmob(global.$testAds)
    }

    function initWebSocket(): any {
      API.socket("!ticker@arr").then((wsocket) => {
        //console.log(ws);
        ws = wsocket;

        ws.onopen = function () {
          console.log("[open] Connection established");
          console.log("Sending to server");
        };

        ws.onmessage = function (event: any) {
          if (
            event &&
            event.data &&
            event.data.startsWith("[") &&
            event.data.endsWith("]")
          ) {
            //console.log("ws.onmessage:");

            if (debounce) {
              //console.log("wait 5 sec");
            } else {
              //console.log("debounce completed");
              receiveData(JSON.parse(event.data));
            }
          } else {
            console.log("not json");
          }
        };
        ws.onclose = function (event: any) {
          if (event.wasClean) {
            console.log(
              `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log("[close] Connection died");
          }
          ws = null;
          console.log("re establising connection..");
          setTimeout(initWebSocket(), 2000);
        };

        ws.onerror = function (error: { message: any; }) {
          console.log(`[error] ${error.message}`);
        };
      });
    }

    function initAPI() {
      API.get("ticker").then((res) => {
        receiveData(res);
      });
    }

    function loadData() {
      let md = localStorage.getItem("marketData");
      if (md) {
        // load data stored from previous session, even if no internet
        receiveData(JSON.parse(md));

        ///hide splash-screen


        // try calling websocket
        if (global.$prodMode) {
          initWebSocket();
        }
      } else {
        // no data stored in previous session

        ///hide splash-screen

        if (global.$prodMode) {
          initWebSocket();
        } else {
          initAPI();
        }
      }
    }

    onMounted(() => {
      Network.getStatus().then((conn) => {
        console.log("connection status", conn);
        network.connected = conn.connected;
        if (!network.connected) {
          toastRef.value.p1.data.message = "Not connected to internet";
          toastOpen("p1", true);
        }
        loadData();
      });
      loadAds()
    });
    return { marketData, toastRef, toastOpen };
  },
});
</script>