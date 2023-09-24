<template>
  <ion-page>
    <!-- <ion-header> -->
    <ion-toolbar>
      <ion-title>Market</ion-title>
    </ion-toolbar>
    <!-- </ion-header> -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <Market class="market" :settings="{ tools: true }" mode="all" @addToPortfolio="addToPortfolio"
        @viewCoin="viewCoin" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  //lifecycles
  onIonViewDidEnter,
} from "@ionic/vue";

import Market from "@/components/Market.vue";

import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";

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
    const instance: any = getCurrentInstance();

    onIonViewDidEnter(() => {
      console.log("tab1 page did enter");
    });

    function viewCoin(data) {
      console.log('view-coin emitted')
      router.replace({
        name: "view-coin",
        params: { baseCoin: data.baseCoin, ...data.coin },
      });
    }

    function addToPortfolio(data) {
      console.log("tradeData coin", data);
      let params = { action: "add", baseCoin: data.baseCoin, ...data.coin };
      instance.appContext.config.globalProperties.$portfolio = params;
      
      router.replace({
        name: "tab3",
        params
      });
    }
    return {
      Market,
      addToPortfolio,
      router,
      viewCoin,
    };
  },
};
</script>