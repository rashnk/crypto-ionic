<template>
  <ion-page>
    <!-- <ion-header> -->
      <ion-toolbar>
        <ion-title @click="setTheme('dark')">Market</ion-title>
      </ion-toolbar>
    <!-- </ion-header> -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <Market class="market"
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
  // IonHeader,
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
    // IonHeader,
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

    function setTheme(params) {
      let body = document.querySelector("body");
      body.classList.add(params);
    }

    function addToPortfolio(data) {
      console.log("tradeData coin", data);
      router.replace({
        name: "tab3",
        params: { action: "add", baseCoin: data.baseCoin, ...data.coin },
      });
    }
    return {
      Market,
      addToPortfolio,
      router,
      setTheme,
    };
  },
};
</script>