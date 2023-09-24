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
        <ion-title size="small">CoinDeck {{appinfo.version}}</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { App } from '@capacitor/app';
 
import Settings from "@/components/Settings.vue";
import { ref } from "vue";

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
    const appinfo:any = ref({});
     App.getInfo().then(data=>{
      console.log(data.version);
      appinfo.value=data;
     })
    return {appinfo};
  },
};
</script>

<style>
</style>