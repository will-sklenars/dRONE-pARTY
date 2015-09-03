var amountObjects = 25
var speedXMultiplier = 0.3
var speedYMultiplier = 0.3
var speedZMultiplier = 0.3
var distanceXMultiplier = 500
var distanceYMultiplier = 4000
var distanceZMultiplier = 1000
var stlPath = './stl/drone.stl'
var onRenderFcts = []
var lastTimeMsec
var drones = []
var timer = null
var camera, controls, scene, renderer

init()

function init () {

  // ------------------setup scene--------------------------

  scene = new THREE.Scene();

  // ------------------setup camera--------------------------

  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1,10000);

  camera.position.x = 0
  camera.position.y = -2581.0705
  camera.position.z = 92.2746;


  // ------------------setup renderer--------------------------

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // ------------------setup controls--------------------------

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0, 0);


  // ------------------create drone objects--------------------------

  for (var i = 0; i < amountObjects; i++) {
    var bodyMaterial = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 1});
    var loader = new THREE.STLLoader();
    loader.load( stlPath, function (geometry) {
      drone = new THREE.Mesh( geometry, bodyMaterial );
      drone.constant1 = (Math.random()+ 0.1)
      drone.constant2 = (Math.random()+ 0.1)
      drone.constant3 = (Math.random()+ 0.1)
      drone.rotation.x = Math.PI/2
      drones.push(drone)
      scene.add( drone )
      // if (drones.length === amountObjects - 1) {render()}
    })
  }
}


// ------------------update position of each drone----------------------

function update(delta, now) {
  var rotationAccuracy = 1/1000 // smaller is more accurate
  var rotationOffset = - Math.PI/2
  drones.forEach( function (drone) {
    var speedX = speedXMultiplier * drone.constant1
    var speedY = speedYMultiplier * drone.constant2
    var speedZ = speedZMultiplier * drone.constant3
    var distanceX = distanceXMultiplier * drone.constant1
    var distanceY = distanceYMultiplier * drone.constant2
    var distanceZ = distanceZMultiplier * drone.constant3

    // set position of object
    drone.position.x = setPositionX (speedX, distanceX, now)
    drone.position.y = setPositionY (speedY, distanceY, now)
    drone.position.z = Math.sin(now * speedZ) * distanceZ;

    //set a previous position for change in position
    var old_positionX = oldPositionX (rotationAccuracy, speedX, distanceX, now)
    var old_positionY = oldPositionY (rotationAccuracy, speedY, distanceY, now)

    // calculate change in position
    var relitive_positionX =  drone.position.x - old_positionX
    var relitive_positionY =  drone.position.y - old_positionY

   // update rotation
    drone.rotation.y = (relitive_positionX > 0) ? Math.atan(relitive_positionY/relitive_positionX) + Math.PI + rotationOffset : Math.atan(relitive_positionY/relitive_positionX) + rotationOffset
  })
}
onRenderFcts.push(update)

// ------------------render the scene--------------------------

onRenderFcts.push(function () {
  renderer.render( scene, camera );
})

// ----------------------RAF loop------------------------------

// function render () {
  requestAnimationFrame(function animate(nowMsec){
    console.log(camera.position)
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })
// }
