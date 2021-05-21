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
      <Market :settings="{ tools: true }" />
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
  IonIcon,
  //lifecycles
  onIonViewDidEnter,
} from "@ionic/vue";

import Market from "@/components/Market";
import { onMounted } from "vue";

export default {
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    // eslint-disable-next-line vue/no-unused-components
    IonIcon,
    Market,
  },
  setup() {
    onMounted(() => console.log("tab1 mounted"));
    onIonViewDidEnter(() => {
      console.log("tab1 page did enter");
    });
    return { Market };
  },
};
</script>