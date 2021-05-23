<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Market</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <Market
        :settings="{ tools: true }"
        mode="all"
        @addToPortfolio="addToPortfolio"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  //lifecycles
  onIonViewDidEnter,
} from "@ionic/vue";

import Market from "@/components/Market";

import { useRouter } from "vue-router";

export default {
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Market,
  },
  setup() {
    const router = useRouter();

    onIonViewDidEnter(() => {
      console.log("tab1 page did enter");
    });

    function addToPortfolio(coin) {
      console.log("tradeData coin", coin);
      router.push({
        name: "tab3",
        params: { action: "add", coin: coin },
      });
      // router.push(`tab3/add/${coin}`);
      //  router.replace('/tabs/tab3/');
    }
    return {
      Market,
      addToPortfolio,
      router,
    };
  },
};
</script>