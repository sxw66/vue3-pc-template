import BaseSvgIcon from '@/components/base-svg-icon' // svg component

// const req = require.context('./svg', false, /\.svg$/)
const req = import.meta.globEager('./svg/*.svg')

const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)

export default BaseSvgIcon
