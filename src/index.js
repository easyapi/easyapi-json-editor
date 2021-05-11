import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'
import draggable from 'vuedraggable'
import PackageFile from '../package.json'

const VERSION = PackageFile.version;

const install = (Vue) => {
  if (install.installed) return;

  Vue.component('draggable', draggable);
  Vue.component('json-view', JsonView);
  Vue.component('array-view', ArrayView);

  Vue.component('easyapi-json-editor', JsonEditor);

};

export default install

export const components = {
  JsonEditor,
  VERSION
};
