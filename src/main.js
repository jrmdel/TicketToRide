import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore'

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyCcNwnXTiqHGQxOopRIRCrhLWKXnSygMTE",
  authDomain: "tickettoride-13f5e.firebaseapp.com",
  databaseURL: "https://tickettoride-13f5e.firebaseio.com",
  projectId: "tickettoride-13f5e",
  storageBucket: "tickettoride-13f5e.appspot.com",
  messagingSenderId: "373665950379",
  appId: "1:373665950379:web:01d627fc2327d96b48a5ee"
})

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
