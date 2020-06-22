<template>
  <div>
    <div>
      <div>
        <img id="myImgOri" src="images/xxm/1.jpg" />
      </div>
      <label>更换图片</label>
      <input type="file" accept="image/png, image/jpeg" @change="fnChange($event)" />
    </div>
    <div class="see">
      <img id="myImgDet" src="images/xxm/xxm03.jpg" />
      <canvas id="myCanvasDet" />
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
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      this.options = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.5, // 0.1~0.9
      });

      this.imgElOri = document.getElementById('myImgOri');
      this.imgElDet = document.getElementById('myImgDet');
      this.canvasEl = document.getElementById('myCanvasDet');
    },

    async runWithDefault() {
      const results = await faceapi
        .detectAllFaces(this.imgElOri, this.options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!results.length) {
        return;
      }

      const descriptors = [];
      results.forEach((fd) => {
        descriptors.push(fd.descriptor);
      });

      const labeledDescriptors = [new faceapi.LabeledFaceDescriptors('新垣结衣', descriptors)];

      // create FaceMatcher with automatically assigned labels
      // from the detection results for the reference image
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

      const resultsDet = await faceapi
        .detectAllFaces(this.imgElDet)
        .withFaceLandmarks()
        .withFaceDescriptors();

      resultsDet.forEach((fd) => {
        const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
        console.log(bestMatch.toString());
      });

      const displaySize = { width: this.imgElDet.width, height: this.imgElDet.height };
      faceapi.matchDimensions(this.canvasEl, displaySize);

      const resizeDetections = faceapi.resizeResults(resultsDet, displaySize);
      resizeDetections.forEach(({ detection, descriptor }) => {
        let best = faceMatcher.findBestMatch(descriptor);
        let label = best.toString();
        const box = {
          x: detection.box.x,
          y: detection.box.y,
          width: detection.box.width,
          height: detection.box.height,
        };
        const drawBox = new faceapi.draw.DrawBox(box, { label });
        drawBox.draw(this.canvasEl);
      });
    },

    fnChange(e) {
      if (!e.target.files.length) return;
      // 将文件显示为图像并识别
      faceapi.bufferToImage(e.target.files[0]).then((img) => {
        this.imgElDet.src = img.src;
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
  #myImgDet,
  #myCanvasDet {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
