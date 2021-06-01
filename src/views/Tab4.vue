<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Portfolio</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Portfolio</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-button @click="open(true, $event)">popover </ion-button>
      <ion-popover
        :is-open="popoverstate"
        :event="event"
        :translucent="false"
        @didDismiss="open(false)"
      >
        <ion-grid>
          <ion-row
            v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
            :key="item"
            v-touch:hold="touchHoldHandler"
          >
            <span> Item {{ item }} </span>
          </ion-row>
        </ion-grid>
      </ion-popover>
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
  IonRow,
  IonGrid,
  IonPopover,
  IonButton,
} from "@ionic/vue";
import { ref } from "vue";

export default {
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonRow,
    IonGrid,
    IonPopover,
    IonButton,
  },
  setup() {
    const popoverstate = ref(false);
    const event = ref();
    const open = (state, event) => {
      popoverstate.value = state;
      event.value = event;
    };
    function touchHoldHandler() {
      console.log("touch and hold");
    }
    return { touchHoldHandler, popoverstate, open, event };
  },
};
</script>

<style>
</style>