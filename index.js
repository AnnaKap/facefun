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
  imageScaleFactor: 0.3,
  outputStride: 32,
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'single',
  multiplier: 0.75,
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
renderer.setSize( window.innerWidth, window.innerHeight );

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


cube02.position.x = 0
cube02.position.y = 0
cube02.position.z = 2
cube03.position.x = -13
cube03.position.y = 0
cube03.position.z = 2
// Render Loop
let lastPosition;
const render = function (anose) {
  console.log(anose)
  if (anose >200 && anose < 225){
    cube01.position.x = 0
  
    } else if (lastPosition < anose){
    cube01.position.x -=1
    } else {
    cube01.position.x += 1
  }
  lastPosition = anose
  
  renderer.render(scene, camera);
};
let nose = {}
poseNet.on('pose', function(results) {
  let poses = results;
  loopThroughPoses(poses, nose)
//   console.log(nose)
  let estimatedNose = Math.round(nose.x)
  
  render(estimatedNose)
});

function modelReady() {
  let status = document.getElementById('status')
  status.innerHTML = 'Model loaded'
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