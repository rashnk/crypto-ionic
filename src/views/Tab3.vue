<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Portfolio</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Portfolio</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="portfolios.length">
        <Portfolio :data="propData" />
      </div>
      <div class="main" v-if="!portfolios.length">
        <div class="no-fav" @click="show()">
          You have not added any item in this portfolio
          <br />
          <!-- Tap the Coin/Token icon on the 'Market' to add to the favorites -->
        </div>
      </div>
    </ion-content>
    <ion-modal
      :is-open="modalRef.p1.state"
      @didDismiss="modalOpen('p1', false)"
    >
      <Trade
        v-if="coinSelected"
        :coin="coinSelected"
        @closeModal="modalOpen('p1', false)"
        @saveData="saveTradeData"
      ></Trade>
    </ion-modal>
  </ion-page>
</template>

<script  >
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  onIonViewDidEnter,
} from "@ionic/vue";
import { ref } from "vue";
import Portfolio from "@/components/Portfolio";
import Trade from "@/components/Trade";
import { useRoute } from "vue-router";
export default {
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Portfolio,
    IonModal,
    Trade,
  },
  setup() {
    const route = useRoute();
    const portfolios = ref([]);
    const coinSelected = ref();
    const propData = ref();
    const modalRef = ref({
      p1: { state: false },
    });

    function show() {
      modalOpen("p1", true);
    }

    function getPortfolio() {
      let p = localStorage.getItem("portfolios");
      if (p) {
        portfolios.value = JSON.parse(p);
        propData.value = { portfolios: portfolios.value };
      }
    }
    const modalOpen = (modal, state) => {
      modalRef.value[modal].state = state;
    };

    onIonViewDidEnter(() => {
      getPortfolio();
      console.log("route.params", route.params);
      if (route.params.action === "add") {
        setTimeout(() => {
          coinSelected.value = route.params.coin;
          modalOpen("p1", true);
        }, 600);
      }
    });

    function saveTradeData(trdData) {
      console.log("emited", trdData);
      let p = localStorage.getItem("portfolios");
      if (p) {
        let portfolios = JSON.parse(p);
        portfolios.push(trdData);
        localStorage.setItem("portfolios", JSON.stringify(portfolios));
      } else {
        let portfolios = [trdData];
        localStorage.setItem("portfolios", JSON.stringify(portfolios));
      }
      modalOpen("p1", false);
    }

    return {
      portfolios,
      propData,
      modalRef,
      modalOpen,
      Trade,
      coinSelected,
      saveTradeData,
      show,
    };
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