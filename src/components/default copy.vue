<template>
  <div>
     <div>
       <label>更换图片</label>
       <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
      </div>
      <div class="see">
        <img id="myImg" src="images/xxm/xxm03.jpg" />
        <canvas id="myCanvas" />
     </div>
  </div>

</template>

<script>
import * as faceapi from 'face-api.js';
import {getMouthMidPoint, getFaceWidth,getFaceLength,getFaceAngle , getArrMidPoint, getMidPointOfEyebrow} from './utils.js'
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
      // this.runWithDefault();
      this.runWithLandmarks();
      // this.runWithexpression()
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
      const results = await faceapi.detectAllFaces(this.imgEl, this.options);
      // .withFaceLandmarks();
      // .withFaceDescriptors();

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      console.log(resizeDetections);
    },


    async runWithLandmarks() {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options)
      .withFaceLandmarks()

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
  
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeDetections);
      
     
      const landmarks = resizeDetections[0].landmarks
      this.jawOutline = landmarks.getJawOutline()
      this.nose = landmarks.getNose()
      this.mouth = landmarks.getMouth()
      this.leftEye = landmarks.getLeftEye()
      this.rightEye = landmarks.getRightEye()
      this.leftEyeBbrow = landmarks.getLeftEyeBrow()
      this.rightEyeBrow = landmarks.getRightEyeBrow()

       this.drawImg()
    },


    async runWithexpression () {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options)
      .withFaceLandmarks().withFaceExpressions()

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      const minProbability = 0.05
       faceapi.draw.drawFaceExpressions(this.canvasEl, resizeDetections, minProbability)
      console.log(resizeDetections);
    },

    drawImg() {
      const info = this.setImgSize()
      const canvas = document.getElementById('myCanvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = 'images/1.png';
      img.onload = function() {
        ctx.translate(info.x,info.y);
        // ctx.drawImage(img, 0, 0, 100, 100);
      const {width, height} = info
      console.log(info);
      
      // ctx.save();
      // ctx.translate(x,y);
      ctx.rotate(info.angle);
      ctx.drawImage(img, -width/2, -height/2, width, height);
      // ctx.restore();

      };
      //前 4 个是定义图像源的切片位置和大小，后 4 个则是定义切片的目标显示位置和大小。
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    },

    setImgSize() {
      
      const mouth_mid_point = getMouthMidPoint(this.mouth)
      const face_width = getFaceWidth(this.jawOutline)
      const jawPoint = getArrMidPoint(this.jawOutline)
      const mid_eyebrow_ponit = getMidPointOfEyebrow(this.leftEyeBbrow, this.rightEyeBrow)
      
      const face_length = getFaceLength(jawPoint,mid_eyebrow_ponit)
      const angle = getFaceAngle(jawPoint,mid_eyebrow_ponit)
      return {
        width: face_width,
        height: face_length / 3,
        angle: angle,
        x: mouth_mid_point.x,
        y: mouth_mid_point.y
      }
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

    // drawFacemask(ctx , img, info) {
     
    // }
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
