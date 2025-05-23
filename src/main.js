
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import { MotionPlugin } from '@vueuse/motion'
import VueApexCharts from "vue3-apexcharts";


const app = createApp(App)
app.use(BootstrapVue3)
app.use(MotionPlugin)
app.use(VueApexCharts);
app.use(router).mount('#app')
