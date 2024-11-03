<template>
    <div class="div">
      <button v-if="!isRecording" @click="startRecording">开始录音</button>
      <button v-else @click="stopRecording">停止录音</button>
      <audio v-if="recordedAudio" ref="audioPlayer" controls></audio>
    </div>
  </template>

  <script>
  export default {
    data () {
      return {
        isRecording: false,
        recordedAudio: null,
        mediaRecorder: null,
        chunks: []
      }
    },
    methods: {
      startRecording () {
        this.recordedAudio = false
        this.chunks = []
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            this.isRecording = true
            this.mediaRecorder = new MediaRecorder(stream)
            this.mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable)
            this.mediaRecorder.start()
          })
          .catch(error => {
            console.error('无法访问麦克风：', error)
          })
      },
      stopRecording () {
        this.isRecording = false
        this.mediaRecorder.stop()
        this.recordedAudio = true
      },
      handleDataAvailable (event) {
        this.chunks.push(event.data)
        if (this.mediaRecorder.state === 'inactive') {
          this.processRecordedAudio()
        }
      },
      processRecordedAudio () {
        const blob = new Blob(this.chunks, { type: 'audio/webm' })
        this.recordedAudio = URL.createObjectURL(blob)
        this.$refs.audioPlayer.src = this.recordedAudio
      }
    }
  }
  </script>
