import * as ml5 from 'ml5'
import loopThroughPoses from './threeJs/nose'
let video = document.createElement('video')
video.setAttribute('width', 225);
video.setAttribute('height', 225);

video.autoplay = true
// video.hidden = true;
// let canvas = document.createElement('canvas')
// canvas.id = "myCanvas"
document.body.appendChild(video)
// document.body.appendChild(canvas)

let obj = {}

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
import * as THREE from 'three'

const scene = new THREE.Scene();

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
// renderer.setClearColor("#2E2B40");

// Configure renderer size
renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );


// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
let cube01 = new THREE.Mesh( geometry, material );
let cube02 = new THREE.Mesh( geometry, material );
let cube03 = new THREE.Mesh( geometry, material );
scene.add( cube01, cube02, cube03 );

// Render Loop

let lastXPosition = 100;
let lastYPosition = 100;
let changeX;
let changeY;

const changeYXPosition = (faceObj, shape, leftEyeShape, rightEyeShape) => {
  if (!changeX){
    changeX = 0
    changeY = 0
  }
  changeX = faceObj.x - lastXPosition
  changeY = faceObj.y - lastYPosition
  
  console.log('changes x,y', changeX, changeY)
  shape.position.x += (changeX * 0.5)
  shape.position.y += -(changeY * 0.3)
  rightEyeShape.position.x = shape.position.x + 1
  rightEyeShape.position.y = shape.position.y + 2
  leftEyeShape.position.x = shape.position.x - 1
  leftEyeShape.position.y = shape.position.y + 2

  console.log(`shape position x, y`, shape.position.x, shape.position.y)
  lastXPosition = faceObj.x
  lastYPosition = faceObj.y
  console.log('lastpositions', lastXPosition, lastYPosition)
}

const render = function (aNose, shape, aRightEye, aLeftEye) {
    // let changeX;
    // let changeY;
    changeYXPosition(aNose, shape, aRightEye, aLeftEye)
    // changeYXPosition(aRightEye, cube02, 0 , 0)
    // changeYXPosition(aLeftEye, cube03, 0 , 0)
  // console.log('last pos', lastPosition)
  // if (!change){
  //   change = 1
  // }
  // change = aNose.x - lastPosition
  // console.log("change", change)
  // cube01.position.x = cube01.position.x + (change * 1.1)
  // cube01.position.y = 1;
  // console.log("position",cube01.position.x)
  // lastPosition = aNose.x
  
  renderer.render(scene, camera);
};

let nose = {}
let rightEye = {}
let leftEye = {}

poseNet.on('pose', function(results) {
  let poses = results;
  loopThroughPoses(poses, nose, rightEye, leftEye)
  let estimatedNose = {
    x: Math.round(nose.x),
    y: Math.round(nose.y)
  }
  // let estimatedREye = {
  //   x: Math.round(rightEye.x),
  //   y: Math.round(rightEye.y)
  // }
  // let estimatedLEye = {
  //   x: Math.round(leftEye.x),
  //   y: Math.round(leftEye.y)
  // }
  render(estimatedNose, cube01, cube02, cube03)
});

function modelReady() {
  
  console.log("model Loaded")

}
// render()

window.addEventListener( 'resize', onWindowResize, false );
			
function onWindowResize() {

   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
  //  video.setAttribute('width', window.innerWidth);
  //  video.setAttribute('height', window.innerHeight);
}