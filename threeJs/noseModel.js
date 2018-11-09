import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth , window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( .01, .01, .01  );
const material = new THREE.MeshBasicMaterial( { color: 400020  } );
const cubeTwo = new THREE.Mesh( geometry, material );

scene.add(cubeTwo);

const render = function (){
    requestAnimationFrame(render)

    renderer.render(scene, camera)
}

