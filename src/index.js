import Vue from 'vue'
import JsonEditor from './JsonEditor.vue'
import PackageFile from '../package.json'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/common.less';
// import {
//   Checkbox,
//   Select,
//   Option,
//   Input,
//   Icon,
//   Button,
//   Table,
//   TableColumn,
//   Dialog

// } from "element-ui"

const VERSION = PackageFile.version

// Vue.use(Checkbox)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Input)
// Vue.use(Icon)
// Vue.use(Button)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Dialog)


const install = (Vue) => {
  if (install.installed) return

  Vue.component('ea-json-editor', JsonEditor)
}

export default install

export const components = {
  JsonEditor,
  VERSION
}