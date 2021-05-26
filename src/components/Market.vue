<template>
  <div class="main" v-if="showLoading">
    <div class="spinner-div">
      <ion-spinner name="dots"></ion-spinner>
    </div>
  </div>

  <ion-grid v-if="!showLoading">
    <!-- TOOLBAR-ROW START  -->
    <ion-row :class="{ toolbar: true, fixed: true }" v-if="propSettings.tools">
      <ion-col class="no-pm">
        <ion-toolbar color="light">
          <ion-buttons slot="primary">
            <ion-button @click="popoverOpen('p1', true)">
              {{ baseCoin }}
              <!-- <ion-icon slot="icon-only" :icon="star"></ion-icon> -->
            </ion-button>
            <ion-popover
              :is-open="popOverRef.p1.state"
              css-class="my-custom-class"
              :translucent="true"
              @didDismiss="popoverOpen('p1', false)"
            >
              <PopoverOptions
                @selectOption="selectCoin"
                :options="baseCoins"
                :data="popOverRef.p1.data"
              ></PopoverOptions>
            </ion-popover>
          </ion-buttons>
          <ion-searchbar
            @ionChange="search($event)"
            debounce="500"
          ></ion-searchbar>
        </ion-toolbar>
      </ion-col>
    </ion-row>
    <!-- TOOLBAR-ROW END  -->

    <!-- HEADER-ROW START  -->
    <ion-row
      :class="{
        'row-header': true,
        fixed: true,
        margintop: propSettings.tools,
      }"
    >
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
    <!-- HEADER-ROW END  -->

    <!-- POPOVER_COIN_MENU START -->
    <ion-popover
      :is-open="popOverRef.p2.state"
      css-class="my-custom-class"
      :translucent="true"
      @didDismiss="popoverOpen('p2', false)"
    >
      <PopoverOptions
        @selectOption="coinMenuSelected"
        :options="coinMenuOptions"
        :data="popOverRef.p2.data"
      ></PopoverOptions>
    </ion-popover>
    <!-- POPOVER_COIN_MENU END -->

    <!-- DATA ROW START  -->
    <ion-row
      v-touch:hold="touchHoldHandler(coin)"
      :key="coin"
      v-for="(coin, index) in filtered"
      :class="
        ' ' +
        (index === 0
          ? propSettings.tools
            ? 'row-first-tools'
            : 'row-first-notools'
          : 'row-data')
      "
    >
      <!-- COL_ICON -->
      <ion-col size="1">
        <img :src="getIcon(coin.s)" class="col-symbol-icon" />
      </ion-col>
      <!-- COL_ICON START-->

      <!-- COL_SYMBOL END -->
      <ion-col size="3" class="col-symbol">
        <span class="symbol-main"> {{ getSymbol(coin.s) }}</span>
        <span class="symbol-base"> {{ getBaseSymbol(coin.s) }}</span>
        <div class="coin-vol">
          {{ getVolume(coin.q) }}
        </div>
      </ion-col>
      <!-- COL_SYMBOL START-->

      <!-- COL_PRICE START -->
      <ion-col size="3" class="col-price">
        ${{ getPriceNoZero(coin.c) }}
      </ion-col>
      <!-- COL_PRICE END-->

      <!-- COL_PRICE_CHANGE START-->
      <ion-col
        size="3"
        :class="
          'col-price ' + (coin.p && coin.p.startsWith('-') ? 'minus' : 'plus')
        "
      >
        {{ coin.p && coin.p.startsWith("-") ? "" : "+" }}
        {{ getPriceNoZero(coin.p) }}
      </ion-col>
      <!-- COL_PRICE_CHANGE END -->

      <!-- COL_PRICE_CHANGE_PERCENTAGE START-->
      <ion-col size="2" :class="priceChange(coin.P) + ' col-percentage'">
        <span>
          {{ Number(coin.P).toFixed(2) }}
        </span>
      </ion-col>
      <!-- COL_PRICE_CHANGE_PERCENTAGE END-->
    </ion-row>
    <!-- DATA ROW END  -->
  </ion-grid>

  <!-- Toast -->
  <ion-toast
    :is-open="toastRef.p1.state"
    :message="toastRef.p1.data.message"
    :duration="800"
    @didDismiss="toastOpen('p1', false)"
  >
  </ion-toast>
  <!-- </div> -->
</template>

<script>
import {
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
  IonSpinner,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSearchbar,
  IonPopover,
  IonToast,
} from "@ionic/vue";
import { caretUpOutline, caretDownOutline } from "ionicons/icons";

import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import PopoverOptions from "@/components/PopoverOptions";

export default {
  name: "Market",
  props: {
    name: String,
    settings: Object,
    mode: { type: String, default: "all" },
    favList: { type: Array, default: () => [] },
  },
  emits: ["addToPortfolio"],
  components: {
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
    IonSpinner,
    IonToolbar,
    IonButtons,
    IonButton,
    IonSearchbar,
    IonPopover,
    PopoverOptions,
    IonToast,
  },
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const filteredMarketData = inject("marketData");
    //console.clear();
    const searchTerm = ref("");
    const marketData = ref([]);
    const showLoading = computed(() => !filteredMarketData.value.length);
    // const showLoading = computed(() => true);
    const menuCoin = ref("BTCUSDT");
    const favoriteCoins = ref(props.favList);
    const icons = { caretUpOutline, caretDownOutline, search };
    let sortKey = { fld: "", val: false };
    const baseCoin = ref("USDT");
    const popOverRef = ref({
      p1: {
        state: false,
        data: { title: "Select a base currency" },
      },
      p2: {
        state: false,
        data: { title: "Select an option" },
      },
    });
    const toastRef = ref({
      p1: {
        state: false,
        data: { message: "Added to Favorites" },
      },
    });

    const baseCoins = ref([
      { label: "USDT" },
      { label: "BTC" },
      { label: "BNB" },
      { label: "ETH" },
    ]);
    const coinMenuOptions = ref([
      { label: "Add Favorite" },
      { label: "Remove Favorite" },
      { label: "View Details" },
      { label: "Add to My Portfolio" },
    ]);

    function touchHoldHandler(coin) {
      return function () {
        console.log("touch hld", coin.value);
        popoverOpen("p2", true, {
          title: `Option for ${coin.s}`,
          data: coin,
        });
      };
    }

    function popoverOpen(popover, state, data) {
      // remove Remove Favorite option from options if Favorite only
      console.log("favorite option");
      let index = "-1";
      if (props.mode === "favorites") {
        index = coinMenuOptions.value.findIndex(
          (f) => f.label === "Add Favorite"
        );
      } else {
        index = coinMenuOptions.value.findIndex(
          (f) => f.label === "Remove Favorite"
        );
      }

      // Add or Remove Favorite option based on FavList length
      if (index !== -1) {
        coinMenuOptions.value.splice(index, 1);
      }

      popOverRef.value[popover].state = state;
      if (data) {
        popOverRef.value[popover].data = data;
      }

      // to add to favorites
      if (popover === "p2" && data) {
        menuCoin.value = data.data.s;
      }
    }
    const toastOpen = (toast, state) => {
      toastRef.value[toast].state = state;
    };

    const propSettings = ref(props.settings);

    const filtered = computed(() => {
      //let favlist = ["BTCUSDT", "NEOUSDT"];
      console.log("filtered", props.favList);
      // receiveData(receivedData.value);
      return filteredMarketData.value.filter(
        (d) =>
          // filter search text
          d.s.startsWith(searchTerm.value.toUpperCase()) &&
          // filter base coin
          d.s.endsWith(baseCoin.value) &&
          //filter favoritelist
          (props.mode === "favorites" && favoriteCoins.value.length > 0
            ? favoriteCoins.value.includes(d.s)
            : true)
      );
    });

    onUnmounted(() => {
      console.log("Market unmounted");
    });

    watch(
      () => props.favList,
      (val, oldVal) => {
        if (val !== oldVal) {
          console.log("Fav list changed");
          favoriteCoins.value = val;
        }
      }
    );

    function selectCoin(coin) {
      console.log("val", coin.val);
      baseCoin.value = coin.val;
      popoverOpen("p1", false);
      setTimeout(() => {
        baseCoinChanged();
      }, 800);
    }

    function coinMenuSelected(option) {
      console.log("val", option.val);
      popoverOpen("p2", false);
      setTimeout(() => {
        switch (option.val) {
          case "Add Favorite":
            addToFavorites();
            break;
          case "Remove Favorite":
            removeFavorite();
            break;
          case "Add to My Portfolio":
            addToPortfolio();
            break;

          default:
            break;
        }
      }, 200);
    }

    function addToPortfolio() {
      console.log("coinMenuSelected", menuCoin.value);
      context.emit("addToPortfolio", {
        coin: menuCoin.value,
        baseCoin: baseCoin.value,
      });
    }

    function addToFavorites() {
      let favorites = localStorage.getItem("favorites");
      if (favorites) {
        favorites = JSON.parse(favorites);
        favorites.push(menuCoin.value);
      } else {
        favorites = [menuCoin.value];
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      favoriteCoins.value.push(menuCoin.value);
      toastRef.value.p1.data.message = "Added to Favorites";
      toastOpen("p1", true);
    }

    function removeFavorite() {
      let index = favoriteCoins.value.indexOf(menuCoin.value);
      if (index > -1) {
        favoriteCoins.value.splice(index, 1);
      }
      if (favoriteCoins.value.length > 0) {
        localStorage.setItem("favorites", JSON.stringify(favoriteCoins.value));
      } else {
        localStorage.removeItem("favorites");
      }
      //toastRef.value.p1.data.message = "Favorite removed";
      //toastOpen("p1", true);
    }

    function search(evt) {
      console.log(evt.detail.value);
      searchTerm.value = evt.detail.value;
    }

    function baseCoinChanged() {
      console.log("base coin changed");
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
    }

    function getIcon(sym) {
      let icon = sym.replace(baseCoin.value, "").toLowerCase();
      // return `https://media.wazirx.com/media/${icon}/84.png`;
      let path = "";
      try {
        path = require(`@/assets/icons/color/${icon}.png`);
        return path;
      } catch {
        path = require(`@/assets/icons/color/coin.png`);
        return path;
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
      return sym.replace(baseCoin.value, "");
    }
    function getBaseSymbol() {
      return `/${baseCoin.value}`;
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
      return numberWithCommas(Number(numstr));
      // return numstr;
    }

    function numberWithCommas(x) {
      // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    function getVolume(price) {
      let num = Number(price);
      return formatNumber(num);
    }

    onMounted(() => {
      //start();
    });

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
      filtered,
      showLoading,
      search,
      popOverRef,
      popoverOpen,
      toastRef,
      toastOpen,
      baseCoin,
      baseCoins,
      coinMenuOptions,
      selectCoin,
      coinMenuSelected,
      menuCoin,
      favoriteCoins,
      propSettings,
      removeFavorite,
      touchHoldHandler,
      // receivedData,
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
ion-row.row-first-tools {
  padding-top: 86px;
}
ion-row.row-first-notools {
  padding-top: 30px;
}
ion-row.fixed.toolbar {
  margin-top: -1px !important;
  margin-left: -1px;
}
ion-col.no-pm {
  padding: 0px;
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
.fixed {
  position: fixed;
  width: 100%;
  z-index: 999999;
}
.row-header {
  background: #f5f6f9;
  font-size: 0.9rem;
  height: 30px;
}
.margintop {
  margin-top: 56px;
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
  /* font-weight: bold; */
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

.spinner-div {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  height: 100%;
  width: 100%;
  /* background: red; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-data {
  padding: 30px;
  text-align: center;
}
</style>



    
  

