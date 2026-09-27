// Вращающееся стеклянное кольцо с десертами (Three.js). Если WebGL или библиотека недоступны,
// остаётся обычная картинка из блока .ring__fallback.
(() => {
  const box = document.getElementById("ring");
  if (!box || !window.THREE) return;
  const THREE = window.THREE;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Какие десерты на гранях. fx/fy - куда смотрит кадр (0..1), чтобы попал сам десерт.
  const SLIDES = [
    { src: "images/korp-apple.jpg" },
    { src: "images/bento.jpg", fx: 0.82, fy: 0.22 },
    { src: "images/korp-cherry.jpg" },
    { src: "images/roll-biscuit.jpg", fx: 0.4, fy: 0.55 },
    { src: "images/korp-coffee.jpg", fx: 0.4, fy: 0.25 },
    { src: "images/roll-meringue.jpg", fx: 0.4, fy: 0.35 },
    { src: "images/korp-sugarfree.jpg" },
    { src: "images/korp-apple-classic.jpg" },
  ];

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  const canvas = renderer.domElement;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Вращающееся стеклянное кольцо с нашими десертами");
  box.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 2.5, 7.2);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const N = SLIDES.length;
  const W = 1.22;
  const H = 1.62;
  const R = W / 2 / Math.tan(Math.PI / N) + 0.02;
  const ring = new THREE.Group();
  scene.add(ring);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6ecff,
    transparent: true,
    opacity: 0.2,
    roughness: 0.05,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    depthWrite: false,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  const glassGeo = new THREE.BoxGeometry(W, H, 0.07);
  const edgeGeo = new THREE.EdgesGeometry(glassGeo);
  const photoGeo = new THREE.PlaneGeometry(W * 0.84, H * 0.86);

  // Картинка обрезается «по центру десерта» и превращается в текстуру
  function makeTexture(img, fx = 0.5, fy = 0.5) {
    const cw = 384;
    const ch = Math.round((cw * H) / W);
    const c = document.createElement("canvas");
    c.width = cw;
    c.height = ch;
    const g = c.getContext("2d");
    const s = Math.max(cw / img.width, ch / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    g.drawImage(img, -(dw - cw) * fx, -(dh - ch) * fy, dw, dh);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  const photoMats = SLIDES.map(() => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.96, side: THREE.DoubleSide }));

  SLIDES.forEach((slide, i) => {
    const a = (i / N) * Math.PI * 2;
    const panel = new THREE.Group();
    panel.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
    panel.rotation.y = a;
    panel.add(new THREE.Mesh(glassGeo, glassMat));
    panel.add(new THREE.LineSegments(edgeGeo, edgeMat));
    const photo = new THREE.Mesh(photoGeo, photoMats[i]);
    photo.position.z = -0.015;
    panel.add(photo);
    ring.add(panel);

    const img = new Image();
    img.onload = () => {
      photoMats[i].map = makeTexture(img, slide.fx, slide.fy);
      photoMats[i].needsUpdate = true;
      draw();
    };
    img.src = slide.src;
  });

  // Размер под контейнер
  function resize() {
    const w = box.clientWidth || 300;
    const h = box.clientHeight || 300;
    renderer.setSize(w, h, false);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    camera.aspect = w / h;
    camera.position.z = camera.aspect < 1 ? 7.2 / Math.max(camera.aspect, 0.72) * 0.9 : 7.2;
    camera.lookAt(0, 0, 0);
    draw();
  }
  new ResizeObserver(resize).observe(box);

  // Вращение: само крутится, можно потянуть пальцем или мышью
  let angle = 0;
  let vel = reduce ? 0 : 0.32;
  let drag = null;
  let visible = true;
  let last = performance.now();

  function draw() {
    ring.rotation.y = angle;
    renderer.render(scene, camera);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (visible && !document.hidden) {
      if (!drag) {
        const base = reduce ? 0 : 0.32;
        vel += (base - vel) * Math.min(dt * 1.5, 1);
        angle += vel * dt;
      }
      draw();
    }
    requestAnimationFrame(frame);
  }

  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(box);

  canvas.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, moved: 0 };
    canvas.setPointerCapture(e.pointerId);
    box.classList.add("is-drag");
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    drag.moved += Math.abs(dx);
    angle += dx * 0.008;
    vel = dx * 0.008 * 60;
    draw();
  });
  const end = () => {
    if (drag && drag.moved < 6) {
      document.getElementById("catalog")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
    drag = null;
    box.classList.remove("is-drag");
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  box.classList.add("is-ready");
  resize();
  requestAnimationFrame(frame);
})();
