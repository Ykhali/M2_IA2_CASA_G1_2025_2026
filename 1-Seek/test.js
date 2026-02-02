// ecris des fonctions de collison entre cercles et entre un cercle et un rectangle aligné et entre rectangles alignés

// Collision entre deux cercles
function circleCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
  let distance = dist(c1x, c1y, c2x, c2y);
  return (distance < c1r + c2r);
}

// Collision entre un cercle et un rectangle (AABB)
function circleRect(cx, cy, cr, rx, ry, rw, rh) {
  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx;
  else if (cx > rx + rw) testX = rx + rw;
  
  if (cy < ry) testY = ry;
  else if (cy > ry + rh) testY = ry + rh;

  let distance = dist(cx, cy, testX, testY);
  return (distance <= cr);
}

// Collision entre deux rectangles (AABB)
function rectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2);
}