import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';
import VueApexCharts from 'vue-apexcharts';
import i18n from './i18n';
import LocalStorageService from './services/localStorageService';
import BonusService from './services/bonusService';
import frag from 'vue-frag';
Vue.use(VueApexCharts);

Vue.component('ApexChart', VueApexCharts);
Vue.directive('frag', frag);
Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: 'AIzaSyCcNwnXTiqHGQxOopRIRCrhLWKXnSygMTE',
  authDomain: 'tickettoride-13f5e.firebaseapp.com',
  databaseURL: 'https://tickettoride-13f5e.firebaseio.com',
  projectId: 'tickettoride-13f5e',
  storageBucket: 'tickettoride-13f5e.appspot.com',
  messagingSenderId: '373665950379',
  appId: '1:373665950379:web:01d627fc2327d96b48a5ee',
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  i18n,
  render: (h) => h(App),
  provide: {
    localStorageService: LocalStorageService,
    bonusService: BonusService,
  },
}).$mount('#app');
