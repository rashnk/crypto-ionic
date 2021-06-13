<template>
  <div id="market-page">
    <div class="main" v-if="showLoading">
      <div class="spinner-div">
        <ion-spinner name="dots"></ion-spinner>
        <div v-if="network && !network.connected">Not connected to network</div>
      </div>
    </div>
    <div v-if="!showLoading">
      <ion-toolbar
        v-if="propSettings.tools"
        :class="{ toolbar: true, fixed: true }"
      >
        <ion-buttons slot="primary">
          <ion-button @click="popoverOpen('p1', true, 0, $event)">
            {{ baseCoin }}
            <!-- <ion-icon slot="icon-only" :icon="star"></ion-icon> -->
          </ion-button>
        </ion-buttons>
        <ion-searchbar
          @ionChange="search($event)"
          debounce="500"
        ></ion-searchbar>
      </ion-toolbar>

      <ion-grid>
        <!-- TOOLBAR-ROW START  -->
        <!-- mode{{appSettings.mode}} -->
        <!-- <ion-row  >
      <ion-col class="no-pm"> </ion-col>
    </ion-row> -->
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
          <ion-col
            size="3"
            class="col-symbol-header"
            @click="sortData('q', true)"
          >
            <ion-icon
              :icon="sortKey.val ? caretUpOutline : caretDownOutline"
              v-if="sortKey.fld === 'q'"
            />
            Market
          </ion-col>
          <ion-col
            size="3"
            class="col-price-header"
            @click="sortData('c', true)"
          >
            <ion-icon
              :icon="sortKey.val ? caretUpOutline : caretDownOutline"
              v-if="sortKey.fld === 'c'"
            />
            Price
          </ion-col>
          <ion-col
            size="3"
            class="col-price-header"
            @click="sortData('p', true)"
          >
            <ion-icon
              :icon="sortKey.val ? caretUpOutline : caretDownOutline"
              v-if="sortKey.fld === 'p'"
            />
            <span class="text-24h">24h</span
            ><span class="text-change">Change</span>
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
            <span class="text-24h">24h</span>
            <span class="text-change"> %</span>
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
          v-touch:tap="tapHandler(coin)"
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
          <ion-col size="3" :class="'col-price ' + coin.color">
            {{ getPriceNoZero(coin.c) }}
          </ion-col>
          <!-- COL_PRICE END-->

          <!-- COL_PRICE_CHANGE START-->
          <ion-col
            size="3"
            :class="
              'col-price ' +
              (coin.p && coin.p.startsWith('-') ? 'minus' : 'plus')
            "
          >
            <span :class="coin.p.length > 9 ? 'price-small' : ''">
              {{
                `${coin.p && coin.p.startsWith("-") ? "" : "+"}${getPriceNoZero(
                  coin.p
                )}`
              }}
            </span>
            <!-- 2nd params passed for testing purpose, not required -->
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
    </div>
    <!-- Popover -->
    <ion-popover
      :is-open="popOverRef.p1.state"
      :event="popOverRef.p1.event"
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

    <!-- Toast -->
    <ion-toast
      :is-open="toastRef.p1.state"
      :message="toastRef.p1.data.message"
      :duration="800"
      @didDismiss="toastOpen('p1', false)"
    >
    </ion-toast>

    <!-- Modal -->
    <ion-modal
      :is-open="modalRef.p1.state"
      @didDismiss="modalOpen('p1', false)"
    >
      <ChartView2
        :coin="tapCoin"
        :showHeader="true"
        @closeModal="modalOpen('p1', false)"
      />
    </ion-modal>
  </div>
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
  IonModal,
} from "@ionic/vue";
import { caretUpOutline, caretDownOutline } from "ionicons/icons";

import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import PopoverOptions from "@/components/PopoverOptions";
import ChartView2 from "./ChartView2.vue";

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
    IonModal,
    ChartView2,
  },
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const filteredMarketData = inject("marketData");
    const network = inject("network");
    const appSettings = inject("settings");
    //console.clear();
    const searchTerm = ref("");
    const tapCoin = ref();
    const marketData = ref([]);
    const showLoading = computed(() => !filteredMarketData.value.length);
    // const showLoading = computed(() => true);
    let menuCoin = {};
    const favoriteCoins = ref(props.favList);
    const icons = { caretUpOutline, caretDownOutline, search };
    let sortKey = { fld: "q", val: true };
    const baseCoin = ref();
    const popOverRef = ref({
      p1: {
        state: false,
        event: 0,
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
    const modalRef = ref({
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
      // { label: "View Details" },
      { label: "Add to favorite" },
      { label: "Remove favorite" },
      { label: "Add to portfolio" },
    ]);

    function tapHandler(coin) {
      return function () {
        tapCoin.value = coin;
        console.log(tapCoin.value);
        modalOpen("p1", true);
      };
    }

    function touchHoldHandler(coin) {
      return function () {
        console.log("touch hld", coin.value);
        popoverOpen("p2", true, {
          title: `Options for ${coin.s}`,
          coin: coin,
        });
      };
    }

    function popoverOpen(popover, state, data, evt) {
      // remove Remove favorite option from options if Favorite only
      console.log("favorite option");
      let index = "-1";
      if (props.mode === "favorites") {
        index = coinMenuOptions.value.findIndex(
          (f) => f.label === "Add to favorite"
        );
      } else {
        index = coinMenuOptions.value.findIndex(
          (f) => f.label === "Remove favorite"
        );
      }

      // Add or Remove favorite option based on FavList length
      if (index !== -1) {
        coinMenuOptions.value.splice(index, 1);
      }

      popOverRef.value[popover].state = state;
      if (data) {
        popOverRef.value[popover].data = data;
      }
      if (evt) {
        popOverRef.value[popover].event = evt;
      }

      // to add to favorites
      if (popover === "p2" && data) {
        menuCoin = { ...data.coin };
      }
    }
    const toastOpen = (toast, state) => {
      toastRef.value[toast].state = state;
    };
    const modalOpen = (modal, state) => {
      modalRef.value[modal].state = state;
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
      popoverOpen("p1", false);
      setTimeout(() => {
        console.log("val", coin.val);
        baseCoin.value = coin.val;
        baseCoinChanged();
      }, 800);
    }

    function coinMenuSelected(option) {
      console.log("val", option.val);
      popoverOpen("p2", false);
      setTimeout(() => {
        switch (option.val) {
          // case "View Details":
          //   viewCoin();
          //   break;
          case "Add to favorite":
            addToFavorites();
            break;
          case "Remove favorite":
            removeFavorite();
            break;
          case "Add to portfolio":
            addToPortfolio();
            break;

          default:
            break;
        }
      }, 200);
    }

    // function viewCoin() {
    //   console.log("view coin");
    //   context.emit("viewCoin", {
    //     coin: menuCoin,
    //     baseCoin: baseCoin.value,
    //   });
    // }

    function addToPortfolio() {
      console.log("coinMenuSelected", menuCoin);
      context.emit("addToPortfolio", {
        coin: menuCoin,
        baseCoin: baseCoin.value,
      });
    }

    function addToFavorites() {
      let favorites = localStorage.getItem("favorites");
      if (favorites) {
        favorites = JSON.parse(favorites);
        favorites.push(menuCoin.s);
      } else {
        favorites = [menuCoin.s];
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      favoriteCoins.value.push(menuCoin.s);
      toastRef.value.p1.data.message = "Added to Favorites";
      toastOpen("p1", true);
    }

    function removeFavorite() {
      let index = favoriteCoins.value.indexOf(menuCoin.s);
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
      localStorage.setItem("baseCoin", baseCoin.value);
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

    // eslint-disable-next-line no-unused-vars
    function getPriceNoZero(price, isCheck, coin) {
      // if (isCheck & (coin === "SHIBUSDT")) {
      //   console.log("shibaaa");
      // }

      let num = Number(price);

      // convert to string will remove trailing zeros
      let numstr = num.toString();

      // to avoid scientif notation (exapmple SHIBUSDT)
      if (num < 0.000001) {
        var nozero = price.replace(/^0+(\d)|(\d)0+$/gm, "$1$2");
        return nozero;
      } else {
        return numberWithCommas(Number(numstr));
      }
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
      let bc = localStorage.getItem("baseCoin");
      if (bc) {
        baseCoin.value = bc;
      } else {
        baseCoin.value = "USDT";
      }
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
      modalRef,
      toastOpen,
      modalOpen,
      baseCoin,
      baseCoins,
      coinMenuOptions,
      selectCoin,
      coinMenuSelected,
      menuCoin,
      tapCoin,
      favoriteCoins,
      propSettings,
      removeFavorite,
      touchHoldHandler,
      tapHandler,
      network,
      appSettings,
      // receivedData,
      ...icons,
    };
  },
};
</script>
<style>
</style>



    
  

