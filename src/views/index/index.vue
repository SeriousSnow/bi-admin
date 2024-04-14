<template>
  <div ref="sparticles" class="container">
    <div class="title">AI应用后台管理系统</div>
    <div class="sub-title">bi-admin</div>
  </div>
</template>

<script>
  import Sparticles from 'sparticles'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        options: {
          composition: 'source-over',
          count: 544,
          speed: 10,
          parallax: 1,
          direction: 180,
          xVariance: 2,
          yVariance: 2,
          rotate: true,
          rotation: 1,
          alphaSpeed: 10,
          alphaVariance: 1,
          minAlpha: 0,
          maxAlpha: 1,
          minSize: 1,
          maxSize: 10,
          style: 'fill',
          bounce: false,
          drift: 1,
          glow: 0,
          twinkle: false,
          color: ['#8057cb'],
          shape: 'circle',
          imageUrl: '',
        },
      }
    },
    created() {},
    beforeDestroy() {},
    mounted() {
      new Sparticles(this.$refs.sparticles, this.options)
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;

    .title {
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      position: absolute;
      left: 50%;
      top: 55%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      color: #666;
      margin-top: 10px;
    }
  }
</style>
