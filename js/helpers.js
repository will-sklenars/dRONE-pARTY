

function setPositionX (speedX, maxDistance, now) {
  return Math.sin(now * speedX) * maxDistance;
}

function setPositionY (speedY, maxDistance, now) {
  return Math.sin((now * speedY) - Math.PI/2) * maxDistance
}

function oldPositionX (vectorAcuracy, speedX, maxDistance, now) {
  return Math.sin((now - vectorAcuracy) * speedX) * maxDistance;
}

function oldPositionY (vectorAcuracy, speedY, maxDistance, now) {
  return Math.sin(((now - vectorAcuracy) * speedY) - Math.PI/2) * maxDistance
}
