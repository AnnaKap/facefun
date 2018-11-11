import * as ml5 from 'ml5'
import * as THREE from 'three'


import loopThroughPoses from './threeJs/nose'

let video = document.createElement('video')
let vidDiv = document.getElementById('video')
let leftEyeButton = document.getElementById('leftEye')
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
// renderer.setClearColor("#2E2B40");

// Configure renderer size
renderer.setSize(window.innerWidth/2, window.innerHeight/2);

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );


//raycaster assists in mouse picking
let newSphereGeo = false
let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let sphereGeo = new THREE.SphereGeometry(1, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
let material = new THREE.MeshPhongMaterial( { color: "0x2194ce" } );

let cube01 = new THREE.Mesh( geometry, material );
let cube02 = new THREE.Mesh( sphereGeo, material );
let cube03 = new THREE.Mesh( sphereGeo, material );


let  light = new THREE.PointLight( 0xFFFF00 );
light.position.set( -10, 0, 10 );

			
scene.add(light, cube01, cube02, cube03);

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

  console.log(`shape position x, y`, shape.position.x, shape.position.y)
  lastXPosition = faceObj.x
  lastYPosition = faceObj.y
  console.log('lastpositions', lastXPosition, lastYPosition)
}
// import changeYXPosition from './threeJs/changeXY'

const render = function (aNose, shape, aRightEye, aLeftEye) {
  if (newSphereGeo) {
    aRightEye.geometry = geometry
  } else {
    aRightEye.geometry = sphereGeo
  }
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
window.addEventListener( 'resize', onWindowResize, false );
			
function onWindowResize() {

   camera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
  //  video.setAttribute('width', window.innerWidth/2);
  //  video.setAttribute('height', window.innerWidth/2);
}

