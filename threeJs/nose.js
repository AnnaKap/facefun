function loopThroughPoses (poses, nose, leftEye, rightEye){

for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2 ) {
         if (keypoint.part === 'nose'){
            nose.x = keypoint.position.x
            nose.y = keypoint.position.y
         } 
      }
    }
  }
}
export default loopThroughPoses;
