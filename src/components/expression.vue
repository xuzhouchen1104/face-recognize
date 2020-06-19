<template>
  <div>
     <div>
       <label>更换图片</label>
       <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
      </div>
      <div class="see">
        <img id="myImgExp" src="images/xxm/xxm03.jpg" />
        <canvas id="myCanvasExp" />
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

    };
  },
  mounted() {
    this.init().then(() => {
      // this.runWithDefault();
      // this.runWithLandmarks();
      this.runWithexpression()
    });
  },
  methods: {

    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImgExp');
      this.canvasEl = document.getElementById('myCanvasExp');
    },

    async runWithexpression () {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options)
      .withFaceLandmarks().withFaceExpressions()

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      // draw a textbox displaying the face expressions with minimum probability into the canvas
      const minProbability = 0.3
       faceapi.draw.drawFaceExpressions(this.canvasEl, resizeDetections, minProbability)
      console.log(resizeDetections);
  
    },

     fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgEl.src = img.src;
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.runWithexpression();
      });
    }

  },
};
</script>

<style lang="scss">
.see {
  height: 1000px;
  position: relative;
  #myImgExp,
  #myCanvasExp {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
