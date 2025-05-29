import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer, RenderPass, EffectPass, BloomEffect } from 'postprocessing';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const pointLight = new THREE.PointLight(0xffffff, 2, 200);
pointLight.position.set(20, 30, 50);
scene.add(pointLight);

// BLOOM EFFECT
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new BloomEffect({
  intensity: 2.5,
  luminanceThreshold: 0.1,
  luminanceSmoothing: 0.9,
});
composer.addPass(new EffectPass(camera, bloom));

// LOAD FONT AND CREATE MULTIPLE TEXTS
const loader = new FontLoader();
loader.load('./font/hongson.json', (font) => {
  const texts = [];
  const textCount = 30;
  const messages = [
    "Nguyễn Phương Uyên ♡",
    "Đồng ý làm vợ anh nhé ♡",
    "Anh yêu em nhiều lắm",
    "Em là duy nhất",
    "Mãi bên nhau nhé ♡"
  ];
  const colors = [
    0xffe6fa, 0x66ccff, 0xfff066, 0xff99cc, 0x99ff99, 0xffffff
  ];
  // Lưới vị trí
  const rows = 15; // so hang
  const cols = 5; // so cot
  const spacingX = 25; // ngan cach giua cac cot
  const spacingY = 10; // ngan cach giua cac hang
  const startX = -((cols - 1) / 2) * spacingX;
  const startY = 25;
  let idx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (idx >= textCount) break;
      const message = messages[idx % messages.length];
      const color = colors[idx % colors.length];
      const textGeometry = new TextGeometry(message, {
        font: font,
        size: 2.2 + Math.random() * 0.5,
        height: 0.25,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.04,
        bevelSegments: 6,
        curveSegments: 18,
      });
      textGeometry.center();
      const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const coreMesh = new THREE.Mesh(textGeometry, coreMaterial);
      const outlineGeometry = textGeometry.clone();
      outlineGeometry.scale(1.0, 1.0, 1.1);
      const neonMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
      });
      const outlineMesh = new THREE.Mesh(outlineGeometry, neonMaterial);
      // Vị trí dải đều, random nhẹ trong từng ô
      const x = startX + col * spacingX + (Math.random() - 0.5) * 2;
      const y = startY - row * spacingY + Math.random() * 2;
      const z = (Math.random() - 0.5) * 10;
      coreMesh.position.set(x, y, z);
      outlineMesh.position.set(x, y, z);
      // Xoay nhẹ cho tự nhiên
      const baseAngle = THREE.MathUtils.degToRad(30);
      coreMesh.rotation.y = outlineMesh.rotation.y = baseAngle + (Math.random() - 0.5) * 0.2;
      coreMesh.rotation.x = outlineMesh.rotation.x = (Math.random() - 0.5) * 0.1;
      coreMesh.rotation.z = outlineMesh.rotation.z = (Math.random() - 0.5) * 0.1;
      // Tốc độ rơi riêng
      const speed = 0.1 + Math.random() * 0.2;
      scene.add(outlineMesh);
      scene.add(coreMesh);
      texts.push({ core: coreMesh, outline: outlineMesh, speed, row, col });
      idx++;
    }
  }

  // HEARTS
  const hearts = [];
  for (let i = 0; i < 20; i++) {
    const heart = createHeartMesh3D();
    heart.position.set(
      (Math.random() - 0.5) * 80,
      30 + Math.random() * 10,
      (Math.random() - 0.5) * 60
    );
    heart.userData.speed = 0.08 + Math.random() * 0.04;
    scene.add(heart);
    hearts.push(heart);
  }

  // === STARFIELD WITH TWINKLE EFFECT ===
  const starCount = 300;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starPhases = new Float32Array(starCount); // phase cho hiệu ứng lấp lánh
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 200;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    starPhases[i] = Math.random() * Math.PI * 2;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('phase', new THREE.BufferAttribute(starPhases, 1));

  // Custom shader material cho sao lấp lánh
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      attribute float phase;
      varying float vPhase;
      void main() {
        vPhase = phase;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 1.5 + 2.5 * sin(phase);
        #ifdef GL_ES
          gl_PointSize *= min(1.0, 300.0 / length(gl_Position.xyz));
        #endif
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying float vPhase;
      void main() {
        float twinkle = 0.6 + 0.5 * sin(uTime * 2.0 + vPhase * 3.0);
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist) * twinkle;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // ANIMATE
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const totalHeight = rows * spacingY;
    const heartAreaHeight = 60; // vùng rơi của tim, điều chỉnh nếu cần

    // Animate texts: bay xuống và lặp lại mượt mà
    texts.forEach((textObj) => {
      textObj.core.position.y -= textObj.speed;
      textObj.outline.position.y -= textObj.speed;
      if (textObj.core.position.y < -totalHeight / 2) {
        textObj.core.position.y += totalHeight;
        textObj.outline.position.y += totalHeight;
      }
    });

    // Animate hearts: rơi xuống và lặp lại mượt mà
    hearts.forEach((heart) => {
      heart.position.y -= heart.userData.speed;
      if (heart.position.y < -heartAreaHeight / 2) {
        heart.position.y += heartAreaHeight;
        heart.position.x = (Math.random() - 0.5) * 80;
        heart.position.z = (Math.random() - 0.5) * 60;
      }
      heart.rotation.z += 0.01 + Math.random() * 0.01;
    });

    // Update star twinkle
    starMaterial.uniforms.uTime.value = performance.now() * 0.001;

    composer.render();
  }
  animate();
});

// HEART SHAPE
function createHeartMesh3D(size = 2.5, opacity = 0.8) {
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -3, -5, -3, -5, 0);
  heartShape.bezierCurveTo(-5, 3, 0, 5, 0, 7);
  heartShape.bezierCurveTo(0, 5, 5, 3, 5, 0);
  heartShape.bezierCurveTo(5, -3, 0, -3, 0, 0);

  // Lõi tim
  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide
  });
  const core = new THREE.Mesh(geometry, material);
  core.scale.set(size / 10, size / 10, 1);

  // Viền neon
  const outlineGeometry = geometry.clone();
  outlineGeometry.scale(0.12, 0.12, 0.1);
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe6fa, // trắng pha hồng
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const outline = new THREE.Mesh(outlineGeometry, neonMaterial);

  // Group lại
  const group = new THREE.Group();
  group.add(outline);
  group.add(core);
  return group;
}

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});