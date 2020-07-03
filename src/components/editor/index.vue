<template>
  <div class="editor">
    <Header />
    <PanelLeft :canvasOffset="canvasOffset" :graph="graph" />
    <PanelRight :graph="graph" :currentConfig="currentConfig" :configVisible="configVisible" />
    <Sketchpad />
  </div>
</template>

<script>
import Header from "./layouts/Header";
import PanelLeft from "./layouts/PanelLeft";
import PanelRight from "./layouts/PanelRight";
import Sketchpad from "./layouts/Sketchpad";
import G6 from "./../../global/graph";
import data from "./../../global/graph/data";

export default {
  components: {
    Header,
    PanelLeft,
    PanelRight,
    Sketchpad
  },
  data() {
    return {
      graph: {},
      highLight: {
        undo: false,
        redo: false
      },
      // 保存线条样式
      lineStyle: {
        type: "line",
        width: 1
      },
      label: "",
      labelCfg: {
        fontSize: 12,
        fill: "#fff"
      },
      node: {
        fill: "",
        lineDash: "none",
        borderColor: "",
        width: 160,
        height: 60,
        shape: "rect-node"
      },
      nodeShapes: [
        {
          name: "矩形",
          shape: "rect-node"
        },
        {
          name: "圆形",
          shape: "circle-node"
        },
        {
          name: "椭圆",
          shape: "ellipise-node"
        },
        {
          name: "菱形",
          shape: "diamond-node"
        }
      ],
      headVisible: false,
      configVisible: false,
      config: "",
      tooltip: "",
      top: 0,
      left: 0,
      canvasOffset: {
        x: 0,
        y: 0
      },
      currentConfig: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.createGraphic();
      this.initGraphEvent();
    });
  },
  methods: {
    createGraphic() {
      const graph = new G6({
        width: window.innerWidth - 250,
        height: window.innerHeight - 40,
        layout: {
          type: "xxx"
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
    },
    initGraphEvent() {
      this.graph.on("on-canvas-dragend", e => {
        this.canvasOffset.x = e.dx;
        this.canvasOffset.y = e.dy;
      });

      this.graph.on("after-node-selected", e => {
        this.configVisible = !!e;
        if (e && e.item) {
          const model = e.item.get("model");

          this.config = model;
          this.label = model.label;
          this.labelCfg = {
            fill: model.labelCfg.fill,
            fontSize: model.labelCfg.fontSize
          };
          this.node = {
            fill: model.style.fill,
            borderColor: model.style.stroke,
            lineDash: model.style.lineDash || "none",
            width: model.style.width,
            height: model.style.height,
            shape: model.type
          };
          this.currentConfig = {
            config: model,
            id: model.id,
            label: model.label,
            labelCfgFill: model.labelCfg.fill,
            labelCfgFontSize: model.labelCfg.fontSize,
            nodeFill: model.style.fill,
            nodeBorderColor: model.style.stroke,
            nodeLineDash: model.style.lineDash || "none",
            nodeWidth: model.style.width,
            nodeHeight: model.style.height,
            nodeShape: model.type
          }
          console.log(model)
        }
      });

      this.graph.on("after-edge-selected", e => {
        this.configVisible = !!e;

        if (e && e.item) {
          this.config = e.item.get("model").id;
          this.graph.updateItem(e.item, {
            style: {
              radius: 10,
              lineWidth: 2
            }
          });
        }
      });

      this.graph.on("on-edge-mousemove", e => {
        if (e && e.item) {
          this.tooltip = e.item.get("model").label;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on("on-node-mousemove", e => {
        if (e && e.item) {
          this.tooltip = e.item.get("model").id;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on("on-node-mouseleave", e => {
        if (e && e.item) {
          this.tooltip = "";
        }
      });

      this.graph.on("on-edge-mouseleave", e => {
        if (e && e.item) {
          this.tooltip = "";
        }
      });

      this.graph.on("before-node-removed", ({ target, callback }) => {
        console.log(target);
        setTimeout(() => {
          // 确认提示
          callback(true);
        }, 1000);
      });

      this.graph.on("after-node-dblclick", e => {
        if (e && e.item) {
          console.log(e.item);
        }
      });

      this.graph.on(
        "before-edge-add",
        ({ source, target, sourceAnchor, targetAnchor }) => {
          setTimeout(() => {
            this.graph.addItem("edge", {
              source: source.get("id"),
              target: target.get("id"),
              sourceAnchor,
              targetAnchor
            });
          }, 100);
        }
      );
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
