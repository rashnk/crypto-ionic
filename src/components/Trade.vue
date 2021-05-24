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
        <ion-label>Add buy {{ coin }}</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>At Price</ion-label>
        <ion-input name="buyPrice" @ionChange="input"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label> Amount</ion-label>
        <ion-input name="amount" @ionChange="input"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Total</ion-label>
        <ion-input name="total" @ionChange="input"></ion-input>
      </ion-item>
    </ion-list>
    <ion-button color="secondary" expand="block" @click="saveTrade"
      >Save</ion-button
    >
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
  IonListHeader,
} from "@ionic/vue";
import { onMounted } from "vue";
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
  },
  props: {
    coin: String,
  },
  emits: ["closeModal", "saveData"],
  setup(props, context) {
    onMounted(() => {
      console.log("trade page", props.coin);
    });
    const tradeData = {
      coin: "",
      buyPrice: 0,
      amount: 0,
    };

    function dismissModal() {
      context.emit("closeModal");
      console.log("closeModal");
    }

    function input(el) {
      tradeData[el.target.name] = el.detail.value;
      console.log(tradeData);
    }

    function saveTrade() {
      tradeData["coin"] = props.coin;
      console.log(tradeData);
      context.emit("saveData", tradeData);
    }
    return { dismissModal, saveTrade, input };
  },
};
</script>