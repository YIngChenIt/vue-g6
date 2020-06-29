<template>
  <div class="editor">
    <Header />
    <PanelLeft />
    <Sketchpad />
  </div>
</template>

<script>
import Header from "./layouts/Header";
import PanelLeft from "./layouts/PanelLeft";
import Sketchpad from "./layouts/Sketchpad";
import G6 from "./../../global/graph";
import data from "./../../global/graph/data";

export default {
  components: {
    Header,
    PanelLeft,
    Sketchpad
  },
  data() {
    return {
      graph: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.createGraphic()
    });
  },
  methods: {
    createGraphic() {
      const graph = new G6({
        width: window.innerWidth - 250,
        height: window.innerHeight - 40,
        // renderer: 'svg',
        layout: {
          type: "xxx" // 位置将固定
        },
        defaultNode: {
          type: "rect-node",
          style: {
            radius: 10
          },
          labelCfg: {
            fontSize: 20
          }
        },
        // 覆盖全局样式
        nodeStateStyles: {
          "nodeState:default": {
            opacity: 1
          },
          "nodeState:hover": {
            opacity: 0.8
          },
          "nodeState:selected": {
            opacity: 0.9
          }
        },
        // 默认边不同状态下的样式集合
        edgeStateStyles: {
          "edgeState:default": {
            stroke: "#aab7c3"
          },
          "edgeState:selected": {
            stroke: "#1890FF"
          },
          "edgeState:hover": {
            stroke: "#1890FF",
            animate: true
          }
        },
        // 自定义注册行为, 事件, 交互
        registerFactory: (G6, cfg) => {
          const minimap = new G6.Minimap({
            size: [300, 200]
          });
          const grid = new G6.Grid();

          cfg.plugins = [minimap, grid];

          return new G6.Graph(cfg);
        }
        // ... 其他G6原生入参
      });
      this.graph = graph.instance;
      this.graph.read(data);
      this.graph.paint();
    }
  }
};
</script>

<style lang="less" scoped>
.editor {
  /deep/.g6-minimap {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
