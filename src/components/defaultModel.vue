<template>
  <div>
    <div>
      <label>更换图片</label>
      <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
    </div>
    <div class="see">
      <img id="myImg" width="500px" height="500px" src="images/xxm/xxm03.jpg" />
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
    };
  },
  mounted() {
    this.init().then(() => {
      this.runWithDefault();
    });
  },
  methods: {
    async init() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgEl = document.getElementById('myImg');
      this.canvasEl = document.getElementById('myCanvas');
    },

    async runWithDefault() {
      const results = await faceapi.detectAllFaces(this.imgEl, this.options);

      // resize the overlay canvas to the input dimensions
      const displaySize = { width: this.imgEl.width, height: this.imgEl.height };

      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(results, displaySize);

      console.log(resizeDetections);

      // draw detections into the canvas
      faceapi.draw.drawDetections(this.canvasEl, resizeDetections);

      // const box = {
      //   x: resizeDetections[0].box.x,
      //   y: resizeDetections[0].box.y,
      //   width: resizeDetections[0].box.width,
      //   height: resizeDetections[0].box.height,
      // };
      // // see DrawBoxOptions below
      // const drawOptions = {
      //   label: '这是新垣结衣',
      //   lineWidth: 2,
      //   boxColor: 'red',
      // };
      // const drawBox = new faceapi.draw.DrawBox(box, drawOptions);
      // drawBox.draw(this.canvasEl);
    },

    fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgEl.src = img.src;
        this.canvasEl.getContext('2d').clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.runWithDefault();
      });
    },
  },
};
</script>

<style lang="scss">
.see {
  height: 800px;
  position: relative;
  #myImg,
  #myCanvas {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
