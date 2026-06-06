(async () => {

  /* ── Constants ── */
  const HEX       = '#3DFF8F';
  const GCOL      = new THREE.Color(HEX);
  const BG        = 0x07090A;
  const RADIUS    = 1;
  const AUTO_ROT  = 0.0008;
  const isMobile  = window.innerWidth < 768;

  /* ── Round dot sprite ── */
  function makeCircleTexture(size = 64) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const r = size / 2;
    const grad = ctx.createRadialGradient(r,r,0, r,r,r);
    grad.addColorStop(0,   'rgba(61,255,143,1)');
    grad.addColorStop(0.45,'rgba(61,255,143,0.7)');
    grad.addColorStop(1,   'rgba(61,255,143,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(r,r,r,0,Math.PI*2); ctx.fill();
    return new THREE.CanvasTexture(c);
  }
  const dotTex = makeCircleTexture();

  /* ── Canvas target: render INTO #globeCanvas ── */
  const canvas = document.getElementById('globeCanvas');

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  const dpr = isMobile ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.opacity = '0';

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.01, 100);

  /* Globe fills ~60% of hero height, bottom slightly cropped */
  camera.position.set(0, 0.5, 3);
  camera.lookAt(0, 0.5, 0);

  /* ── Bloom post-processing ── */
  const renderPass = new THREE.RenderPass(scene, camera);
  const bloomPass  = new THREE.UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    0.75, 0.18, 0.08
  );
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  if (!isMobile) composer.addPass(bloomPass); /* Mobile: skip bloom — 3 render passes saved */

  /* ── Globe group ── */
  const globe = new THREE.Group();
  globe.rotation.x = 0.22;
  scene.add(globe);

  /* ── Back glow ── */
  {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 512;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(256,256,0, 256,256,256);
    grad.addColorStop(0,   'rgba(61,255,143,0.10)');
    grad.addColorStop(0.2, 'rgba(61,255,143,0.1)');
    grad.addColorStop(0.3,'rgba(61,255,143,0.1)');
    grad.addColorStop(0.7, 'rgba(61,255,143,0.015)');
    grad.addColorStop(1,   'rgba(61,255,143,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0,0,512,512);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(8.0, 8.0, 1);
    glowSprite.position.set(0, -0.15, -1.8);
    scene.add(glowSprite);
    window._glowMat = glowMat;
    window._updateGlow = (t, intro) => {
      const base = 0.72 + Math.sin(t * 0.2) * 0.08;
      glowMat.opacity = base * intro;
    };
  }

  /* ── Fresnel atmosphere ── */
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:    { value: GCOL.clone() },
      uStrength: { value: isMobile ? 2.2 : 1.4 }, /* Mobile: stronger fresnel compensates for no bloom */
      uPower:    { value: isMobile ? 3.8 : 5.2 },
    },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vViewDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position,1.0);
        vViewDir = normalize(cameraPosition - wp.xyz);
        vNormal  = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uStrength; uniform float uPower;
      varying vec3 vNormal; varying vec3 vViewDir;
      void main() {
        float ndv = abs(dot(vNormal, vViewDir));
        float f = pow(1.0 - ndv, uPower);
        f *= smoothstep(0.0, 0.3, 1.0 - ndv);
        float a = clamp(f * uStrength, 0.0, 1.0);
        gl_FragColor = vec4(uColor * a, a);
      }`,
    transparent: true, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.FrontSide,
  });
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS*1.002, isMobile?32:64, isMobile?32:64), fresnelMat));

  /* ── Helpers ── */
  function ll(lat, lng, r) {
    const phi   = (90-lat)*Math.PI/180;
    const theta = (lng+180)*Math.PI/180;
    return new THREE.Vector3(
      -r*Math.sin(phi)*Math.cos(theta),
       r*Math.cos(phi),
       r*Math.sin(phi)*Math.sin(theta)
    );
  }
  function lmat(op) {
    const m = new THREE.LineBasicMaterial({
      transparent:true, opacity:op,
      blending:THREE.AdditiveBlending, depthWrite:false
    });
    m.color = GCOL.clone();
    return m;
  }

  /* ── TopoJSON decoder ── */
  function topo2geo(topo, key) {
    const obj=topo.objects[key], arcs=topo.arcs;
    const sc=topo.transform.scale, tr=topo.transform.translate;
    function decArc(i) {
      const rev=i<0, idx=rev?~i:i; let x=0,y=0;
      const pts=arcs[idx].map(([dx,dy])=>{x+=dx;y+=dy;
        return[+(x*sc[0]+tr[0]).toFixed(4),+(y*sc[1]+tr[1]).toFixed(4)]});
      return rev?pts.reverse():pts;
    }
    const features=[];
    for(const geom of obj.geometries) {
      const bR=idxs=>idxs.flatMap(decArc);
      if(geom.type==='Polygon')
        features.push({type:'Polygon',coordinates:geom.arcs.map(bR)});
      else if(geom.type==='MultiPolygon')
        features.push({type:'MultiPolygon',coordinates:geom.arcs.map(p=>p.map(bR))});
    }
    return features;
  }

  function featuresToSegments(features, r) {
    const verts = [];
    const push = coords => {
      for(let i=0;i<coords.length-1;i++){
        const a=ll(coords[i][1],  coords[i][0],  r);
        const b=ll(coords[i+1][1],coords[i+1][0],r);
        verts.push(a.x,a.y,a.z, b.x,b.y,b.z);
      }
    };
    for(const f of features){
      if(f.type==='Polygon')           f.coordinates.forEach(push);
      else if(f.type==='MultiPolygon') f.coordinates.forEach(p=>p.forEach(push));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    return geo;
  }

  /* ── Prefetch both geo files in parallel immediately — single fetch each ── */
  let _landTopoPromise    = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json').then(r=>r.json());
  let _countriesTopoPromise = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(r=>r.json());

  function fetchLandTopo()      { return _landTopoPromise; }
  function fetchCountriesTopo() { return _countriesTopoPromise; }

  /* ── Countries ── */
  async function loadCountries() {
    const topo     = await fetchCountriesTopo();
    const features = topo2geo(topo,'countries');
    const geo = featuresToSegments(features, RADIUS+0.004);
    const mat = new THREE.LineBasicMaterial({
      color:GCOL.clone(), transparent:true, opacity:0.55,
      blending:THREE.AdditiveBlending, depthWrite:false
    });
    globe.add(new THREE.LineSegments(geo, mat));
  }

  /* ── Land layers ── */
  async function loadLand() {
    const topo     = await fetchLandTopo();
    const features = topo2geo(topo,'land');
    const layers = isMobile ? [
      { r: RADIUS+0.004, op: 0.55 },
      { r: RADIUS+0.000, op: 0.28 },
      { r: RADIUS-0.016, op: 0.08 },
    ] : [
      { r: RADIUS+0.004, op: 0.55 },
      { r: RADIUS+0.002, op: 0.42 },
      { r: RADIUS+0.000, op: 0.28 },
      { r: RADIUS-0.006, op: 0.16 },
      { r: RADIUS-0.016, op: 0.08 },
      { r: RADIUS-0.032, op: 0.03 },
    ];
    for(const {r, op} of layers){
      const geo = featuresToSegments(features, r);
      globe.add(new THREE.LineSegments(geo, lmat(op)));
    }
  }

  /* ── Cities ── */
  const CITIES = [
    [51.5,-0.1,'London',1], [48.9,2.3,'Paris',1], [52.5,13.4,'Berlin',0],
    [40.7,-74.0,'New York',1], [34.1,-118.2,'Los Angeles',0], [37.8,-122.4,'San Francisco',1],
    [43.7,-79.4,'Toronto',0], [19.4,-99.1,'Mexico City',0],
    [35.7,139.7,'Tokyo',1], [31.2,121.5,'Shanghai',1], [39.9,116.4,'Beijing',1],
    [37.6,127.0,'Seoul',0], [1.35,103.8,'Singapore',1], [28.6,77.2,'Delhi',0],
    [19.1,72.9,'Mumbai',0], [25.0,55.2,'Dubai',1], [41.0,28.9,'Istanbul',0],
    [55.8,37.6,'Moscow',0], [59.3,18.1,'Stockholm',0], [52.2,21.0,'Warsaw',0],
    [30.1,31.2,'Cairo',0], [-26.2,28.0,'Johannesburg',0], [-1.3,36.8,'Nairobi',0],
    [-23.5,-46.6,'São Paulo',0], [-34.6,-58.4,'Buenos Aires',0],
    [-33.9,151.2,'Sydney',0], [-37.8,145.0,'Melbourne',0],
    [22.3,114.2,'Hong Kong',1], [13.8,100.5,'Bangkok',0], [3.1,101.7,'KL',0],
  ];

  const ARC_PAIRS = [
    [0,3],[0,9],[1,22],[2,18],[3,6],[3,10],[4,7],[5,16],
    [6,14],[8,3],[8,9],[9,11],[10,8],[11,12],[12,15],[13,15],
    [14,12],[15,0],[16,0],[17,2],[18,17],[19,2],[20,21],[21,22],
    [23,3],[24,23],[25,8],[26,25],[27,11],[28,12],
  ];

  function makeArc(latA,lngA,latB,lngB,segments=80){
    const vA = ll(latA,lngA,RADIUS+0.008);
    const vB = ll(latB,lngB,RADIUS+0.008);
    const pts = [];
    const mid = vA.clone().add(vB).multiplyScalar(0.5);
    const lift = 0.18 + mid.length() * 0.12;
    mid.normalize().multiplyScalar(RADIUS + lift);
    for(let i=0;i<=segments;i++){
      const t = i/segments;
      const p = new THREE.Vector3()
        .addScaledVector(vA,(1-t)*(1-t))
        .addScaledVector(mid,2*t*(1-t))
        .addScaledVector(vB,t*t);
      pts.push(p);
    }
    return pts;
  }

  const cityPulseObjs = [];
  function addCities(){
    const vertsNorm = [], vertsMajor = [];
    CITIES.forEach(([lat,lng,,tier]) => {
      const v = ll(lat, lng, RADIUS+0.008);
      if(tier) vertsMajor.push(v.x,v.y,v.z);
      else     vertsNorm.push(v.x,v.y,v.z);
    });
    const makePointsGeo = verts => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts),3));
      return g;
    };
    globe.add(new THREE.Points(makePointsGeo(vertsNorm), new THREE.PointsMaterial({
      color:GCOL.clone(), size:0.014, map:dotTex,
      alphaTest:0.01, transparent:true, opacity:0.85,
      blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true,
    })));
    globe.add(new THREE.Points(makePointsGeo(vertsMajor), new THREE.PointsMaterial({
      color:GCOL.clone(), size:0.024, map:dotTex,
      alphaTest:0.01, transparent:true, opacity:1.0,
      blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true,
    })));
    CITIES.forEach(([lat,lng,,tier], idx) => {
      const origin = ll(lat, lng, RADIUS+0.008);
      const segments = 24;
      const ringVerts = new Float32Array((segments+1)*3);
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringVerts, 3));
      const ringMat = new THREE.LineBasicMaterial({
        color: GCOL.clone(), transparent:true, opacity:0,
        blending:THREE.AdditiveBlending, depthWrite:false,
      });
      const ring = new THREE.LineLoop(ringGeo, ringMat);
      globe.add(ring);
      cityPulseObjs.push({ origin, ring, ringGeo, ringMat, segments, offset: idx * 0.4, tier: tier||0, lat });
    });
  }

  function updateCityPulse(t){
    cityPulseObjs.forEach(({origin, ringGeo, ringMat, segments, offset, tier, lat}) => {
      if(Math.abs(lat) > 65){ ringMat.opacity = 0; return; }
      const cycle = 3.0;
      const local = (t * 0.8 + offset) % cycle;
      const progress = local / cycle;
      const maxR = tier ? 0.038 : 0.022;
      const peakOpacity = tier ? 0.9 : 0.7;
      const r = progress * maxR;
      ringMat.opacity = Math.sin(progress * Math.PI) * peakOpacity;
      const normal = origin.clone().normalize();
      const up = Math.abs(normal.y) < 0.9 ? new THREE.Vector3(0,1,0) : new THREE.Vector3(1,0,0);
      const tangent = new THREE.Vector3().crossVectors(normal, up).normalize();
      const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
      const pos = ringGeo.attributes.position;
      for(let i=0;i<=segments;i++){
        const a = (i/segments)*Math.PI*2;
        const p = origin.clone()
          .addScaledVector(tangent, Math.cos(a)*r)
          .addScaledVector(bitangent, Math.sin(a)*r);
        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;
    });
  }

  /* ── Arcs ── */
  const arcObjects = [];
  const meteorGeo = new THREE.BufferGeometry();
  meteorGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
  const meteorPoints = new THREE.Points(meteorGeo, new THREE.PointsMaterial({
    color: GCOL.clone(), size: 0.032, map: dotTex,
    alphaTest:0.01, transparent:true, opacity:0.95,
    blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true,
  }));
  globe.add(meteorPoints);

  function buildArcs(){
    ARC_PAIRS.forEach(([i,j], idx) => {
      const [latA,lngA] = CITIES[i];
      const [latB,lngB] = CITIES[j];
      const pts = makeArc(latA,lngA,latB,lngB);
      const N = pts.length;
      const allPos = new Float32Array(N*3);
      const normIdx = new Float32Array(N);
      pts.forEach((p,k)=>{
        allPos[k*3]=p.x; allPos[k*3+1]=p.y; allPos[k*3+2]=p.z;
        normIdx[k] = k / (N - 1);
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(allPos,3));
      geo.setAttribute('aIdx',     new THREE.BufferAttribute(normIdx,1));
      geo.setDrawRange(0,0);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor:   { value: GCOL.clone() },
          uOpacity: { value: 0.0 },
          uTail:    { value: 0.0 },
          uHead:    { value: 0.0 },
        },
        vertexShader: `
          attribute float aIdx; varying float vIdx;
          void main(){ vIdx = aIdx; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uOpacity, uTail, uHead; varying float vIdx;
          void main(){
            float range = uHead - uTail;
            float frac  = range > 0.0 ? (vIdx - uTail) / range : 1.0;
            frac = clamp(frac, 0.0, 1.0);
            float bright = frac * frac;
            gl_FragColor = vec4(uColor * bright, bright * uOpacity);
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      globe.add(line);
      arcObjects.push({ line, geo, mat, pts, total: N,
        offset: idx * 0.7 + Math.random()*2,
        duration: 2.0 + Math.random()*1.0,
        pause:    1.5 + Math.random()*2.0,
      });
    });
    const mPos = new Float32Array(arcObjects.length*3);
    meteorGeo.setAttribute('position', new THREE.BufferAttribute(mPos,3));
  }

  function updateArcs(t){
    const TAIL_FRAC = 0.35;
    const mPos = meteorGeo.attributes.position;
    arcObjects.forEach((arc, idx) => {
      const cycle = arc.duration + arc.pause;
      const local = ((t + arc.offset) % cycle);
      if(local < arc.duration){
        const progress = local / arc.duration;
        const head = Math.min(arc.total-1, Math.floor(progress * arc.total));
        const tailLen = Math.floor(arc.total * TAIL_FRAC);
        const tail = Math.max(0, head - tailLen);
        arc.geo.setDrawRange(tail, head - tail + 1);
        arc.mat.uniforms.uTail.value    = tail    / (arc.total - 1);
        arc.mat.uniforms.uHead.value    = head    / (arc.total - 1);
        arc.mat.uniforms.uOpacity.value = 0.9 * Math.sin(progress * Math.PI);
        const hp = arc.pts[head];
        mPos.setXYZ(idx, hp.x, hp.y, hp.z);
        meteorPoints.material.opacity = 0.95;
      } else {
        arc.geo.setDrawRange(0,0);
        arc.mat.uniforms.uOpacity.value = 0;
        mPos.setXYZ(idx, 0, 0, 0);
      }
    });
    mPos.needsUpdate = true;
  }

  /* ── Land mask ── */
  async function buildLandMask(features) {
    const W = 1024, H = 512;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#fff';
    const project = (lng, lat) => [(lng+180)/360*W, (90-lat)/180*H];
    const drawRing = coords => {
      if(coords.length < 2) return;
      ctx.beginPath();
      const [x0,y0] = project(coords[0][0], coords[0][1]);
      ctx.moveTo(x0, y0);
      for(let i=1;i<coords.length;i++){
        const [x,y] = project(coords[i][0], coords[i][1]);
        ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.fill();
    };
    for(const f of features){
      if(f.type==='Polygon')           f.coordinates.forEach(drawRing);
      else if(f.type==='MultiPolygon') f.coordinates.forEach(p=>p.forEach(drawRing));
    }
    return new THREE.CanvasTexture(c);
  }

  /* ── Noise mesh ── */
  let noiseMat = null;
  function buildNoiseMesh() {
    noiseMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: GCOL.clone() }, uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vViewDir; varying vec3 vWorldPos;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vWorldPos = wp.xyz;
          vViewDir  = normalize(cameraPosition - wp.xyz);
          vNormal   = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uTime;
        varying vec3 vNormal; varying vec3 vViewDir; varying vec3 vWorldPos;
        vec3 hash3(vec3 p){
          p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
          return fract(sin(p)*43758.5453);
        }
        float vnoise3(vec3 p){
          vec3 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
          float n000=dot(hash3(i),f),n100=dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0));
          float n010=dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),n110=dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0));
          float n001=dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),n101=dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1));
          float n011=dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),n111=dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1));
          return mix(mix(mix(n000,n100,u.x),mix(n010,n110,u.x),u.y),mix(mix(n001,n101,u.x),mix(n011,n111,u.x),u.y),u.z)*0.5+0.5;
        }
        float fbm3(vec3 p){
          float v=0.0,a=0.5;
          for(int i=0;i<5;i++){v+=a*vnoise3(p);p=p*2.1+vec3(1.7,9.2,3.4);a*=0.5;}
          return v;
        }
        void main(){
          float fresnel=pow(1.0-abs(dot(vNormal,vViewDir)),2.5);
          vec3 p=vWorldPos*3.5;
          float n=fbm3(p+uTime*0.018),n2=fbm3(p*1.8+uTime*0.009+vec3(4.3,1.7,2.1));
          n=smoothstep(0.32,0.72,n); n2=smoothstep(0.34,0.70,n2);
          float noise=max(n,n2*0.6);
          float brightness=noise*0.07+fresnel*0.03+0.007;
          gl_FragColor=vec4(uColor*clamp(brightness,0.0,1.0),1.0);
        }`,
      transparent: false, depthWrite: true, depthTest: true, side: THREE.FrontSide,
    });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS, isMobile?32:64, isMobile?32:64), noiseMat));
  }

  /* ── Load geo ── */
  try { await Promise.all([loadCountries(), loadLand()]); }
  catch(e) { console.warn('Geo load failed:', e); }

  addCities();
  buildArcs();
  buildNoiseMesh();

  /* ── Land glow — land mask built on idle to avoid blocking main thread ── */
  try {
    const topo     = await fetchLandTopo();
    const features = topo2geo(topo,'land');
    const buildWhenIdle = (resolve) => {
      const run = () => resolve(buildLandMask(features));
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 2000 });
      else setTimeout(run, 200);
    };
    const landTex = await new Promise(buildWhenIdle);
    const landGlowMat = new THREE.ShaderMaterial({
      uniforms: { uLandMask: { value: landTex }, uColor: { value: GCOL.clone() }, uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vViewDir; varying vec3 vWorldPos;
        void main(){
          vec4 wp=modelMatrix*vec4(position,1.0);
          vWorldPos=normalize(wp.xyz); vViewDir=normalize(cameraPosition-wp.xyz);
          vNormal=normalize(normalMatrix*normal);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform sampler2D uLandMask; uniform vec3 uColor; uniform float uTime;
        varying vec3 vNormal; varying vec3 vViewDir; varying vec3 vWorldPos;
        vec2 sphereUV(vec3 n){
          float u=atan(n.z,-n.x)/(2.0*3.14159265)+0.5;
          float v=asin(clamp(n.y,-1.0,1.0))/3.14159265+0.5;
          return vec2(u,v);
        }
        vec3 hash3(vec3 p){
          p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
          return fract(sin(p)*43758.5453);
        }
        float vnoise3(vec3 p){
          vec3 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
          float n000=dot(hash3(i),f),n100=dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0));
          float n010=dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),n110=dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0));
          float n001=dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),n101=dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1));
          float n011=dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),n111=dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1));
          return mix(mix(mix(n000,n100,u.x),mix(n010,n110,u.x),u.y),mix(mix(n001,n101,u.x),mix(n011,n111,u.x),u.y),u.z)*0.5+0.5;
        }
        float fbm3(vec3 p){
          float v=0.0,a=0.5;
          for(int i=0;i<4;i++){v+=a*vnoise3(p);p=p*2.1+vec3(1.7,9.2,3.4);a*=0.5;}
          return v;
        }
        void main(){
          vec2 suv=sphereUV(vWorldPos);
          float land=texture2D(uLandMask,suv).r;
          if(land<0.5) discard;
          float fresnel=pow(1.0-abs(dot(vNormal,vViewDir)),2.0);
          vec3 p=vWorldPos*4.0;
          float n=fbm3(p+uTime*0.025);
          n=smoothstep(0.35,0.75,n);
          float brightness=n*0.14+fresnel*0.18+0.015;
          brightness=clamp(brightness,0.0,1.0);
          gl_FragColor=vec4(uColor*brightness,brightness);
        }`,
      transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, depthTest: true, side: THREE.FrontSide,
    });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS+0.001, isMobile?32:64, isMobile?32:64), landGlowMat));
    window._landGlowMat = landGlowMat;
  } catch(e) { console.warn('Land glow failed:', e); }



  /* ══════════════════════════════════════════════════
     INTERACTION — Y-axis only, inertia, auto-rotation
  ══════════════════════════════════════════════════ */
  let isDragging   = false;
  let prevX        = 0;
  let velocityY    = 0;       // inertia accumulator
  let autoRotSpeed = AUTO_ROT;
  let userControlling = false;

  const heroEl = document.getElementById('hero');

  function onDragStart(x) {
    isDragging      = true;
    prevX           = x;
    velocityY       = 0;
    userControlling = true;
    heroEl.style.cursor = 'grabbing';
  }

  function onDragMove(x) {
    if (!isDragging) return;
    const delta = (x - prevX) * 0.004;
    globe.rotation.y += delta;
    /* Accumulate velocity — weighted average for smoothness */
    velocityY = velocityY * 0.6 + delta * 0.4;
    prevX = x;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    heroEl.style.cursor = 'grab';
    /* userControlling stays true while inertia runs;
       auto-rotation resumes smoothly once velocity dies */
  }

  /* Mouse */
  heroEl.addEventListener('mousedown',  e => onDragStart(e.clientX));
  window.addEventListener('mousemove',  e => onDragMove(e.clientX));
  window.addEventListener('mouseup',    () => onDragEnd());

  /* Touch — single finger, horizontal swipe only */
  let touchStartX = 0, touchStartY = 0, touchIntent = null;

  heroEl.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchIntent = null;
  }, { passive: true });

  heroEl.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (touchIntent === null && (dx > 6 || dy > 6)) {
      touchIntent = dx >= dy ? 'horizontal' : 'vertical';
      if (touchIntent === 'horizontal') onDragStart(e.touches[0].clientX);
    }
    if (touchIntent === 'horizontal') onDragMove(e.touches[0].clientX);
  }, { passive: true });

  heroEl.addEventListener('touchend', () => { touchIntent = null; onDragEnd(); }, { passive: true });

  /* Cursor style on hero */
  heroEl.style.cursor = 'grab';

  /* ── Resize ── */
  function onResize() {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ── Pause when hero out of view (performance) ── */
  let heroVisible = true;
  const observer = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
  }, { threshold: 0.01 });
  observer.observe(heroEl);

  /* ── Animate ── */
  const clock = new THREE.Clock();
  let introProgress = 0;
  const FRICTION = 0.92; // inertia decay per frame

  /* Globe canvas opacity and scale driven by GSAP in script.js */
  /* introProgress tracks canvas opacity for glow sync */

  /* Ramp introProgress 0→1 over ~2s for glow sync with canvas fade-in */
  const introStartTime = performance.now();
  const INTRO_DURATION = 2000; // ms — matches globe elastic duration

  (function tick() {
    requestAnimationFrame(tick);
    if (!heroVisible) return;

    const t = clock.getElapsedTime();

    /* Drive introProgress for glow opacity sync */
    introProgress = Math.min(1, (performance.now() - introStartTime) / INTRO_DURATION);

    if (isDragging) {
      /* User actively dragging — no auto-rotation */
    } else if (Math.abs(velocityY) > 0.00005) {
      /* Inertia phase — apply & decay */
      globe.rotation.y += velocityY;
      velocityY *= FRICTION;
      if (Math.abs(velocityY) <= 0.00005) {
        velocityY = 0;
        userControlling = false;
      }
    } else {
      /* Auto-rotation — smooth resume */
      userControlling = false;
      globe.rotation.y += autoRotSpeed;
    }

    /* Subtle wobble on X — read-only, user cannot change X */
    globe.rotation.x = 0.22 + Math.sin(t * 0.15) * 0.004;

    /* Animate arcs, cities, shaders */
    updateArcs(t);
    updateCityPulse(t);
    if (noiseMat)           noiseMat.uniforms.uTime.value = t;
    if (window._landGlowMat) window._landGlowMat.uniforms.uTime.value = t;
    if (window._updateGlow)  window._updateGlow(t, introProgress);

    /* Breathing fresnel + bloom */
    fresnelMat.uniforms.uStrength.value = (isMobile ? 2.2 : 1.38) + Math.sin(t * 0.28) * 0.06;
    if (!isMobile) bloomPass.strength = 0.73 + Math.sin(t * 0.22) * 0.05;

    composer.render();
  })();

})();
