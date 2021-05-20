<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Favorites</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Favorites</ion-title>
        </ion-toolbar>
      </ion-header>
      <div>
        <Market />
      </div>
      <div class="main">
        <div>
          You have not added any tokens here. Tap the Coin/Token icon on the 'Market' to add to
          the favorites
        </div>
      </div>
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
} from "@ionic/vue";
import Market from "@/components/Market";

export default {
  name: "Tab2",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, Market },
  setup() {
    return {};
  },
};
</script>
<style>
.main {
  height: 100%;
  width: 100%;
  /* background: red; */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>