<template>
  <div class="music-analyser">
    <canvas class="canvas-container" ref="canvas"></canvas>
    <audio
      :src="require('../assets/everywhere.mp3')"
      ref="audio"
    ></audio>
    <div class="button-tools">
      <button class="button" @click="audioPlay">{{ isInit ? '暂停' : '播放' }}</button>
      <button class="button" @click="getColor">切换颜色</button>
      <button class="button" @click="getPrev">上一首</button>
      <button class="button" @click="getNext">下一首</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      analyser: '',
      analyserData: '',
      isInit: false,
      currentColor: '240'
    }
  },
  methods: {
    getColor () {
      this.currentColor = `${Math.floor(Math.random() * 255)}`
      console.log('this.currentColor', this.currentColor)
    },
    audioPlay () {
      this.isInit = !this.isInit
      if (this.isInit) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
      // 创建音频上下文
      this.audioCtx = new AudioContext()
      // 创建音频源
      const source = this.audioCtx.createMediaElementSource(this.audio)
      // 创建分析器节点
      this.analyser = this.audioCtx.createAnalyser()
      // 设置窗口大小，窗口越大，分析结果越细腻
      this.analyser.fftSize = 256
      this.analyserData = new Uint8Array(this.analyser.frequencyBinCount)
      // 将源连接到分析器节点
      source.connect(this.analyser)
      // 将分析器节点连接到输出设备
      this.analyser.connect(this.audioCtx.destination)
      this.draw()
    },
    draw () {
      this.ctx = this.$refs.canvas.getContext('2d')
      requestAnimationFrame(this.draw)
      if (!this.isInit) return

      let baseColor = `hsla(${this.currentColor}, 100%, 50%, 1)`
      let gradient = this.generateGradient(baseColor, 100)

      // 清空画布
      let width = this.$refs.canvas.width * devicePixelRatio
      let height = this.$refs.canvas.height
      console.log('devicePixelRatio====', devicePixelRatio)
      this.ctx.clearRect(0, 0, width, height)

      // 把分析器节点的数据更新到data中
      this.analyser.getByteFrequencyData(this.analyserData)
      const len = this.analyserData.length
      console.log('analyserData====', this.analyserData)
      const barWidth = width / len
      console.log('analyserData====', len)
      // 每一个方块的高度
      const blockHeight = 4
      for (let index = 0; index < this.analyserData.length; index++) {
        const _data = this.analyserData[index]
        const barHeight = (_data / 255) * height
        const x = index * barWidth
        const blockCount = Math.round(barHeight / 4)
        for (let number = 0; number < blockCount; number++) {
          this.ctx.fillStyle = gradient[number]
          const y = height - blockHeight * number
          this.drawRoundedRect(x, y, barWidth - 1, blockHeight - 1, 0)
        }
      }
    },
    drawRoundedRect (x, y, width, height, radius) {
      if (height === 0) return
      this.ctx.beginPath()
      this.ctx.moveTo(x + radius, y)
      this.ctx.lineTo(x + width - radius, y)
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      this.ctx.lineTo(x + width, y + height - radius)
      this.ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      )
      this.ctx.lineTo(x + radius, y + height)
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      this.ctx.lineTo(x, y + radius)
      this.ctx.quadraticCurveTo(x, y, x + radius, y)
      this.ctx.fill()
    },
    generateGradient (baseColor, count) {
      let hsl = baseColor.match(
          /hsla?\((\d+),\s*(\d+%),\s*(\d+%),\s*([\d.]+)\)/
      )
      let h = parseInt(hsl[1], 10)
      let s = parseInt(hsl[2], 10)
      let l = parseInt(hsl[3], 10)

      let stepH = 360 / count

      let gradientColors = []
      for (let i = 0; i < count; i++) {
        gradientColors.push(`hsl(${h + i * stepH}, ${s}%, ${l}%)`)
      }

      return gradientColors
    }
  },
  mounted () {
    this.audio = this.$refs.audio
  }
}
</script>

<style scoped>
.music-analyser {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.canvas-container {
  width: 100vw - 400px;
  height: 500px;
  border: 4px solid #f2f2f2;
}

.button-tools {
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 20px;
}

.button {
  width: 200px;
  height: 70px;
  border-radius: 150px;
}

.button:active {
  opacity: 0.6;
}
</style>
