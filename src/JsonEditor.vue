<template>
  <div class="ea-json-editor">
    <!-- <json-view :parsedData="parsedData" v-model="parsedData"></json-view> -->
    <json-view :ifRoot="true" v-model="parsedData"></json-view>
  </div>
</template>

<script>
import JsonView from "./JsonView.vue";

export default {
  name: "JsonEditor",
  props: {
    value: {
      required: true,
    },
    options: {
      type: Object,
      default: function () {
        return {
          confirmText: "确定",
          cancelText: "取消",
        };
      },
    },
  },
  provide() {
    return {
      formBtnText: this.options,
    };
  },
  data() {
    return {
      parsedData: [],
    };
  },
  created() {
    this.lastParsedData = {};
    if (!this.value || this.value.length <= 0) {
      this.parsedData = [
        {
          name: "根节点",
          type: "object",
          description: "",
          demo: "",
          childs: [],
        },
      ];
      return;
    }
    this.parsedData = this.value;
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
      deep: true,
    },
  },
  components: {
    "json-view": JsonView,
  },
  methods: {
    jsonParse: function (jsonStr) {
      if (!jsonStr || jsonStr.length == 0) {
        return [];
      }
      const parseJson = (json) => {
        let result = [];
        let keys = Object.keys(json);
        keys.forEach((k, index) => {
          let val = json[k];
          let parsedVal = val;

          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray([val[0]]);
          }

          let opt = {
            name: k,
            type: this.getType(val),
          };

          if (opt.type === "array" || opt.type === "object") {
            opt.childs = parsedVal;
            opt.demo = null;
          } else {
            opt.childs = null;
            opt.demo = parsedVal;
          }

          result.push(opt);
        });
        return result;
      };

      //
      const parseArray = (arrayObj) => {
        const result = [];
        for (let i = 0; i < arrayObj.length; ++i) {
          let val = arrayObj[i];
          let parsedVal = val;
          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray([val[0]]);
          }

          let opt = {
            name: null,
            type: this.getType(val),
          };

          if (opt.type === "array" || opt.type === "object") {
            opt.childs = parsedVal;
            opt.demo = null;
          } else {
            opt.childs = null;
            opt.demo = parsedVal;
          }

          result.push(opt);
        }
        return result;
      };

      // --
      const parseBody = (json) => {
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
      if (!dataArr || dataArr.length == 0) {
        return [];
      }
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
            val = el.demo;
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
            r = el.demo;
          }

          arr.push(r);
        }
        return arr;
      };

      const revertMain = function (data) {
        if (data[0].type === "array") {
          return revertWithArray(data[0].childs);
        } else if (data[0].type === "object") {
          return revertWithObj(data[0].childs);
        }
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
      //如果是数组，只显示第一个
      if (json.constructor === Array) {
        json = [json[0]];
      }
      //加上根节点
      let newData = {
        根节点: json,
      };
      this.parsedData = this.jsonParse(newData);
    },
  },
};
</script>

<style lang="less">
@import "./assets/styles/common.less";
</style>
