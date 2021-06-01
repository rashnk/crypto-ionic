<template>
  <ion-list>
    <ion-radio-group v-model="mode" @ionChange="changeMode">
      <ion-list-header>
        <ion-label>Appearance</ion-label>
      </ion-list-header>

      <ion-item>
        <ion-label>Dark</ion-label>
        <ion-radio slot="start" value="dark"></ion-radio>
      </ion-item>

      <ion-item>
        <ion-label>White</ion-label>
        <ion-radio slot="start" value="white"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
</template>

<script>
import {
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonLabel,
  IonItem,
} from "@ionic/vue";
import { inject, ref } from "vue";
export default {
  name: "Settings",
  components: {
    IonList,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
    IonLabel,
    IonItem,
  },
  setup() {
    const settings = inject("settings");
    let mode = ref("white");

    function changeMode() {
      document.querySelector("body").classList.remove('dark','white');
      document.querySelector("body").classList.add(mode.value);
    }
    //
    setInterval(() => {
      //   console.log("seleected mode : ", mode.value);
      settings.mode = mode.value;
    }, 2000);
    return { mode, settings,changeMode };
  },
};
</script>

<style>
</style>