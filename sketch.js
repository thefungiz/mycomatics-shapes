let rSlider, verticalAngleSlider, radialAngleSlider, depressionSlider;
let shapeRadio;
let surfaceCheckbox, gridCheckbox, lightCheckbox;
let r, theta, phi;
let shapeMap;

const addShape = (map, radio, name, formula) => {
  map.set(name, formula);
  radio.option(name);
}

function setup() {
  createCanvas(600, 600, WEBGL);
  
  rSlider = createSlider(50, 300, 150, 1);
  rSlider.position(20, 40);
  
  verticalAngleSlider = createSlider(0, PI+0.01, HALF_PI, PI/8);
  verticalAngleSlider.position(20, 70);
  radialAngleSlider = createSlider(0, 2*PI+0.01, 2*PI, PI/8);
  radialAngleSlider.position(20, 100);
  depressionSlider = createSlider(0, 2*r, 0, r/8);
  depressionSlider.position(20, 130);

  surfaceCheckbox = createCheckbox('Surface');
  surfaceCheckbox.position(200, 40);
  gridCheckbox = createCheckbox('Grid', true);
  gridCheckbox.position(200, 60);
  lightCheckbox = createCheckbox('Light', true);
  lightCheckbox.position(200, 80);

  shapeMap = new Map()

  shapeRadio = createRadio();
  shapeRadio.position(10, 10);

  addShape(shapeMap, shapeRadio, 'convex', (radius, theta, phi) => {return radius})
  addShape(shapeMap, shapeRadio, 'depressed', (radius, theta, phi) => {return radius * sin(theta)})
  addShape(shapeMap, shapeRadio, 'umbonate', (radius, theta, phi) => {return radius * Math.max(sin(theta), cos(theta))})
  addShape(shapeMap, shapeRadio, 'cup', (radius, theta, phi) => {return radius * Math.min(sin(theta), cos(theta))})

  shapeRadio.selected('convex')
}

function draw() {
  background(200);
  
  // Get slider values
  r = rSlider.value();
  let conicAngleMax = verticalAngleSlider.value();
  let radialAngleMax = radialAngleSlider.value();

  // console.table({r, conicAngleMax, radialAngleMax})

  strokeWeight(8);
  stroke(255, 0, 0); // x, red
  line(0, 0, 0, 300, 0, 0);

  stroke(0, 255, 0); // y, green
  line(0, 0, 0, 0, 300, 0);
  
  stroke(0, 0, 255); // z, blue
  line(0, 0, 0, 0, 0, 300);
  
  orbitControl();

  strokeWeight(1)

  if (!surfaceCheckbox.checked()) {
    noFill()
  } else {
    fill('white')
  }

  if (!gridCheckbox.checked()) {
    noStroke();
  } else {
    stroke(0)
  }

  if (!lightCheckbox.checked()) {
    noLights()
  } else {
    lights()
  }

  for (let i = 0; i < 24; i++) {
    let conicAngle1 = map(i, 0, 24, 0, conicAngleMax);
    let conicAngle2 = map(i + 1, 0, 24, 0, conicAngleMax);

    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j <= 24; j++) {
      let radialAngle = map(j, 0, 24, 0, radialAngleMax);
      
      mapVertex(conicAngle1, radialAngle, r)
      mapVertex(conicAngle2, radialAngle, r)
    }
    endShape();
  }
}

// NOTE: different from conventional math.
// theta is the conic angle on the z-axis, azimuth
// phi is the radial angle on the x,y rotation, clock-arm
function mapVertex(theta, phi, baseRadius) {
  const r = shapeMap.get(shapeRadio.value())(baseRadius, theta, phi);
  const x = r * sin(theta) * cos(phi);
  const y = r * sin(theta) * sin(phi);
  const z = r * cos(theta);
  vertex(x, y, z);
}
