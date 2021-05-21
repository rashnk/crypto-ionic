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
        <Market :settings="{ tools: false }" :favList="favorites" />
      </div>
      <div class="main">
        <div class="no-fav">
          You have not added any tokens here.
          <br />
          Tap the Coin/Token icon on the 'Market' to add to the favorites
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
  onIonViewDidEnter,
} from "@ionic/vue";
import Market from "@/components/Market";
import { onMounted, ref } from "vue";
// import { onMounted } from 'vue';

export default {
  name: "Tab2",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, Market },
  setup() {
    //onMounted(){}
    const favorites = ref([]);
    function getFavorites() {
      let data = localStorage.getItem("favorites");
      if (data) {
        favorites.value = JSON.parse(data);
        console.log(favorites);
      }
    }
    onMounted(() => {
      console.log("Tab 2 page mounted");
      getFavorites();
    });
    onIonViewDidEnter(() => {
      console.log("Tab 2 did enter");
      getFavorites();
    });
    return { favorites };
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
.no-fav {
  padding: 30px;
  text-align: center;
}
</style>