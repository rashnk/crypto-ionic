<template>
  <div v-if="portfolios.length && marketData.value.length">
    <ion-card
      v-for="(item, index) in portfolios"
      :key="item"
      @click="showOptions(index)"
    >
      <!-- coin stat -->
      <ion-item>
        <ion-label>
          <ion-text color="secondary">
            <h1>{{ item.coin }}</h1>
          </ion-text>
          <ion-text> {{ currentPrice(item).value.toString() }} </ion-text>
          <ion-text :color="priceChangePercent(item).color">
            ({{ priceChangePercent(item).value }})
          </ion-text>
          <ion-text :color="priceChange(item).color">
            <p>{{ priceChange(item).value.toString() }}</p>
          </ion-text>
        </ion-label>

        <!-- //profit and loss -->
        <ion-text slot="end" :color="currentValue(item).color">
          {{ currentValue(item).value }}
        </ion-text>
      </ion-item>

      <!-- buy details -->
      <ion-item>
        <ion-label>
          <ion-text color="dark">
            <h2>Buy Price : {{ item.buyPrice }}</h2>
          </ion-text>
          <ion-text slot="end" color="tertiary">
            <h6>Amount : {{ item.amount }}</h6>
          </ion-text>
        </ion-label>
        <ion-text slot="end">{{ totalBuyPrice(item).value }}</ion-text>
      </ion-item>

      <ion-item>
        <ion-label>{{ totalProfit(item).label }}</ion-label>
        <ion-text slot="end" :color="totalProfit(item).color">
          {{ totalProfit(item).value }}</ion-text
        >
      </ion-item>
    </ion-card>

    <ion-action-sheet
      :is-open="sheet.state"
      :buttons="buttons"
      @didDismiss="sheet.state = false"
    >
    </ion-action-sheet>
  </div>
</template>

<script lang="ts">
import {
  IonCard,
  IonLabel,
  IonItem,
  IonText,
  IonActionSheet,
} from "@ionic/vue";
 
import { computed, inject, ref } from "vue";

// import { pin } from "ionicons/icons";

export default {
  name: "Portfolio",
  props: {
    data: Object,
  },
  components: {
    IonCard,
    IonLabel,
    IonItem,
    IonActionSheet,
    IonText,
  },
  setup(props, { emit }) {
    const marketData = inject("marketData");
    // const portfolios = ref(props.data.portfolios);
    const selectedIndex = ref();
    const portfolios = computed(() => props.data.portfolios);
    const sheet = ref({
      state: false,
    });

    function showOptions(index) {
      selectedIndex.value = index;
      sheet.value.state = true;
    }

    const buttons = [
      {
        text: "Delete",
        role: "destructive",
        handler: () => {
          console.log("Delete clicked");
          emit("removeItem", selectedIndex.value);
        },
      },
    ];

    function currentPrice(item) {
      console.log("coin", item.coin);
      if (marketData.value.length) {
        let ret = marketData.value.find((m) => m.s === item.coin);
        let val = ret ? Number(ret.c) : 0;
        return { value: val ? val : 0 };
      } else {
        return { value: 0 };
      }
    }

    function totalProfit(item) {
      if (marketData.value.length) {
        let change = currentValue(item).value - totalBuyPrice(item).value;
        change = change < 0 ? change.toFixed(2) : `+${change.toFixed(2)}`;
        return {
          value: change,
          color: change < 0 ? "danger" : "success",
          label: change < 0 ? "Net Loss" : "Net Profit",
        };
      } else {
        return { value: "" };
      }
    }

    function currentValue(item) {
      if (marketData.value.length) {
        let cv = Number(item.amount) * currentPrice(item).value;
        let color = cv >= totalBuyPrice(item).value ? "success" : "danger";
        return { value: cv.toFixed(2), color: color };
      } else {
        return { value: "" };
      }
    }

    function totalBuyPrice(item) {
      if (marketData.value.length) {
        let tot = Number(item.buyPrice) * Number(item.amount);
        return { value: tot.toFixed(2) };
      } else {
        return { value: "" };
      }
    }

    function priceChangePercent(item) {
      if (marketData.value.length) {
        let buyPrice = Number(item.buyPrice);
        let currPrice = Number(currentPrice(item).value);
        let change = currPrice - buyPrice;
        let changepercent = (change / buyPrice) * 100;
        changepercent = changepercent.toFixed(2);
        return {
          value:
            Number(changepercent) < 0
              ? `${changepercent}%`
              : `+${changepercent}%`,
          color: Number(change) < 0 ? "danger" : "success",
        };
      } else {
        return "";
      }
    }
    const countDecimals = function (num) {
      if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
      return num.toString().split(".")[1].length || 0;
    };

    function priceChange(item) {
      if (marketData.value.length) {
        let buyPrice = Number(item.buyPrice);
        let currPrice = Number(currentPrice(item).value);
        let change = currPrice - buyPrice;
        //let changeVal = change;
        //change = 5;
        let dec = countDecimals(buyPrice);
        change = change.toFixed(dec);

        return {
          value: Number(change) < 0 ? `${change}` : `+${change}`,
          color: Number(change) < 0 ? "danger" : "success",
        };
      } else {
        return "";
      }
    }
    return {
      marketData,
      portfolios,
      currentPrice,
      priceChange,
      totalBuyPrice,
      currentValue,
      totalProfit,
      buttons,
      sheet,
      showOptions,
      priceChangePercent,
    };
  },
};

// var buy=0.000045
// var current = 0.000045
// var change = current-buy
// var changePercentage=(change/buy)*100
// console.log('change : '+ (change) )
// console.log('percentage : '+ changePercentage.toFixed(2) + "%")
</script>

<style>
</style>