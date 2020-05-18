<template>
  <div>
    <canvas id="canvas" width="600" height="600"></canvas>
  </div>
</template>

<script>
export default {
  mounted() {
    // this.drawRect();
    // this.drawLine();
    // this.drawArc();
    // this.drawBezier();
    // this.drawImg();
    // this.saveAndStore();
    this.translate();
    // this.drawAnimation();
  },
  methods: {
    drawRect() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      // 绘制填充的矩形
      ctx.fillRect(20, 20, 50, 50);
      // 绘制一个矩形的边框
      ctx.strokeRect(20, 100, 100, 100);
      // 清除指定的矩形区域，然后这块区域完全透明
      ctx.clearRect(20, 20, 10, 10);
      // 绘制一个矩形形状，需要配合ctx.stroke, 或者ctx.fill
      // ctx.rect(200, 200, 10, 10);
    },

    drawLine() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.beginPath(); //新建一条path
      ctx.moveTo(50, 50); //把画笔移动到指定的坐标 ，起点
      ctx.lineTo(200, 50); //绘制一条从当前位置到指定坐标(200, 50)的直线.
      ctx.lineTo(200, 200); //绘制一条从当前位置到指定坐标(200, 50)的直线.
      ctx.closePath(); //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
      ctx.stroke();
      ctx.fill(); //填充闭合区域。如果path没有闭合，则fill()会自动闭合路径。
    },

    drawArc() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.beginPath();
      // arc(x, y, r, startAngle, endAngle, anticlockwise)
      // 圆心为（50，50），半径40 ， 从弧度 90度， 到 0度， false 表示顺时针 ， 0度 表示x的方向
      // ctx.arc(50, 50, 40, Math.PI / 2, 0, false);
      // ctx.closePath();
      // ctx.stroke();

      ctx.moveTo(50, 50);
      //参数1、2：控制点1坐标   参数3、4：控制点2坐标  参数4：圆弧半径
      // arcTo()方法绘制的弧线是两个切点之间长度最短的弧线，此外iai，如果开始点不是弧线的起点，此方法还将添加一条当前端点到弧线起点的直线线段
      ctx.arcTo(200, 50, 200, 200, 100);
      ctx.lineTo(200, 200);

      ctx.stroke();
    },

    drawBezier() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.moveTo(10, 200); //起始点
      var cp1x = 10,
        cp1y = 60; //控制点1
      var x = 200,
        y = 200; // 结束点
      //绘制二次贝塞尔曲线
      // ctx.quadraticCurveTo(cp1x, cp1y, x, y);

      var cp2x = 60,
        cp2y = 100; //控制点1
      //绘制三次贝塞尔曲线
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      ctx.stroke();
    },
    drawImg() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = 'images/xxm/xxm03.jpg';
      img.onload = function() {
        ctx.drawImage(img, 0, 0, 600, 600);
      };
      //前 4 个是定义图像源的切片位置和大小，后 4 个则是定义切片的目标显示位置和大小。
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    },

    saveAndStore() {
      /*
      Saving and restoring state 是绘制复杂图形时必不可少的操作。

      save() 和 restore()

      save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。
      canvas 的状态就是当前画面应用的所有样式和变形的一个快照。
      1、关于 save() ：Canvas状态存储在栈中，每当save()方法被调用后，当前的状态就被推送到栈中保存。

      一个绘画状态包括：

     当前应用的变形（即移动，旋转和缩放）

     strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值

     当前的裁切路径（clipping path）
     可以调用任意多次 save方法(类似数组的 push())。
      */
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, 150, 150); // 使用默认设置绘制一个矩形
      ctx.save(); // 保存默认状态

      ctx.fillStyle = 'red'; // 在原有配置基础上对颜色做改变
      ctx.fillRect(15, 15, 120, 120); // 使用新的设置绘制一个矩形

      ctx.save(); // 保存当前状态
      ctx.fillStyle = '#FFF'; // 再次改变颜色配置
      ctx.fillRect(30, 30, 90, 90); // 使用新的配置绘制一个矩形

      ctx.restore(); // 重新加载之前的颜色状态
      ctx.fillRect(45, 45, 60, 60); // 使用上一次的配置绘制一个矩形

      ctx.restore(); // 加载默认颜色配置
      ctx.fillRect(60, 60, 30, 30); // 使用加载的配置绘制一个矩形
    },
    translate() {
      const canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      // ctx.save(); //保存坐原点平移之前的状态
      // ctx.translate(100, 100);
      // ctx.strokeRect(0, 0, 100, 100);
      // ctx.restore(); //恢复到最初状态
      // ctx.translate(110, 110);
      // ctx.fillRect(0, 0, 100, 100);

      ctx.fillStyle = 'red';
      ctx.save();

      ctx.translate(100, 100);
      ctx.rotate((Math.PI / 180) * 45);
      ctx.fillStyle = 'blue';
      ctx.fillRect(0, 0, 100, 100);
      ctx.restore();

      ctx.save();
      ctx.translate(0, 0);
      ctx.fillRect(0, 0, 50, 50);
      ctx.restore();
    },
  },
};
</script>

<style>
#canvas {
  border: 1px solid;
}
</style>
