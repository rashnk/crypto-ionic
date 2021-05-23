<template>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header>{{ header }}</ion-list-header>
      <ion-item
        button
        v-for="option in alloptions"
        :key="option"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { IonContent, IonList, IonItem, IonListHeader } from "@ionic/vue";
import { ref } from "vue";

export default {
  name: "PopoverOptions",
  props: {
    data: Object,
    options: {
      type: Array,
      default: () => [{ label: "Option1", val: "Option1" }],
    },
  },
  emits: ["selectOption"],
  components: {
    IonContent,
    IonList,
    IonListHeader,
    // eslint-disable-next-line vue/no-unused-components
    IonItem,
  },
  setup(props, context) {
    // const options = ref(["USDT", "BTC", "BNB", "ETH"]);
    const alloptions = ref([]);
    const header = ref(props.data.title);
    function mapOptions() {
      alloptions.value = props.options.map((o) => {
        if (!o.val) {
          return { ...o, val: o.label };
        } else {
          return { ...o };
        }
      });
      console.log(alloptions);
    }
    mapOptions();
    // = ref(props.options);
    function selectOption(option) {
      context.emit("selectOption", option);
    }
    return {
      alloptions,
      selectOption,
      header,
    };
  },
};
</script>