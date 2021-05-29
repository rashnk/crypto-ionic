<template>
  <ion-header>
    <ion-toolbar color="warning">
      <ion-title>Add Trade</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header>
        <ion-label> Add buy details</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-thumbnail slot="start">
          <img :src="getIcon(coin.s)" />
        </ion-thumbnail>
        <ion-label>
          <h3>{{ coin.s }}</h3>
          <p>Current Price : {{coin.c}}</p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Buy Price</ion-label>
        <ion-input
          name="buyPrice"
          type="numeric"
          @ionChange="input"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label> Amount</ion-label>
        <ion-input
          :disabled="tradeData['buyPrice'] ? false : true"
          name="amount"
          type="numeric"
          @ionChange="input"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Total</ion-label>
        <ion-input
          name="total"
          :value="tradeData['total']"
          type="numeric"
          disabled
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button
      color="secondary"
      expand="block"
      @click="saveTrade"
      :disabled="tradeData['total'] ? false : true"
    >
      Save
    </ion-button>
  </ion-content>
</template>
<script>
import {
  IonButtons,
  IonToolbar,
  IonHeader,
  IonContent,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonThumbnail,
  IonListHeader,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
export default {
  name: "Trade",
  components: {
    IonButtons,
    IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonListHeader,
    IonThumbnail,
  },
  props: {
    coin: Object,
    baseCoin: String,
  },
  emits: ["closeModal", "saveData"],
  setup(props, context) {
    onMounted(() => {
      //console.log("trade page", props.coin);
    });

    const tradeData = ref({
      coin: "",
      buyPrice: "",
      amount: "",
      total: "",
    });

    function dismissModal() {
      context.emit("closeModal");
      //console.log("closeModal");
    }

    function getIcon(sym) {
      let icon = sym.replace(props.baseCoin, "").toLowerCase();
      // return `https://media.wazirx.com/media/${icon}/84.png`;
      let path = "";
      try {
        path = require(`@/assets/icons/color/${icon}.png`);
        return path;
      } catch {
        path = require(`@/assets/icons/color/coin.png`);
        return path;
      }
    }

    function input(el) {
      tradeData.value[el.target.name] = el.detail.value;
      //console.log(tradeData.value);
      switch (el.target.name) {
        case "amount": {
          tradeData.value["total"] = "";
          let buyPrice = Number(tradeData.value["buyPrice"]);
          let amount = Number(tradeData.value["amount"]);
          let total = buyPrice * amount;
          //console.log(total);
          tradeData.value["total"] = total;
          break;
        }
        case "total": {
          tradeData.value["amount"] = "";
          let buyPrice = Number(tradeData.value["buyPrice"]);
          let total = Number(tradeData.value["total"]);
          let amount = total / buyPrice;
          //console.log(total);
          tradeData.value["amount"] = amount;
          break;
        }
        case "buyPrice": {
          tradeData.value["total"] = "";
          let buyPrice = Number(tradeData.value["buyPrice"]);
          let amount = Number(tradeData.value["amount"]);
          let total = buyPrice * amount;
          //console.log(total);
          tradeData.value["total"] = total;
          break;
        }

        default:
          break;
      }
    }

    function saveTrade() {
      tradeData.value["coin"] = props.coin.s;
      //console.log(tradeData.value);
      context.emit("saveData", tradeData.value);
    }
    return { dismissModal, tradeData, saveTrade, input, getIcon };
  },
};
</script>