<template>
  <div class="panel-right" :class="{ hidden: !configVisible }">
    <div class="title">文字配置</div>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="文字">
          <a-input v-model="currentConfig.label" placeholder />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="字体大小">
          <a-input v-model="currentConfig.labelCfgFontSize" placeholder />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="字体颜色">
          <a-input v-model="currentConfig.labelCfgFill" placeholder />
        </a-form-item>
      </a-col>
    </a-row>
    <div class="title">节点配置</div>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="形状">
          <!-- <a-select v-model="currentConfig.nodeShape" placeholder>
            <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
            <a-select-option value="mao">Maomao Zhou</a-select-option>
          </a-select>-->
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="背景色">
          <a-input v-model="currentConfig.nodeFill" placeholder />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <!-- <a-form-item label="边框虚线">
          <a-input v-model="currentConfig.nodeLineDash" placeholder />
        </a-form-item>-->
      </a-col>
      <a-col :span="12">
        <a-form-item label="边框颜色">
          <a-input v-model="currentConfig.nodeBorderColor" placeholder />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="宽">
          <a-input v-model="currentConfig.nodeWidth" placeholder />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="高">
          <a-input v-model="currentConfig.nodeHeight" placeholder />
        </a-form-item>
      </a-col>
    </a-row>
    <div
      :style="{
          position: 'absolute',
          right: 0,
          bottom: 20,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1000,
        }"
    >
      <a-button :style="{ marginRight: '8px' }">Cancel</a-button>
      <a-button type="primary" @click="save">Submit</a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    configVisible: {
      default: false
    },
    currentConfig: {
      default: {}
    },
    graph: {
      type: Object
    }
  },
  methods: {
    save() {
      const item = this.graph.findById(this.currentConfig.id);
      this.graph.updateItem(item, {
        label: this.currentConfig.label,
        labelCfg: {
            fontSize: Number(this.currentConfig.labelCfgFontSize),
            fill: this.currentConfig.labelCfgFill
        }
      })
    }
  },
  mounted() {
    //this.currentConfig = JSON.parse(JSON.stringify(this.current))
  },
  watch: {
    // currentConfig: {
    //   handler(newName, oldName) {
    //     const item = this.graph.findById(this.currentConfig.config.id);
    //     this.graph.updateItem(item, {
    //         label: this.currentConfig.label,
    //     });
    //   },
    //   deep: true
    // }
  }
};
</script>

<style lang="less" scoped>
.panel-right {
  position: fixed;
  right: 0;
  bottom: 0;
  top: 40px;
  width: 700px;
  background: #fff;
  height: 100%;
  z-index: 999;
  padding: 30px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  &.hidden {
    transform: translate(100%, 0);
  }
  .title {
    position: relative;
    padding: 16px 24px 16px 0;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 20px;
  }
}
</style>