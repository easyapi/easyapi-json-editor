<template>
  <div class="ea-json-editor">  
    <select v-model="rootType" @change="rootTypeChange" :disabled="!!parsedData.length" style="margin-bottom: 8px">
      <option value="array">Array</option>
      <option value="object">Object</option>
    </select>
    <json-view v-if="rootType === 'object'" :parsedData="parsedData" v-model="parsedData" />
    <array-view v-if="rootType === 'array'" :parsedData="parsedData" v-model="parsedData" />
  </div>
</template>

<script>
  import JsonView from "./JsonView.vue";
  import ArrayView from './ArrayView.vue';

  export default {
    name: "JsonEditor",
    props: {
      objData: {
        type: Object | Array,
        required: true
      },
      options: {
        type: Object,
        default: function () {
          return {
            confirmText: "确定",
            cancelText: "取消"
          };
        }
      }
    },
    provide() {
      return {
        formBtnText: this.options
      };
    },
    data() {
      return {
        parsedData: [],
        rootType: 'object'
      };
    },
    created() {
      this.parsedData = this.objData;
      console.log('this.parsedData',  this.parsedData);

      this.importJSON(this.parsedData || {});
    },
    watch: {
      objData: {
        handler(newValue, oldValue) {
          this.parsedData = this.jsonParse(this.objData);
        },
      },
      parsedData: {
        handler(newValue, oldValue) {
          console.log('newVal', this.parsedData);
          this.$emit("input", this.parsedData);
        },
        deep: true
      }
    },
    components: {
      "json-view": JsonView,
      'array-view': ArrayView
    },
    methods: {
      rootTypeChange: function(e) {
        console.log(e);
      },
      jsonParse: function (jsonStr) {
        const parseJson = json => {
          let result = [];
          let keys = Object.keys(json);
          keys.forEach((k, index) => {
            let val = json[k];
            let parsedVal = val;

            if (this.getType(val) === "object") {
              parsedVal = parseJson(val);
            } else if (this.getType(val) === "array") {
              parsedVal = parseArray(val);
            }

            let opt = {
              name: k,
              type: this.getType(val)
            };

            if (opt.type === "array" || opt.type === "object") {
              opt.childs = parsedVal;
              opt.sample = null;
            } else {
              opt.childs = null;
              opt.sample = parsedVal;
            }

            result.push(opt);
          });
          return result;
        };

        //
        const parseArray = arrayObj => {
          const result = [];
          for (let i = 0; i < arrayObj.length; ++i) {
            let val = arrayObj[i];
            let parsedVal = val;
            if (this.getType(val) === "object") {
              parsedVal = parseJson(val);
            } else if (this.getType(val) === "array") {
              parsedVal = parseArray(val);
            }

            let opt = {
              name: null,
              type: this.getType(val)
            };

            if (opt.type === "array" || opt.type === "object") {
              opt.childs = parsedVal;
              opt.sample = null;
            } else {
              opt.childs = null;
              opt.sample = parsedVal;
            }

            result.push(opt);
          }
          return result;
        };

        // --
        const parseBody = json => {
          const type = Object.prototype.toString.call(json);
          if(type === '[object Array]') {
            this.rootType = 'array';
            return parseArray(json);
          }
          if(type === '[object Object]') {
            this.rootType = 'object';
            return parseJson(json)
          }
        };

        const result = parseBody(jsonStr);
        return result;
      },

      getType: function (obj) {
        switch (Object.prototype.toString.call(obj)) {
          case "[object Array]":
            return "array";
            break;
          case "[object Object]":
            return "object";
            break;
          case "[object Null]":
          case "[object Function]":
          case "[object Undefined]":
            return "string";
            break;
          default:
            return typeof obj;
            break;
        }
      },

      makeJson: function (dataArr) {
        const revertWithObj = (data) => {
          let r = {};
          for (let i = 0; i < data.length; ++i) {
            let el = data[i];
            let key, val;
            key = el.name;
            if (el.type === "array") {
              val = revertWithArray(el.childs);
            } else if (el.type === "object") {
              val = revertWithObj(el.childs);
            } else {
              val = el.sample;
            }

            r[key] = val;
          }
          return r;
        };

        const revertWithArray = (data) => {
          let arr = [];
          for (let i = 0; i < data.length; ++i) {
            let el = data[i];
            let r;
            if (el.type === "array") {
              r = revertWithArray(el.childs);
            } else if (el.type === "object") {
              r = revertWithObj(el.childs);
            } else {
              r = el.sample;
            }

            arr.push(r);
          }
          return arr;
        };

        const revertMain = (data) => {
          if(this.rootType === 'array') {
            return revertWithArray(data);
          } else if(this.rootType === 'object') {
            return revertWithObj(data);
          }
        };

        return revertMain(dataArr);
      },

      getJSONEditorData: function () {
        return this.parsedData;
      },

      exportJSON: function () {
        return this.makeJson(this.parsedData);
      },

      importJSON: function (json) {
        //如果入参根类型为数组，定义JSON根类型为数组
        //如果入参根类型为对象，定义JSON根类型为对象

        this.parsedData = this.jsonParse(json);
      }
    }
  };
</script>

<style lang="less">
  @import "./assets/styles/common.less";
</style>
