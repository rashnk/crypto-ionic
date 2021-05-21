<template>
  <ion-page>
    <ion-tabs @ionTabsDidChange="tabChanged($event)">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="barChart" />
          <ion-label>Market</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="star" />
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="wallet" />
          <ion-label>Portfolio</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script  >
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
} from "@ionic/vue";
import {
  ellipse,
  square,
  triangle,
  logoBitcoin,
  barChart,
  star,
  wallet,
} from "ionicons/icons";

// import axios from "axios";

export default {
  name: "Tabs",
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    const icons = {
      ellipse,
      square,
      triangle,
      logoBitcoin,
      barChart,
      star,
      wallet,
    };
    function tabChanged(e) {
      console.log("tab changed", e);
    }
    return {
      tabChanged,
      ...icons,
    };
  },
};
</script>