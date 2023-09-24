<template>
  <ion-page>
    <ion-tabs ref="tabs" @ionTabsDidChange="tabChanged($event)">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1" >
          <ion-icon :icon="barChart" />
          <ion-label>Market</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2" >
          <ion-icon :icon="star" />
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" >
          <ion-icon :icon="wallet" />
          <ion-label>Portfolio</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab4" href="/tabs/tab4" >
          <ion-icon :icon="settings" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button tab="tab4" href="/tabs/tab4">
          <ion-icon :icon="wallet" />
          <ion-label>Test</ion-label>
        </ion-tab-button> -->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet
} from "@ionic/vue";
import {
  ellipse,
  square,
  triangle,
  logoBitcoin,
  barChart,
  star,
  wallet,
  settings,
} from "ionicons/icons";


// import axios from "axios";
 
export default {
  name: "Tabs",
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage,IonRouterOutlet },
  setup() {
    const icons = {
      ellipse,
      square,
      triangle,
      logoBitcoin,
      barChart,
      star,
      wallet,
      settings,
    };
    function tabChanged(e: any) {
      console.log("tab changed", e);
    }
    return {
      tabChanged,
      ...icons,
    };
  },
};
</script>