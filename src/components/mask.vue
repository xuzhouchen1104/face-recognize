<template>
  <div>
    <div>
      <label>更换图片</label>
      <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
    </div>
    <div class="see">
      <img id="myImgMask" src="images/xxm/xxm03.jpg" />
      <canvas id="myCanvasMask" />
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';
import { getMouthMidPoint, getFaceWidth, getFaceLength, getFaceAngle, getArrMidPoint, getMidPointOfEyebrow } from './utils.js';
export default {
  data() {
    return {
      options: null, // 模型参数
      imgEl: null,
      canvasEl: null,
      jawOutline: null,
      nose: null,
      mouth: null,
      leftEye: null,
      rightEye: null,
      leftEyeBbrow: null,
      rightEyeBrow: null,
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
    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImgMask');
      this.canvasEl = document.getElementById('myCanvasMask');
    },

    async runWithLandmarks() {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options).withFaceLandmarks();

      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);

      // faceapi.draw.drawDetections(this.canvasEl, resizeDetections);
      // faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeDetections);
      this.drawImg(resizeDetections);
    },

    drawImg(resizeDetections) {
      const canvas = document.getElementById('myCanvasMask');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = 'images/1.png';
      img.onload = () => {
        // 一张图片多个人脸
        for (let i = 0; i < resizeDetections.length; i++) {
          const landmarks = resizeDetections[i].landmarks;
          const jawOutline = landmarks.getJawOutline();
          const nose = landmarks.getNose();
          const mouth = landmarks.getMouth();
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const leftEyeBbrow = landmarks.getLeftEyeBrow();
          const rightEyeBrow = landmarks.getRightEyeBrow();
          const info = this.setImgSize({ jawOutline, nose, mouth, leftEye, rightEye, leftEyeBbrow, rightEyeBrow });
          ctx.save();
          ctx.translate(info.x, info.y);
          const { width, height } = info;
          ctx.rotate(info.angle);

          //后 4 个参数 是定义图像源的切片位置和大小
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          // 还原画布
          ctx.restore();
        }
      };
    },

    setImgSize({ jawOutline, mouth, leftEyeBbrow, rightEyeBrow }) {
      // console.log(nose,leftEye,rightEye);
      const mouth_mid_point = getMouthMidPoint(mouth);
      const face_width = getFaceWidth(jawOutline);
      const jawPoint = getArrMidPoint(jawOutline);
      const mid_eyebrow_ponit = getMidPointOfEyebrow(leftEyeBbrow, rightEyeBrow);

      const face_length = getFaceLength(jawPoint, mid_eyebrow_ponit);
      const angle = getFaceAngle(jawPoint, mid_eyebrow_ponit);

      return {
        width: face_width,
        height: face_length / 3,
        angle: angle,
        x: mouth_mid_point.x,
        y: mouth_mid_point.y,
      };
    },
    fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgEl.src = img.src;
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.runWithLandmarks();
      });
    },

    // drawFacemask(ctx , img, info) {

    // }
  },
};
</script>

<style lang="scss">
.see {
  height: 800px;
  position: relative;
  #myImgMask,
  #myCanvasMask {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
