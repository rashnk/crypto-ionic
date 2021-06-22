<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Portfolio</ion-title>
        </ion-toolbar>
      </ion-header>
      <Settings />
    </ion-content>
    <ion-footer>
      <ion-toolbar color="light">
        <ion-title size="small">CoinDeck v1.0</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

import Settings from "@/components/Settings";

export default {
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonFooter,
    IonTitle,
    IonContent,
    IonPage,
    Settings,
  },
  setup() {
    return {};
  },
};
</script>

<style>
</style>