<template>
  <div class="block_content">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div
        v-for="(item, index) in flowData"
        :key="`${item.type}${index}`"
        :class="[
          'block',
          'clearfix',
          { 'hide-block': hideMyBlock[index] === true },
        ]"
      >
        <span class="json-key">
          <input
            type="text"
            v-model="item.name"
            class="key-input"
            v-if="typeof item.name === 'string'"
            @blur="keyInputBlur(item, $event)"
          />
          <i
            class="collapse-down v-json-edit-icon-arrow_drop_down"
            v-if="item.type === 'object' || item.type === 'array'"
            @click="closeBlock(index, $event)"
          ></i>
          <i v-if="item.type === 'object'" class="i-type">{{
            "{" + item.childs.length + "}"
          }}</i>
          <i v-if="item.type === 'array'" class="i-type">{{
            "[" + item.childs.length + "]"
          }}</i>
          <input
            type="text"
            v-model="item.description"
            v-if="item.childs"
            class="des-input"
            placeholder="注释"
          />
        </span>
        <span class="json-val">
          <template v-if="item.type === 'object'">
            <!-- <json-view :parsedData="item.childs" v-model="item.childs"></json-view> -->
            <json-view :ifRoot="false" v-model="item.childs"></json-view>
          </template>

          <template v-else-if="item.type === 'array'">
            <!-- <array-view :parsedData="item.childs" v-model="item.childs"></array-view> -->
            <array-view v-model="item.childs"></array-view>
          </template>

          <template v-else>
            <span class="val">
              <input
                type="text"
                v-model="item.demo"
                class="val-input"
                v-if="item.type === 'string'"
              />
              <input
                type="number"
                v-model.number="item.demo"
                class="val-input"
                v-if="item.type === 'number'"
                @input="numberInputChange(member)"
              />
              <select
                name="value"
                v-model="item.demo"
                class="val-input"
                v-if="item.type === 'boolean'"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
            </span>
            <input
              type="text"
              v-model="item.description"
              class="des-input"
              placeholder="注释"
            />
          </template>
        </span>

        <div class="tools">
          <select
            v-model="item.type"
            class="tools-types"
            @change="itemTypeChange(item)"
          >
            <option v-for="(type, index) in formats" :value="type" :key="index">
              {{ type }}
            </option>
          </select>
          <i class="dragbar v-json-edit-icon-drag" v-if="!ifRoot"></i>
          <i
            class="del-btn"
            @click="delItem(value, item, index)"
            v-if="!ifRoot"
          >
            <i class="v-json-edit-icon-huishouzhan_huaban"></i>
          </i>
        </div>
      </div>
    </draggable>

    <item-add-form
      v-if="toAddItem"
      @confirm="newItem"
      @cancel="cancelNewItem"
    ></item-add-form>

    <div class="block add-key" @click="addItem" v-if="(!toAddItem && !ifRoot)">
      <!-- <div class="block add-key" @click="addItem" v-if="flowData[0].ifRoot"> -->
      <i class="v-json-edit-icon-add"></i>
    </div>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";

export default {
  name: "JsonView",
  props: {
    // parsedData: {}
    value: {},
    ifRoot: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // formats: ["string", "array", "object", "number", "boolean"],
      formats: ["string", "array", "object", "double", "int", "byte", "short","long","float","date","datetime", "boolean"],

      flowData: this.value,
      toAddItem: false,
      hideMyBlock: {},
    };
  },
  created() {
    
    // if (this.ifRoot) {
    //   //如果是根节点，但是没有初始值的话，要给一个根节点初始值
    //   if (!this.value || this.value.length <= 0) {
    //     this.flowData = [
    //       {
    //         name: "根节点",
    //         type: "object",
    //         description: "",
    //         demo: "",
    //         childs: [],
    //       },
    //     ];
    //     return;
    //   }
    // }
    this.flowData = this.value || {};
    console.log("created---->",this.flowData);
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.flowData = this.value;
        console.log("watch---->",this.flowData);
      },
    },
  },
  components: {
    "item-add-form": ItemAddForm,
    "array-view": () => import("./ArrayView.vue"),
  },
  methods: {
    delItem: function (parentDom, item, index) {
      this.flowData.splice(index, 1);
      if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
      this.$emit("input", this.flowData);
    },

    closeBlock: function (index, e) {
      this.$set(this.hideMyBlock, index, !this.hideMyBlock[index]);
    },

    addItem: function () {
      this.toAddItem = true;
    },

    cancelNewItem: function () {
      this.toAddItem = false;
    },

    newItem: function (obj) {
      let oj = {
        name: obj.key,
        type: obj.type,
        description: "",
        demo: "",
        ifRoot: false,
      };
      if (obj.type === "array" || obj.type === "object") {
        oj.childs = obj.val;
        oj.demo = null;
      } else {
        oj.childs = null;
        oj.demo = obj.val;
      }

      if (!oj.name) {
        alert("please must input a name!");
        return;
      }
      this.flowData.push(oj);
      this.$emit("input", this.flowData);
      this.cancelNewItem();
    },

    keyInputBlur: function (item, e) {
      if (item.name.length <= 0) {
        alert("please must input a name!");
        item.name = "null";
        e.target.focus();
      }
    },

    onDragEnd: function () {
      this.$emit("input", this.flowData);
    },

    itemTypeChange: function (item) {
      if (item.type === "array" || item.type === "object") {
        item.childs = [];
        item.demo = null;
      }
      if (item.type === "boolean") {
        item.childs = null;
        item.demo = true;
      }
      if (item.type === "string") {
        item.childs = null;
        item.demo = "";
      }
      if (item.type === "number") {
        item.childs = null;
        item.demo = 0;
      }
    },

    numberInputChange: function (item) {
      if (!item.demo) item.demo = 0;
    },
  },
};
</script>
