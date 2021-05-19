<template>
  <div id="container">
    <ion-grid v-if="marketData">
      <ion-row class="row-header">
        <ion-col size="1" class="coin-icon" @click="sortData('s')">
          <ion-icon
            :icon="sortKey.val ? caretUpOutline : caretDownOutline"
            v-if="sortKey.fld === 's'"
          />
        </ion-col>
        <ion-col size="3" class="col-symbol-header" @click="sortData('s')">
          Symbol
        </ion-col>
        <ion-col size="3" class="col-price-header" @click="sortData('c', true)">
          <ion-icon
            :icon="sortKey.val ? caretUpOutline : caretDownOutline"
            v-if="sortKey.fld === 'c'"
          />
          Price
        </ion-col>
        <ion-col size="3" class="col-price-header" @click="sortData('p', true)">
          <ion-icon
            :icon="sortKey.val ? caretUpOutline : caretDownOutline"
            v-if="sortKey.fld === 'p'"
          />
          $ +/-
        </ion-col>
        <ion-col
          size="2"
          class="col-percentage-header"
          @click="sortData('P', true)"
        >
          <ion-icon
            :icon="sortKey.val ? caretUpOutline : caretDownOutline"
            v-if="sortKey.fld === 'P'"
          />
          %
        </ion-col>
        <!-- <ion-col> Vol </ion-col> -->
      </ion-row>
      <ion-row
        :key="coin"
        v-for="(coin, index) in filteredMarketData"
        :class="' ' + (index === 0 ? 'row-first' : 'row-data')"
      >
        <!-- COL_ICON -->
        <ion-col size="1">
          <img :src="getIcon(coin.s)" class="col-symbol-icon" />
        </ion-col>

        <!-- COL_SYMBOL -->
        <ion-col size="3" class="col-symbol">
          <span class="symbol-main"> {{ getSymbol(coin.s) }}</span>
          <span class="symbol-base"> {{ getBaseSymbol(coin.s) }}</span>
          <div class="coin-vol">
            {{ getVolume(coin.q) }}
          </div>
        </ion-col>

        <!-- COL_PRICE -->
        <ion-col size="3" class="col-price">
          ${{ getPriceNoZero(coin.c) }}
        </ion-col>

        <!-- COL_PRICE_CHANGE -->
        <ion-col
          size="3"
          :class="
            'col-price ' + (coin.p && coin.p.startsWith('-') ? 'minus' : 'plus')
          "
        >
          {{ coin.p && coin.p.startsWith("-") ? "" : "+" }}
          {{ getPriceNoZero(coin.p) }}
        </ion-col>

        <!-- COL_PRICE_CHANGE_PERCENTAGE -->
        <ion-col size="2" :class="priceChange(coin.P) + ' col-percentage'">
          <span>
            {{ Number(coin.P).toFixed(2) }}
          </span>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script>
import { BinanceAPI } from "@/services/binanceapi";
import { IonRow, IonCol, IonGrid, IonIcon } from "@ionic/vue";
import { caretUpOutline, caretDownOutline } from "ionicons/icons";

import { ref, watch } from "vue";
const { API } = BinanceAPI();
export default {
  name: "Market",
  props: {
    name: String,
    data: Array,
    baseCoin: String,
  },
  components: { IonRow, IonCol, IonGrid, IonIcon },
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    console.clear();
    const marketData = ref([]);
    const filteredMarketData = ref([]);
    const icons = { caretUpOutline, caretDownOutline };
    let sortKey = { fld: "", val: false };
    let baseCurrency = "USDT";

    watch(
      () => props.baseCoin,
      (first, second) => {
        console.log(
          "Watch props.selected function called with args:",
          first,
          second
        );
        baseCurrency = first;
        baseCoinChanged();
      }
    );

    function baseCoinChanged() {
      marketData.value = [];
      filteredMarketData.value = [];
      start();
    }

    // eslint-disable-next-line no-unused-vars
    function sortData(fld, isNum) {
      console.log("sort");
      filteredMarketData.value.sort(function (a, b) {
        let alc, blc;
        if (isNum) {
          (alc = Number(a[fld])), (blc = Number(b[fld]));
        } else {
          (alc = a[fld].toLowerCase()), (blc = b[fld].toLowerCase());
        }
        if (sortKey.val) {
          return alc > blc ? 1 : alc < blc ? -1 : 0;
        } else {
          return alc > blc ? -1 : alc < blc ? 1 : 0;
        }
      });
      sortKey.val = !sortKey.val;
      sortKey.fld = fld;

      //console.log(filteredMarketData.value);
    }

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

    const formatNumber = (n) => {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };

    function getPriceNoZero(price) {
      let num = Number(price);
      let numstr = num.toString();
      // return numberWithCommas(Number(numstr));
      return numstr;
    }

    // function numberWithCommas(x) {
    //   // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //   return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    // }

    function getVolume(price) {
      let num = Number(price);
      return formatNumber(num);
    }

    function receiveData(data) {
      marketData.value = data;

      if (filteredMarketData.value.length > 0) {
        for (let index = 0; index < filteredMarketData.value.length; index++) {
          const coin = filteredMarketData.value[index];
          const dataCoin = data.find((dc) => dc.s === coin.s);
          if (dataCoin) {
            coin["s"] = dataCoin["s"];
            coin["c"] = dataCoin["c"];
            coin["q"] = dataCoin["q"];
            coin["p"] = dataCoin["p"];
            coin["P"] = dataCoin["P"];
          }
        }
      } else {
        filteredMarketData.value = filterData(baseCurrency);
      }
    }

    // eslint-disable-next-line no-unused-vars
    function callapi() {
      API.get("ticker").then((res) => {
        // marketData.value = res;
        // filteredMarketData.value = filterData(baseCurrency);
        console.log(marketData.value);
        receiveData(res);
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
          // marketData.value = JSON.parse(event.data);
          // filteredMarketData.value = filterData(baseCurrency);
          receiveData(JSON.parse(event.data));

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
        }
        socket = null;
        console.log("re establising connection..");
        setTimeout(callwebsocket, 5000);
      };

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      };
    }

    //callapi();
    //callwebsocket();

    function start() {
      let dev = true;
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
      sortData,
      sortKey,
      ...icons,
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



    
  

