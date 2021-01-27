import * as THREE from '/build/three.module.js';
import {EffectComposer} from '/jsm/postprocessing/EffectComposer.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import {RenderPass} from '/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from '/jsm/postprocessing/ShaderPass.js';
import {SceneUtils} from '/jsm/utils/SceneUtils.js';
import Stats from '/jsm/libs/stats.module.js';

//export stateless React component
export default function Root() {
    return null;
}

//create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true});
renderer.setClearColor(0x000000, 0);

//set the attributes of the renderer
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight - 100;

//set the renderer size
renderer.setSize(WIDTH, HEIGHT);

//Adding a Camera

//set camera attributes
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

//create a camera
const camera =
new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
);

//set the camera position - x, y, z
camera.position.set(0, 0, 400);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create a scene
const scene = new THREE.Scene();

//set the scene background
//scene.background = new THREE.Color( 0x000 );

//add the camera to the scene.
scene.add(camera);

document.getElementById("WebGL-output").appendChild(renderer.domElement);

var loader = new THREE.TextureLoader();

// Set up the sphere attributes
const RADIUS = 120;
const SEGMENTS = 80;
const RINGS = 80;

//Create a group (which will later include our sphere and its texture meshed together)
const globe = new THREE.Group();
//add it to the scene
scene.add(globe);

//Let's create our globe using TextureLoader

// instantiate a loader
loader.load( 'earth.jpg', function ( texture ) {
    //create the sphere
    var sphere = new THREE.SphereGeometry( RADIUS, SEGMENTS, RINGS );

    //map the texture to the material. Read more about materials in three.js docs
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    //create a new mesh with sphere geometry. 
    var mesh = new THREE.Mesh( sphere, material );

    //add mesh to globe group
    globe.add(mesh);
} );

// Move the sphere back (z) so we can see it.
globe.position.z = -1;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.autoRotate = false;
const clock = new THREE.Clock();

//set animate function to transform the scene and view
function animate () {
    renderer.autoClear = false;
    const delta = clock.getDelta();
    orbitControls.update(delta);
    globe.rotation.y -= 0.002;
    //render
    renderer.render(scene, camera);
    //schedule the next frame.
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

var lastMove = [window.innerWidth/10, window.innerHeight/10];
function rotateOnMouseMove(e) {
    e = e || window.event;
    //calculate difference between current and last mouse position
    const moveX = ( e.clientX - lastMove[0]);
    const moveY = ( e.clientY - lastMove[1]);
    //rotate the globe based on distance of mouse moves (x and y)
    globe.rotation.y += ( moveX * .0001);
    globe.rotation.x += ( moveY * .0001);
    //store new position in lastMove
    lastMove[0] = e.clientX;
    lastMove[1] = e.clientY;
}
document.addEventListener('mousemove', rotateOnMouseMove);