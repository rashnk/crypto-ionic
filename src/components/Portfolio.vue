<template>
  <div>
    <ion-card>
      <ion-item>
        <ion-label>
          <h2>ADA/INR</h2>
          <p>$152.24</p>
        </ion-label>
        <ion-note slot="end">30</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Buy Price</ion-label>
        <ion-note slot="end">$138</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Total Buy Price</ion-label>
        <ion-note slot="end">$4100</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Price Change</ion-label>
        <ion-note slot="end" color="primary">+12.5 (2.3%)</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Current Value</ion-label>
        <ion-note slot="end" color="primary">$4500</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Total Profit</ion-label>
        <ion-note slot="end" color="success">$400</ion-note>
      </ion-item>
    </ion-card>
  </div>
</template>

ADA,amount, buy price current price
profit change %
profit price change

<script>
import { IonCard, IonLabel, IonItem, IonNote } from "@ionic/vue";

// import { pin } from "ionicons/icons";

export default {
  name: "Portfolio",
  props: {
    data: Object,
  },
  components: {
    IonCard,
    IonLabel,
    IonItem,
    IonNote,
  },
  setup() {
    return {};
  },
};
</script>

<style>
</style>