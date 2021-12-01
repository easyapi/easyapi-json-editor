<template>
  <div class="block_content array">
    <ol class="array-ol">
      <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
        <li
          v-for="(member, index) in flowData"
          :key="`${member.type}${index}`"
          :class="['array-item', {'hide-item': hideMyItem[index] == true}]"
        >
          <p v-if="member.type !== 'object' && member.type !== 'array'">
            <input
              type="text"
              v-model="member.demo"
              class="val-input"
              v-if="member.type === 'string'"
              placeholder="string"
            />
            <input
              type="number"
              v-model.number="member.demo"
              class="val-input"
              v-if="member.type == 'number'"
              placeholder="number"
              @input="numberInputChange(member)"
            />
            <select
              name="value"
              v-model="member.demo"
              class="val-input"
              v-if="member.type == 'boolean'"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
            <input type="text" v-model="member.description" class="des-input" placeholder="注释"/>
          </p>

          <div v-else>
            <span :class="['json-key', 'json-desc']">
              {{member.type.toUpperCase()}}
              <i
                class="collapse-down v-json-edit-icon-arrow_drop_down"
                v-if="member.type == 'object' || member.type == 'array'"
                @click="closeBlock(index, $event)"
              ></i>
              <i v-if="member.type == 'object'">{{'{' + member.childs.length + '}'}}</i>
              <i v-if="member.type == 'array'">{{'[' + member.childs.length + ']'}}</i>
            </span>

            <span class="json-val">
              <template v-if="member.type == 'array'">
                <!-- <array-view :parsedData="member.childs || []" v-model="member.childs"></array-view> -->
                <array-view v-model="member.childs"></array-view>

              </template>

              <template v-if="member.type == 'object'">
                <!-- <json-view :parsedData="member.childs || {}" v-model="member.childs"></json-view> -->
                <json-view v-model="member.childs"></json-view>

              </template>
            </span>
          </div>

          <div class="tools">
            <select v-model="member.type" class="tools-types" @change="itemTypeChange(member)">
              <option v-for="(item, index) in formats" :value="item" :key="index">{{item}}</option>
            </select>
            <i class="dragbar v-json-edit-icon-drag"></i>
            <i class="del-btn" @click="delItem(value, member, index)">
              <i class="v-json-edit-icon-huishouzhan_huaban"></i>
            </i>
          </div>
        </li>
      </draggable>
    </ol>

    <item-add-form v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem" :needName="false"></item-add-form>

    <div class="block add-key" v-if="!toAddItem" @click="addItem">
      <i class="v-json-edit-icon-add"></i>
    </div>
  </div>
</template>

<script>
  import ItemAddForm from "./ItemAddForm.vue";

  export default {
    name: "ArrayView",
    // props: ["parsedData"],
    props: ["value"],

    data: function () {
      return {
        formats: ["string", "array", "object", "number", "boolean"],
        flowData: this.value,
        toAddItem: false,
        hideMyItem: {}
      };
    },
    watch: {
      value: {
        handler(newValue, oldValue) {
          this.flowData = this.value || [];
        }
      }
    },
    components: {
      "item-add-form": ItemAddForm,
      "json-view": () => import("./JsonView.vue")
    },
    methods: {
      delItem: function (parentDom, item, index) {
        this.flowData.splice(index, 1);
        if (this.hideMyItem[index]) this.hideMyItem[index] = false;
        this.$emit("input", this.flowData);
      },

      addItem: function () {
        this.toAddItem = true;
      },

      cancelNewItem: function () {
        this.toAddItem = false;
      },

      closeBlock: function (index, e) {
        this.$set(this.hideMyItem, index, !this.hideMyItem[index]);
      },

      newItem: function (obj) {
        this.toAddItem = false;

        let oj = {
          name: obj.key,
          type: obj.type,
          description: "",
          demo: "",
          ifRoot: false
        };
        if (obj.type === "array" || obj.type === "object") {
          oj.childs = obj.val;
          oj.demo = null;
        } else {
          oj.childs = null;
          oj.demo = obj.val;
        }

        this.flowData.push(oj);
        this.$emit("input", this.flowData);
        this.cancelNewItem();
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
      }
    }
  };
</script>
