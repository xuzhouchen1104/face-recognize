<template>
  <div>
     <div>
       <label>更换图片</label>
       <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
      </div>
      <div class="see">
        <img id="myImg68" src="images/xxm/xxm03.jpg" />
        <canvas id="myCanvas68" />
     </div>
  </div>

</template>

<script>
import * as faceapi from 'face-api.js';
export default {
  data() {
    return {
      options: null, // 模型参数
      imgEl: null,
      canvasEl: null,
      jawOutline: null,
      nose: null,
      mouth: null,
      leftEye : null ,
      rightEye : null ,
      leftEyeBbrow : null,
      rightEyeBrow : null
    };
  },
  mounted() {
    this.init().then(() => {
      this.runWithLandmarks();
    });
  },
  methods: {
    
    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImg68');
      this.canvasEl = document.getElementById('myCanvas68');
    },

    async runWithLandmarks() {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options)
      .withFaceLandmarks()

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
  
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeDetections);
      
     
      // const landmarks = resizeDetections[0].landmarks
      // this.jawOutline = landmarks.getJawOutline()
      // this.nose = landmarks.getNose()
      // this.mouth = landmarks.getMouth()
      // this.leftEye = landmarks.getLeftEye()
      // this.rightEye = landmarks.getRightEye()
      // this.leftEyeBbrow = landmarks.getLeftEyeBrow()
      // this.rightEyeBrow = landmarks.getRightEyeBrow()

      //  this.drawImg()
    },

     fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgEl.src = img.src;
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.runWithLandmarks();
      });
    }

  },
};
</script>

<style lang="scss">
.see {
  height: 1000px;
  position: relative;
  #myImg68,
  #myCanvas68 {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
