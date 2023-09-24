<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Coin Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Coin Details</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- <ChartView /> -->
      <ChartView2 />
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
} from "@ionic/vue";
 
// import  ChartView  from "@/components/ChartView";
import  ChartView2  from "@/components/ChartView2.vue";

export default {
  name: "View-coin",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    // ChartView,
    ChartView2,
  },
  setup() {
    return {};
  },
};
</script>

<style>
</style>