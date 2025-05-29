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

for (let i = 0; i < textCount; i++) {
  const message = messages[i % messages.length];
  const color = colors[i % colors.length];
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
  const radius = 35 + Math.random() * 15;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI - Math.PI / 2;
  const x = Math.cos(theta) * Math.cos(phi) * radius;
  const y = 20 + Math.random() * 40; // random y ở trên cao
  const z = Math.sin(theta) * Math.cos(phi) * radius;
  coreMesh.position.set(x, y, z);
  outlineMesh.position.set(x, y, z);
  const baseAngle = THREE.MathUtils.degToRad(30);
  coreMesh.rotation.y = outlineMesh.rotation.y = baseAngle + (Math.random() - 0.5) * 0.5;
  coreMesh.rotation.x = outlineMesh.rotation.x = (Math.random() - 0.5) * 0.3;
  coreMesh.rotation.z = outlineMesh.rotation.z = (Math.random() - 0.5) * 0.2;
  scene.add(outlineMesh);
  scene.add(coreMesh);
  texts.push({ core: coreMesh, outline: outlineMesh });
}

// Animate texts: bay xuống và lặp lại
texts.forEach((textObj) => {
  textObj.core.position.y -= 0.05;
  textObj.outline.position.y -= 0.05;
  if (textObj.core.position.y < -30) {
    textObj.core.position.y = 40;
    textObj.outline.position.y = 40;
  }
}); 