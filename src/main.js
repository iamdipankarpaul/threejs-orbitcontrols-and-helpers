import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");

// 1. Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); // Dark gray background

// ============================================
// GRID HELPER
// Shows a grid on the ground plane for spatial reference
// ============================================
const gridHelper = new THREE.GridHelper(
  20, // Size (20x20 units)
  20, // Divisions (20 lines in each direction)
  0x444444, // Center line color (darker gray)
  0x888888 // Grid line color (lighter gray)
);
scene.add(gridHelper);

// The grid helps you understand:
// - Scale (how big are your objects?)
// - Position (where is everything located?)
// - Ground plane (where is "down"?)

// ============================================
// AXES HELPER
// Shows X, Y, Z axes with color coding
// ============================================
const axesHelper = new THREE.AxesHelper(5); // Size: 5 units long
scene.add(axesHelper);

// Color coding (standard in 3D software):
// - RED = X axis (left/right)
// - GREEN = Y axis (up/down)
// - BLUE = Z axis (forward/back)

// This helps you understand orientation at a glance!

// 2. Create camera
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  w / h, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Position camera to get a good initial view
camera.position.set(0, 3, 6);
// This puts us:
// - At center horizontally (x=0)
// - 3 units up (y=3)
// - 6 units back (z=6)

// ============================================
// ORBIT CONTROLS - The Game Changer!
// ============================================
const controls = new OrbitControls(camera, canvas);

// DAMPING - Makes camera movement smooth and natural
// Without damping, camera stops instantly (feels robotic)
// With damping, camera gradually slows down (feels smooth)
controls.enableDamping = true;
controls.dampingFactor = 0.08; // Lower = more damping (0.05-0.1 is good)
// NOTE: When damping is enabled, you MUST call controls.update()
// in your animation loop!

// AUTO ROTATE - Camera automatically spins around the target
controls.autoRotate = false; // Start disabled (we'll toggle it)
controls.autoRotateSpeed = 2.0; // Speed of rotation (negative = reverse)

// PANNING - Move camera left/right/up/down with right mouse button
controls.enablePan = true;
controls.panSpeed = 1.0; // How fast panning moves
controls.screenSpacePanning = false; // Pan in world space (not screen space)

// ZOOMING - Zoom in/out with mouse wheel
controls.enableZoom = true;
controls.zoomSpeed = 1.0; // How fast zoom responds

// ROTATING - Rotate around target with left mouse button
controls.enableRotate = true;
controls.rotateSpeed = 1.0; // How fast rotation responds

// DISTANCE LIMITS - How close/far you can zoom
controls.minDistance = 3; // Closest zoom (prevents going inside objects)
controls.maxDistance = 20; // Farthest zoom (prevents getting lost in space)

// POLAR ANGLE LIMITS - Vertical rotation limits
// Polar angle is measured from the positive Y axis (top)
controls.minPolarAngle = 0; // Can look straight down (0 = top)
controls.maxPolarAngle = Math.PI * 0.5; // Can't go below horizon (prevents upside-down)
// Math.PI * 0.5 = 90 degrees = horizon level

// AZIMUTHAL ANGLE LIMITS - Horizontal rotation limits
// Azimuth is the angle around the Y axis
controls.minAzimuthAngle = -Infinity; // No limit (can spin freely)
controls.maxAzimuthAngle = Infinity; // No limit (can spin freely)
// To limit horizontal rotation, set these to specific values:
// Example: controls.minAzimuthAngle = -Math.PI / 4; // -45 degrees
//          controls.maxAzimuthAngle = Math.PI / 4;  // +45 degrees

// TARGET - What point the camera orbits around
controls.target.set(0, 1, 0); // Orbit around point (0, 1, 0)
// By default, it's (0, 0, 0) but we raised it to look at our objects better

// KEYS - Keyboard controls for panning (optional)
controls.keys = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  BOTTOM: "ArrowDown",
};
controls.enableKeys = true; // Enable keyboard controls

// 3. Create geometries
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 1);
const boxGeometry = new THREE.BoxGeometry(2.5, 0.1, 2.5);

// 4. Create materials
const icosahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00, // Green
  emissive: 0x00aa00, // Green glow
  metalness: 0.5,
  roughness: 0.3,
});

const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000, // Red
  emissive: 0xaa0000, // Red glow
  metalness: 0.3,
  roughness: 0.7,
});

// 5. Create meshes
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// Position objects
icosahedron.position.set(0, 1.2, 0); // Floating above the box
box.position.set(0, 0, 0); // On the ground

scene.add(icosahedron, box);

// Add some extra objects to make the scene more interesting
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 0.6,
    roughness: 0.2,
  })
);
sphere.position.set(3, 0.5, 0);
scene.add(sphere);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.6, 0.2, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0xffe66d,
    metalness: 0.4,
    roughness: 0.4,
  })
);
torus.position.set(-3, 1, 0);
scene.add(torus);

// 6. Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 7. Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);

// Get control elements
const dampingToggle = document.getElementById("dampingToggle");
const autoRotateToggle = document.getElementById("autoRotateToggle");
const panToggle = document.getElementById("panToggle");
const zoomToggle = document.getElementById("zoomToggle");
const rotateToggle = document.getElementById("rotateToggle");
const resetCamera = document.getElementById("resetCamera");
const topView = document.getElementById("topView");
const sideView = document.getElementById("sideView");
const gridToggle = document.getElementById("gridToggle");
const axesToggle = document.getElementById("axesToggle");

// Damping toggle
dampingToggle.addEventListener("change", (e) => {
  controls.enableDamping = e.target.checked;
});

// Auto rotate toggle
autoRotateToggle.addEventListener("change", (e) => {
  controls.autoRotate = e.target.checked;
});

// Pan toggle
panToggle.addEventListener("change", (e) => {
  controls.enablePan = e.target.checked;
});

// Zoom toggle
zoomToggle.addEventListener("change", (e) => {
  controls.enableZoom = e.target.checked;
});

// Rotate toggle
rotateToggle.addEventListener("change", (e) => {
  controls.enableRotate = e.target.checked;
});

// Reset camera to initial position
resetCamera.addEventListener("click", () => {
  camera.position.set(0, 3, 6);
  controls.target.set(0, 1, 0);
  controls.update();
});

// Top view (bird's eye)
topView.addEventListener("click", () => {
  camera.position.set(0, 10, 0.1); // Almost directly above
  controls.target.set(0, 0, 0);
  controls.update();
});

// Side view
sideView.addEventListener("click", () => {
  camera.position.set(10, 3, 0);
  controls.target.set(0, 1, 0);
  controls.update();
});

// Grid helper toggle
gridToggle.addEventListener("change", (e) => {
  gridHelper.visible = e.target.checked;
});

// Axes helper toggle
axesToggle.addEventListener("change", (e) => {
  axesHelper.visible = e.target.checked;
});

// 8. Animation loop
function animateScene() {
  requestAnimationFrame(animateScene);

  // Rotate objects for visual interest
  icosahedron.rotation.x += 0.01;
  icosahedron.rotation.y += 0.01;

  box.rotation.y += 0.005;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;

  // IMPORTANT: Update controls when damping is enabled!
  // Without this, damping won't work
  controls.update();

  renderer.render(scene, camera);
}

animateScene();

// 9. Handle window resize
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
