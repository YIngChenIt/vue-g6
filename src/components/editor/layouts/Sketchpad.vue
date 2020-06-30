<template>
  <div class="canvasPanel" id="canvasPanel" @dragover.prevent></div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.canvasPanel {
  position: fixed !important;
  right: 0;
  bottom: 0;
  background: #fff;
  left: 250px;
  top: 40px;
}
</style>