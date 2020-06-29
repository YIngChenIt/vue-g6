<template>
  <div class="header">
    <div class="operating">
      <div :title="item.tip" :key="index" v-for="(item, index) in toolList" class="operating-item">
        <i :class="['iconfont', item.code]"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["toolList"])
  }
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  -webkit-box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  z-index: 500;
  -webkit-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  .operating {
    display: flex;
    align-items: center;
    justify-content: center;
    .operating-item {
      min-width: 25px;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      text-align: center;
      margin: 0 2px;
      opacity: 0.3;
      color: #000000;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>