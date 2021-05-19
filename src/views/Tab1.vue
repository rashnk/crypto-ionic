<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="setOpen(true)">
            {{baseCoin}}
            <!-- <ion-icon slot="icon-only" :icon="star"></ion-icon> -->
          </ion-button>
        </ion-buttons>
        <ion-popover
          :is-open="isOpenRef"
          css-class="my-custom-class"
          :translucent="true"
          @didDismiss="setOpen(false)"
        >
          <BaseCoins @selectCoin="selectCoin"></BaseCoins>
        </ion-popover>
        <ion-title>Market</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <Market name="Tab 1 page" :baseCoin="baseCoin" />
    </ion-content>
  </ion-page>
</template>

<script  >
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonIcon,
  IonButtons,
  IonButton,
  IonPopover,
} from "@ionic/vue";
// import { star } from "ionicons/icons";
import Market from "@/components/Market";
import BaseCoins from "@/components/BaseCoins";
import { ref } from "vue";

export default {
  name: "Tab1",
  components: {
    Market,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSearchbar,
    // eslint-disable-next-line vue/no-unused-components
    IonIcon,
    IonButtons,
    IonButton,
    IonPopover,
    BaseCoins,
  },
  setup() {
    const isOpenRef = ref(false);
    const baseCoin = ref();

    const setOpen = (state) => {
      isOpenRef.value = state;
    };

    function selectCoin(val) {
      console.log("val", val);
      baseCoin.value = val;
      setTimeout(() => {
        setOpen(false);
      }, 200);
    }

    return { isOpenRef, setOpen, selectCoin, baseCoin };
  },
};

// Property "baseCoin" was accessed during render but is not defined on instance.
// solution add in setup  > return
</script>