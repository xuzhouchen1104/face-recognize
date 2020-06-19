<template>
  <div>
     <div>
       <label>更换图片</label>
       <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
      </div>
      <div class="see">
        <img id="myImgAge" src="images/xxm/xxm03.jpg" />
        <canvas id="myCanvasAge" />
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
      this.runWithexpression();
      // this.runWithexpression()
    });
  },
  methods: {
 
    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');


      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImgAge');
      this.canvasEl = document.getElementById('myCanvasAge');
    },

    async runWithexpression () {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options)
      .withFaceLandmarks().withAgeAndGender()

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);

      resizeDetections.forEach((result) => {
      const { age, gender, genderProbability } = result;
      new faceapi.draw.DrawTextField(
          [`${Math.round(age, 0)} years`, `${gender} (${Math.round(genderProbability)})`],
          result.detection.box.bottomLeft
        ).draw(this.canvasEl);
      });
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections)
    
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
  #myImgAge,
  #myCanvasAge {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
