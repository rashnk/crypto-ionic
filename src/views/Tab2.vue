<template>
  <ion-page>
    <!-- <ion-header> -->
    <ion-toolbar>
      <ion-title>Favorites</ion-title>
    </ion-toolbar>
    <!-- </ion-header> -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Favorites</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="favorites.length">
        <Market
          :settings="{ tools: false }"
          mode="favorites"
          :favList="favorites"
          @addToPortfolio="addToPortfolio"
        />
      </div>
      <div class="main" v-if="!favorites.length">
        <div class="no-fav">
          <p>
            You have not added any item in favorites.
            <br />
            Long press the Coin/Token icon on the 'Market' to add to the favorites
          </p>
          <ion-button color="light" @click="goToMarket">
            Open Market
          </ion-button>
        </div>
      </div>
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
  IonButton,
  onIonViewDidEnter,
} from "@ionic/vue";
 
import Market from "@/components/Market.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Tab2",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonPage,
    // eslint-disable-next-line vue/no-unused-components
    Market,
  },
  setup() {
    const favorites = ref([]);
    const router = useRouter();

    function getFavorites() {
      let data = localStorage.getItem("favorites");

      if (data) {
        favorites.value = JSON.parse(data);
        console.log(favorites.value);
      }
    }

    function addToPortfolio(data) {
      console.log("tradeData coin", data);
      router.replace({
        name: "tab3",
        params: { action: "add", baseCoin: data.baseCoin, ...data.coin },
      });
    }

    function goToMarket() {
      router.replace("tab1");
    }
    onIonViewDidEnter(() => {
      console.log("Tab 2 did enter");
      getFavorites();
    });
    return { favorites, goToMarket, addToPortfolio };
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