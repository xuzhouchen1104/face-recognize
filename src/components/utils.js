/**
 * 获取数组中间的点
 */

const getArrMidPoint = (arr) => arr[Math.floor(arr.length / 2)];
/**
 * 获取中间的点
 */

const getMidPoint = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

/**
 * 获取平面坐标系两点之间距离
 */

const getDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

/**
 * 获取下巴  const jawOutline = landmarks.getJawOutline()
 *
 * 获取脸的宽度
 */

const getFaceWidth = (jawOutline) => getDistance(jawOutline[0], jawOutline[jawOutline.length - 1]);

/**
 *  获取脸的倾斜度
 *  jawPoint 下颚的点
 *  eyeMidPoint 两眼间的点
 */
const getFaceAngle = (jawPoint, eyeMidPoint) => {
  return -Math.atan2(jawPoint.x - eyeMidPoint.x, jawPoint.y - eyeMidPoint.y);
};

/**
 * 获取嘴巴中心点
 */

const getMouthMidPoint = (mouth = []) => {
  let xPoints = mouth.map((item) => item.x);
  let minX = xPoints.sort(function(a, b) {
    return a - b;
  })[0];
  let maxX = xPoints.sort(function(a, b) {
    return b - a;
  })[0];

  let leftPoint = {};
  let rightPoint = {};

  mouth.forEach((item) => {
    if (item.x === minX) {
      leftPoint = item;
    }
    if (item.x === maxX) {
      rightPoint = item;
    }
  });

  return getMidPoint(leftPoint, rightPoint);
};

/**
 * 获取两个眉毛中点
 */

const getMidPointOfEyebrow = (leftEyebrowPonits, rightEyebrowPonits) => {
  return getMidPoint(getArrMidPoint(leftEyebrowPonits), getArrMidPoint(rightEyebrowPonits));
};

/**
 * 获取脸的长度（发际线到下巴的长度）
 */
const getFaceLength = (jawPoint, midEyebrowPonit) => (3 * getDistance(jawPoint, midEyebrowPonit)) / 2;

export { getMidPointOfEyebrow, getFaceLength, getMouthMidPoint, getFaceAngle, getFaceWidth, getArrMidPoint };
