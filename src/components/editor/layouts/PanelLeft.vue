<template>
  <div ref="itemPanel" class="panel-left">
    <div class="panel-item" :key="index" v-for="(item, index) in materials">
      <div class="header">
        <div class="title">{{ item.title }}</div>
        <div class="icon-tool">
          <i class="iconfont icon-jiantou panel-icon"></i>
        </div>
      </div>
      <div class="container">
        <div
          class="node"
          :key="idx"
          v-for="(itm, idx) in item.children"
          :style="() => setDefaultStyle()"
          @click="(e) => addNode(itm, e)"
          @dragend="(e) => addNode(itm, e)"
          draggable="true"
        >
          <div class="content" :title="itm.title">
            <svg class="icon" v-html="itm.icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    graph: {
      type: Object
    },
    canvasOffset: {
      type: Object
    }
  },
  methods: {
    setDefaultStyle(item) {
      const style = {};
      if (item.width) {
        style.width = item.width + "px";
      }
      if (item.height) {
        style.height = item.height + "px";
      }
      return style;
    },
    addNode(item, e) {
      console.log(e)
      const model = {
        text: "node",
        type: item.shape,
        x: e.clientX - this.canvasOffset.x - 250,
        y: e.clientY - this.canvasOffset.y - 40
      };
      this.graph.addItem("node", model);
    }
  },
  mounted() {
    document.addEventListener(
      "drop",
      e => {
        e.preventDefault();
      },
      false
    );
  },
  computed: {
    ...mapGetters(["materials"])
  }
};
</script>

<style lang="less" scoped>
.panel-left {
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 0;
  -webkit-box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  z-index: 200;
  -webkit-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  width: 250px;
  overflow-y: auto;
  .panel-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      font-size: 14px;
      .panel-icon {
        font-size: 14px;
      }
    }
    .container {
      .node {
        display: inline-block;
        margin: 6px;
        border: 1px solid transparent;
        .icon {
          left: 1px;
          top: 1px;
          width: 32px;
          height: 30px;
          display: block;
          position: relative;
          overflow: hidden;
        }
      }
    }
  }
}
</style>