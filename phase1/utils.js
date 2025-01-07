// linear interpolation
function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );

      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  // value is between -1 and 1 so abs value will be between 0 to 1;
  const A = Math.abs(value);
  // change color if weights are negative or positive
  const R = value < 0 ? 0 : 255;
  // G and R are same that makes yellow
  const G = R;
  // blue is opposite
  const B = value > 0 ? 0 : 255;

  // so the color scheme is yellow for positive and blue for negative values with varying alpha(A)
  // depending on the value
  return `rgba(${R}, ${G}, ${B}, ${A})`;
}

function getRandomColor() {
  // random color for cars
  const hue = 290 + Math.random() * 260;

  return `hsl(${hue},100%,60%)`;
}
