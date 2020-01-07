<template>
  <div id="jsoneditor"></div>
</template>

<script>
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'

export default {
  name: "JsonEditor",
  props: ['jsonData', 'commentData'],
  data: function() {
    return {
      selfEditor: null,
      dataNoteArr: []
    }
  },
  created() {
  },
  mounted() {
    // create the editor
    const container = document.getElementById("jsoneditor")
    const options = {
      search: false,
      colorPicker: false,
      sortObjectKeys: false,
      onChange: this.treeChange
    }
    this.selfEditor = new JSONEditor(container, options)

    // set json
    const initialJson = 
    this.selfEditor.set(this.jsonData)

    // get json
    const updatedJson = this.selfEditor.get()

    this.makeParamsNote()
  },
  methods: {
    getJson() {
      return this.selfEditor.get()
    },

    //生成数据注释
    makeParamsNote() {
      this.dataNoteArr = [];
      //生成数据类型
      const makeDataNote = oj => {
        oj.forEach(el => {
          if (el.childParams && el.childParams.length) {
            this.dataNoteArr.push({
              name: el.name,
              remark: el.remark
            });
            makeDataNote(el.childParams);
          } else {
            this.dataNoteArr.push({
              name: el.name,
              remark: el.remark
            });
          }
        });
      };
      makeDataNote(this.commentData)
      this.insertDataNote()
    },

    treeChange() {
      console.log(this.getJson())
    },

    insertDataNote() {
      const trees = document.getElementsByClassName('jsoneditor-tree')[0].getElementsByTagName('tbody')[0].childNodes
      
      const trDoms = []
      for (let i = 0; i < trees.length; i += 1) {
        if (i !== 0 && i !== trees.length - 1) {
          trDoms.push(trees[i])
        }
      }

      trDoms.forEach((el, index) => {
        let targetDom = el.querySelectorAll('.jsoneditor-tree')
        targetDom = targetDom[targetDom.length - 1]

        const noteDom = document.createElement('div')
        noteDom.classList.add('jsoneditor-tree')
        noteDom.innerHTML = `<div class="jsoneditor-value jsoneditor-note">${this.dataNoteArr[index].remark || ''}</div>`

        targetDom.parentElement.append(noteDom)
      })

      console.log(trDoms)
    }
  }
};
</script>

<style lang="less" scoped>

</style>


