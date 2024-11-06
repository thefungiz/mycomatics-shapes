let rSlider, verticalAngleSlider, radialAngleSlider, depressionSlider;
let shapeRadio;
let surfaceCheckbox;
let r, theta, phi;
let shapeMap;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  rSlider = createSlider(50, 300, 150, 1);
  rSlider.position(20, 10);
  
  verticalAngleSlider = createSlider(0, PI+0.01, HALF_PI, PI/8);
  verticalAngleSlider.position(20, 40);
  radialAngleSlider = createSlider(0, 2*PI+0.01, 2*PI, PI/8);
  radialAngleSlider.position(20, 70);
  depressionSlider = createSlider(0, 2*r, 0, r/8);
  depressionSlider.position(20, 100);

  surfaceCheckbox = createCheckbox('Surface');
  surfaceCheckbox.position(200, 20);

  shapeMap = new Map()
  shapeMap.set('convex', (r, t) => {return r})
  shapeMap.set('depressed', (r, t) => {return Math.max(r * sin(t), depressionSlider.value())})

  shapeRadio = createRadio();
  shapeRadio.position(10, 130);
  shapeRadio.size(60);
  shapeRadio.option('convex')
  shapeRadio.option('depressed')
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
  stroke(0)

  if (!surfaceCheckbox.checked()) {
    noFill()
  } else {
    fill('white')
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

// different from conventional math.
// theta is the conic angle on the z-axis
// phi is the radial angle on the x,y rotation
function mapVertex(theta, phi, baseRadius) {
  const r = shapeMap.get(shapeRadio.value())(baseRadius, theta);
  // const r = baseRadius * sin(theta) * cos(theta); // depressed
  const x = r * sin(theta) * cos(phi);
  const y = r * sin(theta) * sin(phi);
  const z = r * cos(theta);
  vertex(x, y, z);
}
