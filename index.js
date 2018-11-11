import * as ml5 from 'ml5'
import * as THREE from 'three'
import loopThroughPoses from './threeJs/nose'

let video = document.createElement('video')
let vidDiv = document.getElementById('video')
let leftEyeButton = document.getElementById('leftEye')
let rightEyeButton = document.getElementById('rightEye')
let noseButton = document.getElementById('nose')
let mouthButton = document.getElementById('mouth')
video.setAttribute('width', 255);
video.setAttribute('height', 255);
video.autoplay = true
vidDiv.appendChild(video)

// get the users webcam stream to render in the video
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        // video.hiddend();
    })
    .catch(function(err) {
        console.log("An error occurred! " + err);
    });

let options = { 
  flipHorizontal: true,
  minConfidence: 0.5
 } 

let poseNet = ml5.poseNet(video, options, modelReady)

  //three.js code
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );
// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2) /(window.innerHeight/2), 0.1, 1000 );
camera.position.z = 20;
let i = 0;
camera.position.set(  0, 7, 15 );
camera.lookAt( scene.position );

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#2E2B40");

// Configure renderer size
renderer.setSize(window.innerWidth/2, window.innerHeight/2);

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );


let newSphereGeo = false
let rightEyeBool = false
let noseBool = false
let mouthBool = false

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let sphereGeo = new THREE.SphereGeometry(1, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
let mouthGeo =  new THREE.TorusGeometry( 1, 0.5, 6, 100 );
let halfMouth = new THREE.BoxGeometry( 5, 1, 1 );
let material = new THREE.MeshPhongMaterial( { color: "0x2194ce" } );

let cube01 = new THREE.Mesh( geometry, material );
let cube02 = new THREE.Mesh( sphereGeo, material );
let cube03 = new THREE.Mesh( sphereGeo, material );
let oMouth = new THREE.Mesh( mouthGeo, material );
// let halfMouthObj = new THREE.Mesh( halfMouth, material );


let  light = new THREE.PointLight( 0xFFFF00 );
light.position.set( -10, 0, 10 );

function createHemisphereLight() { 
  return new THREE.HemisphereLight(0x303F9F, 0x000000, 1); 
}
var loader = new THREE.TextureLoader();
var groundTexture = loader.load( 'https://img.freepik.com/free-photo/white-marble-texture-with-natural-pattern-for-background-or-design-art-work_24076-186.jpg?size=338&ext=jpg' );
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.repeat.set( 25, 25 );
				groundTexture.anisotropy = 16;
				var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
				var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
				mesh.position.y = - 250;
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );
			
scene.add(light, cube01, cube02, cube03, oMouth, createHemisphereLight());

// Render Loop

let lastXPosition = 100;
let lastYPosition = 100;
let changeX = 1;
let changeY = 1;

const changeYXPosition = (faceObj, shape, leftEyeShape, rightEyeShape) => {
 

  changeX = faceObj.x - lastXPosition
  changeY = faceObj.y - lastYPosition
  
  console.log('changes x,y', changeX, changeY)
  shape.position.x += (changeX * 0.20)
  shape.position.y += -(changeY * 0.20)
  rightEyeShape.position.x = shape.position.x + 3
  rightEyeShape.position.y = shape.position.y + 4
  leftEyeShape.position.x = shape.position.x - 3
  leftEyeShape.position.y = shape.position.y + 4
  oMouth.position.x = shape.position.x
  oMouth.position.y = shape.position.y - 4

  console.log(`shape position x, y`, shape.position.x, shape.position.y)
  lastXPosition = faceObj.x
  lastYPosition = faceObj.y
  console.log('lastpositions', lastXPosition, lastYPosition)
}
// import changeYXPosition from './threeJs/changeXY'

const render = function (aNose, shape, aRightEye, aLeftEye) {
  newSphereGeo ? aRightEye.geometry = geometry : aRightEye.geometry = sphereGeo
  rightEyeBool ? aLeftEye.geometry = geometry : aLeftEye.geometry = sphereGeo
  noseBool ? cube01.geometry = geometry : cube01.geometry = sphereGeo
  mouthBool ? oMouth.geometry =  mouthGeo : oMouth.geometry = halfMouth
  // if (newSphereGeo) {
  //   aRightEye.geometry = geometry
  // } else {
  //   aRightEye.geometry = sphereGeo
  // }
  console.log(newSphereGeo)
  changeYXPosition(aNose, shape, aRightEye, aLeftEye)
  aRightEye.rotation.x += 0.1
  aLeftEye.rotation.x -= 0.1
  
 
  renderer.render(scene, camera);

};

let nose = {}
let rightEye = {}
let leftEye = {}

poseNet.on('pose',  function(results) {
  let poses = results;
 loopThroughPoses(poses, nose, rightEye, leftEye)
  let estimatedNose = {
    x: nose.x,
    y: nose.y
  }
  if (estimatedNose.x && estimatedNose.y){
  console.log("On POSE", estimatedNose.x)
  render(estimatedNose, cube01, cube02, cube03)
  }
});

function modelReady() {
  
  console.log("model Loaded")

}
// render()
leftEyeButton.addEventListener('click', function(){
  if (newSphereGeo) {
    newSphereGeo = false
  } else {
    newSphereGeo = true
  }
});

rightEyeButton.addEventListener('click', function(){
  if (rightEyeBool) {
    rightEyeBool = false
  } else {
    rightEyeBool = true
  }
});

noseButton.addEventListener('click', function(){
  if (noseBool) {
    noseBool = false
  } else {
    noseBool = true
  }
});
mouthButton.addEventListener('click', function(){
  if (mouthBool) {
    mouthBool = false
  } else {
    mouthBool = true
  }
});
window.addEventListener( 'resize', onWindowResize, false );
			
function onWindowResize() {

   camera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
  //  video.setAttribute('width', window.innerWidth/2);
  //  video.setAttribute('height', window.innerWidth/2);
}

