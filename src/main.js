import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./assets/icon', true, /\.svg$/)
requireAll(req)

createApp(App).use(store).use(router).mount('#app')
