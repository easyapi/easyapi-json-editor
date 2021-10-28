<template>
  <div class="ea-json-editor">
    <!-- <json-view :parsedData="parsedData" v-model="parsedData"></json-view> -->
    <json-view v-model="parsedData"></json-view>

  </div>
</template>

<script>
  import JsonView from "./JsonView.vue";

  export default {
    name: "JsonEditor",
    props: {
      value: {
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
        parsedData: []
      };
    },
    created() {
      this.lastParsedData = {};
      this.parsedData = this.value;
      console.log('this.parsedData',  this.parsedData);

      // this.importJSON(this.parsedData || {});
    },
    watch: {
      value: {
        handler(newValue, oldValue) {
          // this.parsedData = this.jsonParse(this.objData)
          this.parsedData = this.value;
        },
      },
      parsedData: {
        handler(newValue, oldValue) {
          // if (JSON.stringify(newValue) === JSON.stringify(this.lastParsedData)) {
          //   return;
          // }
          // this.lastParsedData = newValue;
          this.$emit("input", this.parsedData);
        },
        deep: true
      }
    },
    components: {
      "json-view": JsonView
    },
    methods: {
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
          return parseJson(json);
        };

        return parseBody(jsonStr);
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
        const revertWithObj = function (data) {
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

        const revertWithArray = function (data) {
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

        const revertMain = function (data) {
          return revertWithObj(data);
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
        this.parsedData = this.jsonParse(json);
      }
    }
  };
</script>

<style lang="less">
  @import "./assets/styles/common.less";
</style>
