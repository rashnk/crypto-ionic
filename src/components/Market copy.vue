<template>
  <div id="container">
    <ion-grid v-if="marketData">
      <ion-row class="row-header">
        <ion-col size="1" class="coin-icon"> </ion-col>
        <ion-col size="3" class="col-symbol-header"> Symbol </ion-col>
        <ion-col size="3" class="col-price-header"> Price </ion-col>
        <ion-col size="3" class="col-price-header"> Chg($) </ion-col>
        <ion-col size="2" class="col-percentage-header"> Chg(%) </ion-col>
        <!-- <ion-col> Vol </ion-col> -->
      </ion-row>
      <ion-row
        :key="coin"
        v-for="(coin, index) in filteredMarketData"
        :class="' ' + (index === 0 ? 'row-first' : 'row-data')"
      >
        <ion-col size="1">
          <img :src="getIcon(coin.s)" class="col-symbol-icon" />
        </ion-col>
        <ion-col size="3" class="col-symbol">
          <span class="symbol-main"> {{ getSymbol(coin.s) }}</span>
          <span class="symbol-base"> {{ getBaseSymbol(coin.s) }}</span>
          <div class="coin-vol">
            {{ getVolume(coin.q) }}
          </div>
        </ion-col>

        <ion-col size="3" class="col-price">
          ${{ getPriceNoZero(coin.c) }}
        </ion-col>
        <!-- + (coin.p.startsWith('-')?'minus':'plus') -->
        <ion-col
          size="3"
          :class="
            'col-price ' + (coin.p && coin.p.startsWith('-') ? 'minus' : 'plus')
          "
        >
          {{ coin.p && coin.p.startsWith("-") ? "" : "+" }}
          {{ getPriceNoZero(coin.p) }}
        </ion-col>

        <ion-col size="2" :class="priceChange(coin.P) + ' col-percentage'">
          <span>
            {{ coin.P }}
          </span>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script>
import { BinanceAPI } from "@/services/binanceapi";
import { IonRow, IonCol, IonGrid } from "@ionic/vue";

import { ref } from "vue";
const { API } = BinanceAPI();
export default {
  name: "Market",
  props: {
    name: String,
    data: Array,
  },
  components: { IonRow, IonCol, IonGrid },
  setup() {
    console.clear();
    const marketData = ref([]);
    const filteredMarketData = ref([]);
    let baseCurrency = "USDT";
    function getIcon(sym) {
      let icon = sym.replace(baseCurrency, "").toLowerCase();
      // return `https://media.wazirx.com/media/${icon}/84.png`;
      let path = "";
      try {
        path = require(`@/assets/icons/color/${icon}.png`);
        return path;
      } catch {
        return (path = "");
      }
    }
    function priceChange(price) {
      if (Number(price) > 0) {
        return "color-green";
      } else {
        return "color-red";
      }
    }

    function getSymbol(sym) {
      return sym.replace(baseCurrency, "");
    }
    function getBaseSymbol() {
      return `/${baseCurrency}`;
    }

    function filterData(sym) {
      //console.log(sym, marketData.value);
      return marketData.value.filter((m) => m.s.endsWith(sym));
    }

    const formatCash = (n) => {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };

    function getPriceNoZero(price) {
      let num = Number(price);
      let numstr = num.toString();
      return numberWithCommas(Number(numstr));
    }

    function numberWithCommas(x) {
      // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    function getVolume(price) {
      let num = Number(price);
      return formatCash(num);
    }

    // eslint-disable-next-line no-unused-vars
    function callapi() {
      API.get("ticker").then((res) => {
        marketData.value = res;
        filteredMarketData.value = filterData(baseCurrency);
        //console.log(marketData.value);
      });
    }

    // eslint-disable-next-line no-unused-vars
    function callwebsocket() {
      let socket = new WebSocket(
        "wss://stream.binance.com:9443/ws/!ticker@arr"
      );

      // eslint-disable-next-line no-unused-vars
      socket.onopen = function (e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        //socket.send("My name is John");
      };

      socket.onmessage = function (event) {
        //console.log(typeof event);
        //console.log(event.data);
        if (
          event &&
          event.data &&
          event.data.startsWith("[") &&
          event.data.endsWith("]")
        ) {
          // if(event){
          marketData.value = JSON.parse(event.data);
          filteredMarketData.value = filterData(baseCurrency);

          // close connection to copy json from console
          //socket.close();
        } else {
          console.log("not json");
        }
      };

      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          );
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log("[close] Connection died");
          socket = null;
          setTimeout(callwebsocket, 5000);
        }
      };

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      };
    }

    //callapi();
    //callwebsocket();

    function start() {
      let dev = false;
      if (dev) {
        callapi();
      } else {
        callwebsocket();
      }
    }
    start();

    return {
      marketData,
      filteredMarketData,
      priceChange,
      getIcon,
      getSymbol,
      getBaseSymbol,
      getPriceNoZero,
      getVolume,
    };
  },
};
</script>
<style>
ion-content {
  font-size: 0.8rem;
}
ion-row {
  border: 1px solid #f8f8f8;
  margin-right: 2px;
}
ion-col {
  margin: auto;
}
ion-row.row-first {
  padding-top: 30px;
}
ion-row.row-data {
  padding-top: 6px;
  padding-bottom: 6px;
}
ion-col.bg-red {
  background: red;
}
ion-col.col-percentage {
  border-radius: 5px;
}
ion-col.bg-green {
  background: rgb(65, 216, 65);
}
ion-col.color-red {
  color: white;
  background: red;
}
ion-col.color-green {
  color: white;
  background: #06b306;
}
ion-col.col-price.minus {
  color: red;
}
ion-col.col-price.plus {
  color: green;
}
ion-grid {
  padding: 0;
}
.row-header {
  background: #f5f6f9;
  font-size: 0.9rem;
  position: fixed;
  width: 100%;
  z-index: 999999;
  height: 30px;
}
.col-symbol {
  font-weight: bold;
}
.row-header ion-col {
  border-right: 1px solid rgb(228, 225, 225);
}
.row-header ion-col.coin-icon {
  border-right: 0px solid rgb(192, 191, 191);
}

.col-symbol-header {
  font-weight: bold;
  border-right: 1px solid grey;
}
.symbol-main {
  font-weight: bold;
  font-size: 0.9rem;
}
.symbol-base {
  font-size: 0.6rem;
  color: grey;
}
.col-symbol-icon {
  height: 20px;
  width: 20px;
}
.col-price,
.col-price-header {
  text-align: right;
}
.col-percentage,
.col-price {
  font-size: 0.9rem;
  /* padding-top: 10px; */
}
.col-percentage-header,
.col-percentage {
  text-align: center;
}
.coin-vol {
  font-size: 0.6rem;
  color: slategray;
}
</style>
