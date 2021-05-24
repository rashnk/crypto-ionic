<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script  >
import {
  IonApp,
  IonRouterOutlet,
  useBackButton,
  useIonRouter,
  // isPlatform,
  getPlatforms,
} from "@ionic/vue";
import {
  defineComponent,
  onMounted,
  provide,
  getCurrentInstance,
  reactive,
} from "vue";
import { Plugins } from "@capacitor/core";
import { BinanceAPI } from "@/services/binanceapi";
const { API } = BinanceAPI();
const { App } = Plugins;

console.log(getPlatforms());

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const ionRouter = useIonRouter();
    const instance = getCurrentInstance();
    const marketData = reactive({ value: [] });
    const global = instance.appContext.config.globalProperties;
    let ws;

    useBackButton(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    });

    provide("marketData", marketData);

    // function receiveData(data) {
    //   marketData.value = data;
    //   console.log("receive data", marketData);
    // }

    function receiveData(data) {
      //marketData.value = data;
      console.log("debounce");
      if (marketData.value.length > 0) {
        console.log("receive data");
        for (let index = 0; index < marketData.value.length; index++) {
          const coin = marketData.value[index];
          const dataCoin = data.find((dc) => dc.s === coin.s);
          if (dataCoin) {
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
      }
      //console.log("marketData.value", marketData.value);
      debounce = true;
      setTimeout(() => {
        debounce = false;
      }, 5000);
    }

    let debounce = false;

    function initWebSocket() {
      API.socket("!ticker@arr").then((wsocket) => {
        console.log(ws);
        ws = wsocket;

        ws.onopen = function () {
          console.log("[open] Connection established");
          console.log("Sending to server");
        };

        ws.onmessage = function (event) {
          if (
            event &&
            event.data &&
            event.data.startsWith("[") &&
            event.data.endsWith("]")
          ) {
            console.log("ws.onmessage:");

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
        ws.onclose = function (event) {
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
          setTimeout(ws, 5000);
        };

        ws.onerror = function (error) {
          console.log(`[error] ${error.message}`);
        };
      });
    }

    function initAPI() {
      API.get("ticker").then((res) => {
        receiveData(res);
      });
    }

    function start() {
      //showLoading.value = true;
      if (global.$prodMode) {
        initWebSocket();
      } else {
        initAPI();
      }
    }

    onMounted(() => {
      start();
    });
    return { marketData };
  },
});
</script>