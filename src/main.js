import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/style.scss';

import Vue3TouchEvents from "vue3-touch-events";

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(Vue3TouchEvents)
router.isReady().then(() => {
  app.mount('#app');
});


// set global properties here
const prodMode = true
const enableConsole = false
app.config.globalProperties.$prodMode = prodMode


if (!enableConsole) {
  console.log("console.log disabled");
  console.log = function () { };
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.querySelector("body").classList.remove('dark', 'light');
    document.querySelector("body").classList.add(theme);
  }
}

loadTheme()