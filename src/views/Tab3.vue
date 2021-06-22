<template>
  <ion-page>
    <!-- <ion-header> -->
      <ion-toolbar>
        <ion-title>Portfolio</ion-title>
      </ion-toolbar>
    <!-- </ion-header> -->
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Portfolio</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="portfolios.length">
        <Portfolio :data="propData" @removeItem="removeItem" />
      </div>
      <div class="main" v-if="!portfolios.length">
        <div class="no-fav">
          <p>
            You have not added any item in portfolio.
            <br />
            Long press the Coin/Token icon on the 'Market' to add to the portfolio
          </p>

          <ion-button color="light" @click="goToMarket">
            Open Market
          </ion-button>
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
        :baseCoin="baseCoinSelected"
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
  IonButton,
  onIonViewDidEnter,
} from "@ionic/vue";
import { ref } from "vue";
import Portfolio from "@/components/Portfolio";
import Trade from "@/components/Trade";
import { useRoute, useRouter } from "vue-router";
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
    IonButton,
    Trade,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const portfolios = ref([]);
    const coinSelected = ref();
    const baseCoinSelected = ref();
    const propData = ref();
    const modalRef = ref({
      p1: { state: false },
    });

    function removeItem(index) {
      if (index > -1) {
        portfolios.value.splice(index, 1);
      }
      if (portfolios.value.length > 0) {
        localStorage.setItem("portfolios", JSON.stringify(portfolios.value));
      } else {
        localStorage.removeItem("portfolios");
      }
      //toastRef.value.p1.data.message = "Favorite removed";
      //toastOpen("p1", true);
    }

    function getPortfolio() {
      portfolios.value = [];
      console.log("get port", portfolios.value);
      let p = localStorage.getItem("portfolios");
      if (p) {
        portfolios.value = JSON.parse(p);
        propData.value = { portfolios: portfolios.value };
        console.log("get port", propData);
      }
    }
    const modalOpen = (modal, state) => {
      modalRef.value[modal].state = state;
    };

    function goToMarket() {
      router.replace("tab1");
    }

    onIonViewDidEnter(() => {
      getPortfolio();
      console.log("route.params", route.params);
      if (route.params.action === "add") {
        setTimeout(() => {
          coinSelected.value = route.params;
          baseCoinSelected.value = route.params.baseCoin;
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
      setTimeout(() => {
        getPortfolio();
      }, 1000);
    }

    return {
      portfolios,
      propData,
      modalRef,
      modalOpen,
      Trade,
      coinSelected,
      baseCoinSelected,
      saveTradeData,
      goToMarket,
      removeItem,
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