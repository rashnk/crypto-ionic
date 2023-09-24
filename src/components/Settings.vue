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
        <ion-label>Light</ion-label>
        <ion-radio slot="start" value="light"></ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
</template>

<script lang="ts">
import {
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonLabel,
  IonItem,
} from "@ionic/vue";
import { StatusBar, Style } from '@capacitor/status-bar';

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
    let mode = ref("");

    function changeMode() {
      document.querySelector("body")?.classList.remove("dark", "light");
      document.querySelector("body")?.classList.add(mode.value);
      localStorage.setItem("theme", mode.value);
      let bg: any = { light: "#1612dd", dark: "#161a25" };
      StatusBar.setBackgroundColor({ color: bg[mode.value] })

    }
    //
    //setInterval(() => {
    //   console.log("seleected mode : ", mode.value);
    //settings.mode = mode.value;
    // }, 2000);
    function init() {
      let val = localStorage.getItem("theme");
      if (val) {
        mode.value = val;
      } else {
        mode.value = "light";
      }
    }
    init();
    return { mode, settings, changeMode, init };
  },
};
</script>

<style></style>