import VueVirtualScrollTree from './VueVirtualScrollTree'

const components = [
  VueVirtualScrollTree
]

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./../assets/icon', true, /\.svg$/)
requireAll(req)

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { install, VueVirtualScrollTree }
