<template>
  <div>
    <ea-json-editor :jsonData="jsonData" :commentData="commentData" ref="jsonEdit"></ea-json-editor>
    <button @click="getJson">GET JSON</button>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      jsonData: {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": {"a": "b", "c": "d"},
        "String": "Hello World"
      },

      commentData: [
        {
          name: "Array",
          remark: "数组"
        },
        {
          name: "Boolean",
          remark: "布尔"
        },
        {
          name: "Null",
          remark: "Null"
        },
        {
          name: "Number",
          remark: "数字"
        },
        {
          name: "Object",
          remark: "对象"
        },
        {
          name: "String",
          remark: "字符串"
        },
      ]
    }
  },
  methods: {
    getJson() {
      console.log( this.$refs.jsonEdit.getJson() )
    }
  }
}
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");
</style>


