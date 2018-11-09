
import * as ml5 from 'ml5'


let video = document.getElementsByTagName('video')
let poseNet = ml5.poseNet(video, modelReady)

poseNet.on('pose', function(results) {
    let poses = results;
    let isLoaded = true
    console.log(poses)
    console.log(isLoaded)
    
  });

  function modelReady() {
    let status = document.getElementById('status')
    status.innerHTML = 'Model loaded'

  }



export default poseNet;