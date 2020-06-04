<template>
  <div>
     <div>
       <label>更换图片</label>
       <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
      </div>
      <div class="see">
        <img id="myImg" width="400px" height="600px" src="images/xxm/xxm03.jpg" />
        <canvas id="myCanvas" />
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
      this.runWithDefault();
    });
  },
  methods: {
    // ageGenderNet 识别性别和年龄 1
    // faceExpressionNet 识别表情,开心，沮丧，普通 1
    // faceLandmark68Net 识别脸部特征用于mobilenet算法 1
    // faceLandmark68TinyNet 识别脸部特征用于tiny算法 1
    // faceRecognitionNet 识别人脸 1
    // ssdMobilenetv1 google开源AI算法除库包含分类和线性回归 1
    // tinyFaceDetector 比Google的mobilenet更轻量级，速度更快一点 1
    // mtcnn  多任务CNN算法，一开浏览器就卡死 1
    // tinyYolov2 识别身体轮廓的算法，不知道怎么用
    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');


      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImg');
      this.canvasEl = document.getElementById('myCanvas');
    },


    async runWithDefault() {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options).withFaceLandmarks().withFaceDescriptors();
      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
  
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
    },

  
     fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgEl.src = img.src;
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.runWithDefault();
      });
    }
  },
};
</script>

<style lang="scss">
.see {
  height: 1000px;
  position: relative;
  #myImg,
  #myCanvas {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
