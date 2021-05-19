<template>
  <ion-content class="ion-padding">
    <ion-list>
      <!-- <ion-list-header>Select Base Currency</ion-list-header> -->
      <ion-item
        button
        v-for="coin in baseCoins"
        :key="coin"
        @click="selectCoin(coin)"
      >
        {{ coin }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, IonList, IonItem } from "@ionic/vue";
import { ref } from "vue";

export default {
  name: "BaseCoins",
  components: {
    IonContent,
    IonList,
    // eslint-disable-next-line vue/no-unused-components
    IonItem,
  },
  setup(props, context) {
    const baseCoins = ref(["USDT", "BTC", "BNB", "ETH"]);
    function selectCoin(coin) {
      context.emit("selectCoin", coin);
    }
    return {
      baseCoins,
      selectCoin,
    };
  },
};
</script>