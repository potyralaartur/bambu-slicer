const canvas = document.querySelector("#viewport");
const overlay = document.querySelector("#overlay");
const root = document.querySelector("#turntable");
const input = document.querySelector("#stlInput");
const fitButton = document.querySelector("#fitButton");
const resetButton = document.querySelector("#resetButton");
const loading = document.querySelector("#loading");
const loadingLabel = document.querySelector("#loadingLabel");
const modelName = document.querySelector("#modelName");
const triangleCount = document.querySelector("#triangleCount");
const dropZone = document.querySelector("#dropZone");
const toast = document.querySelector("#toast");

const gl = canvas.getContext("webgl", {
  antialias: true,
  alpha: false,
  depth: true,
  powerPreference: "high-performance",
});

if (!gl) {
  loadingLabel.textContent = "WebGL is required to display this turntable.";
  throw new Error("WebGL is not available in this browser.");
}

const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;

  uniform mat4 uViewProjection;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = aNormal;
    vPosition = aPosition;
    gl_Position = uViewProjection * vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec4 uColor;
  uniform vec3 uCameraPosition;
  uniform float uUnlit;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 base = uColor.rgb;
    if (uUnlit > 0.5) {
      gl_FragColor = uColor;
      return;
    }

    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(vec3(-0.38, -0.56, 0.74));
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    vec3 halfDirection = normalize(lightDirection + viewDirection);
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float specular = pow(max(dot(normal, halfDirection), 0.0), 32.0) * 0.15;
    float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.0) * 0.055;
    vec3 shaded = base * (0.43 + diffuse * 0.57) + vec3(specular + rim);
    gl_FragColor = vec4(shaded, uColor.a);
  }
`;

const textureVertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uViewProjection;

  varying vec2 vTextureCoord;

  void main() {
    vTextureCoord = aTextureCoord;
    gl_Position = uViewProjection * vec4(aPosition, 1.0);
  }
`;

const textureFragmentShaderSource = `
  precision mediump float;

  uniform sampler2D uTexture;

  varying vec2 vTextureCoord;

  void main() {
    vec4 color = texture2D(uTexture, vTextureCoord);
    if (color.a < 0.01) discard;
    gl_FragColor = color;
  }
`;

const program = createProgram(vertexShaderSource, fragmentShaderSource);
const locations = {
  position: gl.getAttribLocation(program, "aPosition"),
  normal: gl.getAttribLocation(program, "aNormal"),
  viewProjection: gl.getUniformLocation(program, "uViewProjection"),
  color: gl.getUniformLocation(program, "uColor"),
  cameraPosition: gl.getUniformLocation(program, "uCameraPosition"),
  unlit: gl.getUniformLocation(program, "uUnlit"),
};
const textureProgram = createProgram(textureVertexShaderSource, textureFragmentShaderSource);
const textureLocations = {
  position: gl.getAttribLocation(textureProgram, "aPosition"),
  textureCoord: gl.getAttribLocation(textureProgram, "aTextureCoord"),
  viewProjection: gl.getUniformLocation(textureProgram, "uViewProjection"),
  texture: gl.getUniformLocation(textureProgram, "uTexture"),
};

const FOV = radians(34);
const PLATE_HALF = 128;
const camera = {
  yaw: radians(-45),
  pitch: radians(46),
  distance: 525,
  target: [0, 0, 30],
};

const defaultCamera = {
  yaw: camera.yaw,
  pitch: camera.pitch,
  distance: camera.distance,
  target: [...camera.target],
};

let viewProjection = identityMatrix();
let cameraPosition = [0, 0, 0];
let modelMesh = null;
let modelBounds = { width: 60, depth: 32, height: 48, radius: 42 };
let renderQueued = false;
let toastTimer = 0;
let dragDepth = 0;

const fallbackPlate = createPlateGeometry();
let plateTopMesh = createGpuMesh(fallbackPlate.top.positions, fallbackPlate.top.normals);
let plateSideMesh = createGpuMesh(fallbackPlate.sides.positions, fallbackPlate.sides.normals);
const plateTextureMesh = createPlateTextureMesh();
let plateTexture = null;
const gridMesh = createGpuMesh(...createGridGeometry(), gl.LINES);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.disable(gl.CULL_FACE);

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(root);

fitButton.addEventListener("click", () => {
  fitView();
});

resetButton.addEventListener("click", () => {
  resetView();
});

input.addEventListener("change", async () => {
  const [file] = input.files;
  if (file) await importFile(file);
  input.value = "";
});

setupPointerControls();
setupDropImport();
setupKeyboardControls();
loadPlateAssets();
loadDefaultModel();

async function loadPlateAssets() {
  try {
    const modelUrl = new URL("./bbl-3dp-X1.stl", import.meta.url);
    const textureUrl = new URL("./bbl-3dp-logo.svg", import.meta.url);
    const [response, image] = await Promise.all([fetch(modelUrl), loadImage(textureUrl)]);
    if (!response.ok) throw new Error(`Could not load the P1S build plate (${response.status})`);

    const geometry = positionPlateGeometry(parseStl(await response.arrayBuffer()));
    gl.deleteBuffer(plateTopMesh.buffer);
    gl.deleteBuffer(plateSideMesh.buffer);
    plateTopMesh = createGpuMesh(geometry.positions, geometry.normals);
    plateSideMesh = null;
    plateTexture = createTexture(image);
    fitView();
  } catch (error) {
    console.warn("Using the fallback build plate.", error);
  }
}

async function loadDefaultModel() {
  try {
    const response = await fetch(new URL("./benchy.stl", import.meta.url));
    if (!response.ok) throw new Error(`Could not load Benchy (${response.status})`);
    const buffer = await response.arrayBuffer();
    setGeometry(parseStl(buffer), "3DBenchy.stl");
  } catch (error) {
    console.warn(error);
    setGeometry(createFallbackBenchy(), "3DBenchy (preview)");
    showToast("Using the built-in Benchy preview. Serve this folder to load the full STL.");
  } finally {
    loading.classList.add("is-hidden");
  }
}

async function importFile(file) {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    showToast("Choose an STL file to import.", true);
    return;
  }

  loadingLabel.textContent = `Importing ${file.name}…`;
  loading.classList.remove("is-hidden");

  try {
    const buffer = await file.arrayBuffer();
    setGeometry(parseStl(buffer), file.name);
    showToast(`${file.name} placed on the build plate`);
  } catch (error) {
    console.error(error);
    showToast(error.message || "This STL could not be imported.", true);
  } finally {
    loading.classList.add("is-hidden");
  }
}

function setGeometry(geometry, name) {
  const normalized = centerAndPlaceGeometry(geometry);

  if (modelMesh) gl.deleteBuffer(modelMesh.buffer);
  modelMesh = createGpuMesh(normalized.positions, normalized.normals);
  modelBounds = normalized.bounds;

  modelName.textContent = name;
  modelName.title = name;
  triangleCount.textContent = `${formatNumber(modelMesh.count / 3)} tris`;
  fitView();
}

function parseStl(buffer) {
  if (buffer.byteLength < 15) throw new Error("The STL file is empty or incomplete.");

  const view = new DataView(buffer);
  const possibleTriangles = buffer.byteLength >= 84 ? view.getUint32(80, true) : 0;
  const binaryLength = 84 + possibleTriangles * 50;
  const isBinary = possibleTriangles > 0 && binaryLength <= buffer.byteLength;

  return isBinary ? parseBinaryStl(view, possibleTriangles) : parseAsciiStl(buffer);
}

function parseBinaryStl(view, count) {
  if (count > 2_000_000) {
    throw new Error("This STL is too detailed for the browser viewer (2M triangle limit). ");
  }

  const positions = new Float32Array(count * 9);
  const normals = new Float32Array(count * 9);
  let offset = 84;
  let cursor = 0;

  for (let triangle = 0; triangle < count; triangle += 1) {
    let nx = view.getFloat32(offset, true);
    let ny = view.getFloat32(offset + 4, true);
    let nz = view.getFloat32(offset + 8, true);
    offset += 12;

    const start = cursor;
    for (let vertex = 0; vertex < 3; vertex += 1) {
      positions[cursor] = view.getFloat32(offset, true);
      positions[cursor + 1] = view.getFloat32(offset + 4, true);
      positions[cursor + 2] = view.getFloat32(offset + 8, true);
      cursor += 3;
      offset += 12;
    }

    if (!Number.isFinite(nx + ny + nz) || Math.hypot(nx, ny, nz) < 1e-6) {
      [nx, ny, nz] = triangleNormal(positions, start);
    } else {
      const length = Math.hypot(nx, ny, nz);
      nx /= length;
      ny /= length;
      nz /= length;
    }

    for (let i = start; i < start + 9; i += 3) {
      normals[i] = nx;
      normals[i + 1] = ny;
      normals[i + 2] = nz;
    }

    offset += 2;
  }

  return { positions, normals };
}

function parseAsciiStl(buffer) {
  const text = new TextDecoder().decode(buffer);
  const values = [];
  const vertexPattern = /vertex\s+([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)\s+([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)\s+([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)/gi;
  let match;

  while ((match = vertexPattern.exec(text))) {
    values.push(Number(match[1]), Number(match[2]), Number(match[3]));
    if (values.length > 18_000_000) {
      throw new Error("This STL is too detailed for the browser viewer (2M triangle limit). ");
    }
  }

  if (values.length < 9 || values.length % 9 !== 0) {
    throw new Error("The ASCII STL does not contain complete triangle data.");
  }

  const positions = new Float32Array(values);
  const normals = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 9) {
    const normal = triangleNormal(positions, i);
    for (let v = 0; v < 9; v += 3) {
      normals[i + v] = normal[0];
      normals[i + v + 1] = normal[1];
      normals[i + v + 2] = normal[2];
    }
  }

  return { positions, normals };
}

function centerAndPlaceGeometry(geometry) {
  const { positions, normals } = geometry;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (!Number.isFinite(x + y + z)) throw new Error("The STL contains invalid coordinates.");
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= centerX;
    positions[i + 1] -= centerY;
    positions[i + 2] -= minZ;
  }

  const width = maxX - minX;
  const depth = maxY - minY;
  const height = maxZ - minZ;
  return {
    positions,
    normals,
    bounds: {
      width,
      depth,
      height,
      radius: Math.hypot(width, depth, height) / 2,
    },
  };
}

function fitView() {
  camera.yaw = defaultCamera.yaw;
  camera.pitch = defaultCamera.pitch;
  camera.target = [0, 0, Math.max(10, modelBounds.height * 0.2)];

  const plateRadius = 190;
  const contentRadius = Math.max(plateRadius, modelBounds.radius * 1.12);
  const aspect = Math.max(1, root.clientWidth) / Math.max(1, root.clientHeight);
  const horizontalHalfFov = Math.atan(Math.tan(FOV / 2) * aspect);
  const limitingHalfFov = Math.min(FOV / 2, horizontalHalfFov);
  camera.distance = clamp(contentRadius / Math.tan(limitingHalfFov), 290, 2600);
  frameSceneInViewport();
  requestRender();
}

function resetView() {
  fitView();
}

function frameSceneInViewport() {
  const width = Math.max(1, root.clientWidth);
  const height = Math.max(1, root.clientHeight);
  const points = getSceneFramePoints();

  for (let pass = 0; pass < 2; pass += 1) {
    updateCameraMatrices(width, height);
    let bounds = getProjectedBounds(points);
    if (!bounds) return;

    const scale = Math.max(bounds.width / (width * 0.88), bounds.height / (height * 0.84));
    camera.distance = clamp(camera.distance * clamp(scale, 0.78, 1.32), 290, 2600);
    updateCameraMatrices(width, height);
    bounds = getProjectedBounds(points);
    if (!bounds) return;

    const shiftX = width / 2 - (bounds.left + bounds.right) / 2;
    const shiftY = height / 2 - (bounds.top + bounds.bottom) / 2;
    const radial = normalizeVector(subtractVectors(cameraPosition, camera.target));
    const right = normalizeVector(crossVectors([0, 0, 1], radial));
    const up = normalizeVector(crossVectors(radial, right));
    const worldPerPixel = 2 * camera.distance * Math.tan(FOV / 2) / height;
    camera.target = addVectors(
      camera.target,
      addVectors(
        scaleVector(right, -shiftX * worldPerPixel),
        scaleVector(up, shiftY * worldPerPixel),
      ),
    );
  }
}

function getSceneFramePoints() {
  const points = [
    [-129, -138, -0.4], [129, -138, -0.4], [129, 138, -0.4], [-129, 138, -0.4],
    [-129, -138, 0], [129, -138, 0], [129, 138, 0], [-129, 138, 0],
  ];
  const halfWidth = modelBounds.width / 2;
  const halfDepth = modelBounds.depth / 2;
  for (const z of [0, modelBounds.height]) {
    points.push(
      [-halfWidth, -halfDepth, z], [halfWidth, -halfDepth, z],
      [halfWidth, halfDepth, z], [-halfWidth, halfDepth, z],
    );
  }
  return points;
}

function getProjectedBounds(points) {
  const projected = points.map(projectPoint).filter(Boolean);
  if (!projected.length) return null;
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}

function resize() {
  const width = Math.max(1, root.clientWidth);
  const height = Math.max(1, root.clientHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  overlay.width = Math.round(width * dpr);
  overlay.height = Math.round(height * dpr);
  requestRender();
}

function requestRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    render();
  });
}

function render() {
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height) return;
  updateCameraMatrices(width, height);

  gl.viewport(0, 0, width, height);
  gl.clearColor(0.114, 0.122, 0.125, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.uniformMatrix4fv(locations.viewProjection, false, viewProjection);
  gl.uniform3fv(locations.cameraPosition, cameraPosition);

  if (plateSideMesh) drawMesh(plateSideMesh, [0.105, 0.11, 0.12, 1]);
  drawMesh(plateTopMesh, [0.19, 0.2, 0.22, 1]);
  drawMesh(gridMesh, [0.31, 0.32, 0.35, 0.62], true);
  if (plateTexture) drawTexturedMesh(plateTextureMesh, plateTexture);

  if (modelMesh) drawMesh(modelMesh, [0.68, 0.68, 0.68, 1]);

  drawOverlay();
}

function updateCameraMatrices(width, height) {
  const aspect = width / height;
  const cosPitch = Math.cos(camera.pitch);
  const radial = [
    cosPitch * Math.cos(camera.yaw),
    cosPitch * Math.sin(camera.yaw),
    Math.sin(camera.pitch),
  ];

  cameraPosition = [
    camera.target[0] + radial[0] * camera.distance,
    camera.target[1] + radial[1] * camera.distance,
    camera.target[2] + radial[2] * camera.distance,
  ];

  const projection = perspectiveMatrix(FOV, aspect, 0.5, 5000);
  const view = lookAtMatrix(cameraPosition, camera.target, [0, 0, 1]);
  viewProjection = multiplyMatrices(projection, view);
}

function drawMesh(mesh, color, unlit = false) {
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
  gl.enableVertexAttribArray(locations.position);
  gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(locations.normal);
  gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, 24, 12);
  gl.uniform4fv(locations.color, color);
  gl.uniform1f(locations.unlit, unlit ? 1 : 0);
  gl.drawArrays(mesh.mode, 0, mesh.count);
}

function createGpuMesh(positions, normals, mode = gl.TRIANGLES) {
  const interleaved = new Float32Array((positions.length / 3) * 6);
  for (let source = 0, target = 0; source < positions.length; source += 3, target += 6) {
    interleaved[target] = positions[source];
    interleaved[target + 1] = positions[source + 1];
    interleaved[target + 2] = positions[source + 2];
    interleaved[target + 3] = normals[source];
    interleaved[target + 4] = normals[source + 1];
    interleaved[target + 5] = normals[source + 2];
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);
  return { buffer, count: positions.length / 3, mode };
}

function createPlateTextureMesh() {
  const data = new Float32Array([
    -129, -138, 0.08, 0, 0,
     129, -138, 0.08, 1, 0,
     129,  138, 0.08, 1, 1,
    -129, -138, 0.08, 0, 0,
     129,  138, 0.08, 1, 1,
    -129,  138, 0.08, 0, 1,
  ]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return { buffer, count: 6 };
}

function drawTexturedMesh(mesh, texture) {
  gl.useProgram(textureProgram);
  gl.uniformMatrix4fv(textureLocations.viewProjection, false, viewProjection);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
  gl.enableVertexAttribArray(textureLocations.position);
  gl.vertexAttribPointer(textureLocations.position, 3, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(textureLocations.textureCoord);
  gl.vertexAttribPointer(textureLocations.textureCoord, 2, gl.FLOAT, false, 20, 12);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(textureLocations.texture, 0);
  gl.depthMask(false);
  gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
  gl.depthMask(true);
  gl.useProgram(program);
}

function createTexture(image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error("Could not load the P1S plate artwork.")), { once: true });
    image.src = url.href;
  });
}

function positionPlateGeometry(geometry) {
  for (let i = 0; i < geometry.positions.length; i += 3) {
    geometry.positions[i] -= 129;
    geometry.positions[i + 1] -= 128;
  }
  return geometry;
}

function createPlateGeometry() {
  const edge = PLATE_HALF;
  const cut = 9;
  const zTop = 0;
  const zBottom = -5;
  const polygon = [
    [-edge + cut, -edge], [edge - cut, -edge], [edge, -edge + cut], [edge, edge - cut],
    [edge - cut, edge], [-edge + cut, edge], [-edge, edge - cut], [-edge, -edge + cut],
  ];

  const topPositions = [];
  const topNormals = [];
  for (let i = 1; i < polygon.length - 1; i += 1) {
    pushTriangle(topPositions, topNormals,
      [polygon[0][0], polygon[0][1], zTop],
      [polygon[i][0], polygon[i][1], zTop],
      [polygon[i + 1][0], polygon[i + 1][1], zTop]);
  }

  const sidePositions = [];
  const sideNormals = [];
  for (let i = 0; i < polygon.length; i += 1) {
    const next = (i + 1) % polygon.length;
    const a = [polygon[i][0], polygon[i][1], zTop];
    const b = [polygon[next][0], polygon[next][1], zTop];
    const c = [polygon[next][0], polygon[next][1], zBottom];
    const d = [polygon[i][0], polygon[i][1], zBottom];
    pushTriangle(sidePositions, sideNormals, a, b, c);
    pushTriangle(sidePositions, sideNormals, a, c, d);
  }

  return {
    top: { positions: new Float32Array(topPositions), normals: new Float32Array(topNormals) },
    sides: { positions: new Float32Array(sidePositions), normals: new Float32Array(sideNormals) },
  };
}

function createGridGeometry() {
  const positions = [];
  const normals = [];
  const limit = PLATE_HALF - 4;
  for (let value = -120; value <= 120; value += 10) {
    positions.push(-limit, value, 0.07, limit, value, 0.07);
    positions.push(value, -limit, 0.07, value, limit, 0.07);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
  }
  return [new Float32Array(positions), new Float32Array(normals)];
}

function drawOverlay() {
  const context = overlay.getContext("2d");
  const dpr = overlay.width / Math.max(1, root.clientWidth);
  context.clearRect(0, 0, overlay.width, overlay.height);

  drawAxisGizmo(context, dpr);
}

function drawAxisGizmo(context, dpr) {
  const origin = [128, -128, 0.22];
  const size = 22;
  const base = projectPoint(origin);
  if (!base) return;
  const pad = [
    base,
    projectPoint([128, -128 + size, 0.22]),
    projectPoint([128 - size, -128 + size, 0.22]),
    projectPoint([128 - size, -128, 0.22]),
  ];
  if (pad.some((point) => !point)) return;
  const worldAxes = [
    { point: projectPoint([128, -128 + size, 0.22]), color: "#e21c23" },
    { point: projectPoint([128 - size, -128, 0.22]), color: "#00b83f" },
    { point: projectPoint([128, -128, 0.22 + size]), color: "#1737c9" },
  ];

  context.save();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.fillStyle = "rgba(215, 218, 219, 0.88)";
  context.strokeStyle = "rgba(93, 97, 99, 0.72)";
  context.lineWidth = 0.8;
  context.beginPath();
  context.moveTo(pad[0].x, pad[0].y);
  for (let i = 1; i < pad.length; i += 1) context.lineTo(pad[i].x, pad[i].y);
  context.closePath();
  context.fill();
  context.stroke();

  const xMidA = projectPoint([128 - size / 2, -128, 0.23]);
  const xMidB = projectPoint([128 - size / 2, -128 + size, 0.23]);
  const yMidA = projectPoint([128, -128 + size / 2, 0.23]);
  const yMidB = projectPoint([128 - size, -128 + size / 2, 0.23]);
  if (xMidA && xMidB && yMidA && yMidB) {
    context.beginPath();
    context.moveTo(xMidA.x, xMidA.y);
    context.lineTo(xMidB.x, xMidB.y);
    context.moveTo(yMidA.x, yMidA.y);
    context.lineTo(yMidB.x, yMidB.y);
    context.stroke();
  }

  context.lineCap = "round";
  context.lineJoin = "round";
  for (const axis of worldAxes) {
    if (!axis.point) continue;
    drawArrow(context, base.x, base.y, axis.point.x, axis.point.y, axis.color);
  }
  context.restore();
}

function drawArrow(context, x1, y1, x2, y2, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 3.6;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(x2 - Math.cos(angle - 0.55) * 8.5, y2 - Math.sin(angle - 0.55) * 8.5);
  context.lineTo(x2 - Math.cos(angle + 0.55) * 8.5, y2 - Math.sin(angle + 0.55) * 8.5);
  context.closePath();
  context.fill();
}

function projectPoint(point) {
  const [x, y, z] = point;
  const clipX = viewProjection[0] * x + viewProjection[4] * y + viewProjection[8] * z + viewProjection[12];
  const clipY = viewProjection[1] * x + viewProjection[5] * y + viewProjection[9] * z + viewProjection[13];
  const clipW = viewProjection[3] * x + viewProjection[7] * y + viewProjection[11] * z + viewProjection[15];
  if (clipW <= 0) return null;
  return {
    x: (clipX / clipW * 0.5 + 0.5) * root.clientWidth,
    y: (-clipY / clipW * 0.5 + 0.5) * root.clientHeight,
  };
}

function setupPointerControls() {
  const pointers = new Map();
  let mouseMode = null;
  let lastMouse = null;

  canvas.addEventListener("pointerdown", (event) => {
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (event.pointerType !== "touch") {
      mouseMode = event.button === 1 || event.button === 2 || event.shiftKey ? "pan" : "rotate";
      lastMouse = { x: event.clientX, y: event.clientY };
      canvas.classList.toggle("is-panning", mouseMode === "pan");
      canvas.classList.toggle("is-rotating", mouseMode === "rotate");
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;

    if (event.pointerType === "touch") {
      const before = [...pointers.values()];
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const after = [...pointers.values()];

      if (after.length === 1) {
        orbit(after[0].x - before[0].x, after[0].y - before[0].y);
      } else if (after.length === 2 && before.length === 2) {
        const oldCenter = midpoint(before[0], before[1]);
        const newCenter = midpoint(after[0], after[1]);
        const oldDistance = pointDistance(before[0], before[1]);
        const newDistance = pointDistance(after[0], after[1]);
        pan(newCenter.x - oldCenter.x, newCenter.y - oldCenter.y);
        if (oldDistance > 0 && newDistance > 0) {
          camera.distance = clamp(camera.distance * (oldDistance / newDistance), 45, 3000);
          requestRender();
        }
      }
      return;
    }

    if (!lastMouse || !mouseMode) return;
    const dx = event.clientX - lastMouse.x;
    const dy = event.clientY - lastMouse.y;
    lastMouse = { x: event.clientX, y: event.clientY };
    if (mouseMode === "pan") pan(dx, dy);
    else orbit(dx, dy);
  });

  const endPointer = (event) => {
    pointers.delete(event.pointerId);
    if (event.pointerType !== "touch") {
      mouseMode = null;
      lastMouse = null;
      canvas.classList.remove("is-panning", "is-rotating");
    }
  };

  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas.addEventListener("dblclick", () => fitView());
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    camera.distance = clamp(camera.distance * Math.exp(event.deltaY * 0.00125), 45, 3000);
    requestRender();
  }, { passive: false });
}

function orbit(dx, dy) {
  camera.yaw -= dx * 0.007;
  camera.pitch = clamp(camera.pitch + dy * 0.006, radians(7), radians(86));
  requestRender();
}

function pan(dx, dy) {
  const radial = normalizeVector(subtractVectors(cameraPosition, camera.target));
  const right = normalizeVector(crossVectors([0, 0, 1], radial));
  const up = normalizeVector(crossVectors(radial, right));
  const worldPerPixel = 2 * camera.distance * Math.tan(FOV / 2) / Math.max(1, root.clientHeight);
  const horizontal = scaleVector(right, -dx * worldPerPixel);
  const vertical = scaleVector(up, dy * worldPerPixel);
  camera.target = addVectors(camera.target, addVectors(horizontal, vertical));
  requestRender();
}

function setupKeyboardControls() {
  canvas.addEventListener("keydown", (event) => {
    const move = event.shiftKey;
    let handled = true;
    switch (event.key) {
      case "ArrowLeft": move ? pan(-16, 0) : orbit(12, 0); break;
      case "ArrowRight": move ? pan(16, 0) : orbit(-12, 0); break;
      case "ArrowUp": move ? pan(0, -16) : orbit(0, -12); break;
      case "ArrowDown": move ? pan(0, 16) : orbit(0, 12); break;
      case "+":
      case "=": camera.distance = clamp(camera.distance * 0.9, 45, 3000); requestRender(); break;
      case "-":
      case "_": camera.distance = clamp(camera.distance * 1.1, 45, 3000); requestRender(); break;
      case "0": resetView(); break;
      default: handled = false;
    }
    if (handled) {
      event.preventDefault();
    }
  });
}

function setupDropImport() {
  window.addEventListener("dragenter", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth += 1;
    dropZone.classList.add("is-visible");
  });

  window.addEventListener("dragover", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  window.addEventListener("dragleave", (event) => {
    if (!hasFiles(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropZone.classList.remove("is-visible");
  });

  window.addEventListener("drop", async (event) => {
    event.preventDefault();
    dragDepth = 0;
    dropZone.classList.remove("is-visible");
    const [file] = event.dataTransfer.files;
    if (file) await importFile(file);
  });
}

function hasFiles(event) {
  return [...(event.dataTransfer?.types || [])].includes("Files");
}

function showToast(message, isError = false) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function createFallbackBenchy() {
  const positions = [];
  const normals = [];
  const hull = [[-31, 0], [-23, -14], [18, -15], [31, -9], [31, 9], [18, 15], [-23, 14]];
  appendPrism(positions, normals, hull, 0, 17);
  appendBox(positions, normals, [-4, -12, 17], [23, 12, 24]);
  appendBox(positions, normals, [-10, -11, 22], [13, 11, 47]);
  appendBox(positions, normals, [-13, -14, 46], [16, 14, 51]);
  appendCylinder(positions, normals, [-1, 0, 51], 5, 14, 16);
  appendCylinder(positions, normals, [21, 0, 24], 2.8, 10, 12);
  return { positions: new Float32Array(positions), normals: new Float32Array(normals) };
}

function appendPrism(positions, normals, polygon, bottom, top) {
  for (let i = 1; i < polygon.length - 1; i += 1) {
    pushTriangle(positions, normals,
      [polygon[0][0], polygon[0][1], top],
      [polygon[i][0], polygon[i][1], top],
      [polygon[i + 1][0], polygon[i + 1][1], top]);
  }
  for (let i = 0; i < polygon.length; i += 1) {
    const j = (i + 1) % polygon.length;
    const a = [polygon[i][0], polygon[i][1], bottom];
    const b = [polygon[j][0], polygon[j][1], bottom];
    const c = [polygon[j][0], polygon[j][1], top];
    const d = [polygon[i][0], polygon[i][1], top];
    pushTriangle(positions, normals, a, b, c);
    pushTriangle(positions, normals, a, c, d);
  }
}

function appendBox(positions, normals, min, max) {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const faces = [
    [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],
    [[x0,y0,z1],[x0,y1,z1],[x1,y1,z1],[x1,y0,z1]],
    [[x0,y0,z0],[x0,y0,z1],[x1,y0,z1],[x1,y0,z0]],
    [[x1,y1,z0],[x1,y1,z1],[x0,y1,z1],[x0,y1,z0]],
    [[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[x0,y0,z0]],
    [[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],
  ];
  for (const [a,b,c,d] of faces) {
    pushTriangle(positions, normals, a, b, c);
    pushTriangle(positions, normals, a, c, d);
  }
}

function appendCylinder(positions, normals, origin, radius, height, segments) {
  const [cx, cy, z] = origin;
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    const p0 = [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z];
    const p1 = [cx + Math.cos(b) * radius, cy + Math.sin(b) * radius, z];
    const p2 = [p1[0], p1[1], z + height];
    const p3 = [p0[0], p0[1], z + height];
    pushTriangle(positions, normals, p0, p1, p2);
    pushTriangle(positions, normals, p0, p2, p3);
    pushTriangle(positions, normals, [cx, cy, z + height], p3, p2);
  }
}

function pushTriangle(positions, normals, a, b, c) {
  const normal = normalizeVector(crossVectors(subtractVectors(b, a), subtractVectors(c, a)));
  positions.push(...a, ...b, ...c);
  normals.push(...normal, ...normal, ...normal);
}

function triangleNormal(positions, start) {
  const ax = positions[start];
  const ay = positions[start + 1];
  const az = positions[start + 2];
  const abx = positions[start + 3] - ax;
  const aby = positions[start + 4] - ay;
  const abz = positions[start + 5] - az;
  const acx = positions[start + 6] - ax;
  const acy = positions[start + 7] - ay;
  const acz = positions[start + 8] - az;
  return normalizeVector([
    aby * acz - abz * acy,
    abz * acx - abx * acz,
    abx * acy - aby * acx,
  ]);
}

function createProgram(vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  const result = gl.createProgram();
  gl.attachShader(result, vertexShader);
  gl.attachShader(result, fragmentShader);
  gl.linkProgram(result);
  if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(result) || "Could not link WebGL program.");
  }
  return result;
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Could not compile WebGL shader.");
  }
  return shader;
}

function perspectiveMatrix(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function lookAtMatrix(eye, center, up) {
  const z = normalizeVector(subtractVectors(eye, center));
  const x = normalizeVector(crossVectors(up, z));
  const y = crossVectors(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dotVectors(x, eye), -dotVectors(y, eye), -dotVectors(z, eye), 1,
  ]);
}

function multiplyMatrices(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function identityMatrix() {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}

function addVectors(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVector(vector, scale) {
  return [vector[0] * scale, vector[1] * scale, vector[2] * scale];
}

function crossVectors(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dotVectors(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalizeVector(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function radians(degrees) {
  return degrees * Math.PI / 180;
}
