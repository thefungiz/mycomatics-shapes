import p5 from 'p5';
let rSlider, verticalAngleSlider, radialAngleSlider, depressionSlider;
let shapeRadio;
let surfaceCheckbox, gridCheckbox, lightCheckbox;
let r, theta, phi;
let shapeMap;
const addShape = (map, radio, name, formula) => {
    map.set(name, formula);
    radio.option(name);
};
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(600, 600, p.WEBGL);
        rSlider = p.createSlider(50, 300, 150, 1);
        rSlider.position(20, 40);
        verticalAngleSlider = p.createSlider(0, p.PI + 0.01, p.HALF_PI, p.PI / 8);
        verticalAngleSlider.position(20, 70);
        radialAngleSlider = p.createSlider(0, 2 * p.PI + 0.01, 2 * p.PI, p.PI / 8);
        radialAngleSlider.position(20, 100);
        depressionSlider = p.createSlider(0, 2 * r, 0, r / 8);
        depressionSlider.position(20, 130);
        surfaceCheckbox = p.createCheckbox('Surface');
        surfaceCheckbox.position(200, 40);
        gridCheckbox = p.createCheckbox('Grid', true);
        gridCheckbox.position(200, 60);
        lightCheckbox = p.createCheckbox('Light', true);
        lightCheckbox.position(200, 80);
        shapeMap = new Map();
        shapeRadio = p.createRadio();
        shapeRadio.position(10, 10);
        addShape(shapeMap, shapeRadio, 'convex', (radius, theta, phi) => { return radius; });
        addShape(shapeMap, shapeRadio, 'depressed', (radius, theta, phi) => { return radius * p.sin(theta); });
        addShape(shapeMap, shapeRadio, 'umbonate', (radius, theta, phi) => { return radius * Math.max(p.sin(theta), p.cos(theta)); });
        addShape(shapeMap, shapeRadio, 'cup', (radius, theta, phi) => { return radius * Math.min(p.sin(theta), p.cos(theta)); });
        shapeRadio.selected('convex');
    };
    p.draw = () => {
        p.background(200);
        // Get slider values
        r = rSlider.value();
        let conicAngleMax = verticalAngleSlider.value();
        let radialAngleMax = radialAngleSlider.value();
        // console.table({r, conicAngleMax, radialAngleMax})
        p.strokeWeight(8);
        p.stroke(255, 0, 0); // x, red
        p.line(0, 0, 0, 300, 0, 0);
        p.stroke(0, 255, 0); // y, green
        p.line(0, 0, 0, 0, 300, 0);
        p.stroke(0, 0, 255); // z, blue
        p.line(0, 0, 0, 0, 0, 300);
        p.orbitControl();
        p.strokeWeight(1);
        if (!surfaceCheckbox.checked()) {
            p.noFill();
        }
        else {
            p.fill('white');
        }
        if (!gridCheckbox.checked()) {
            p.noStroke();
        }
        else {
            p.stroke(0);
        }
        if (!lightCheckbox.checked()) {
            p.noLights();
        }
        else {
            p.lights();
        }
        for (let i = 0; i < 24; i++) {
            let conicAngle1 = p.map(i, 0, 24, 0, conicAngleMax);
            let conicAngle2 = p.map(i + 1, 0, 24, 0, conicAngleMax);
            p.beginShape(p.TRIANGLE_STRIP);
            for (let j = 0; j <= 24; j++) {
                let radialAngle = p.map(j, 0, 24, 0, radialAngleMax);
                mapVertex(p, conicAngle1, radialAngle, r);
                mapVertex(p, conicAngle2, radialAngle, r);
            }
            p.endShape();
        }
    };
};
new p5(sketch);
// NOTE: different from conventional math.
// theta is the conic angle on the z-axis, azimuth
// phi is the radial angle on the x,y rotation, clock-arm
function mapVertex(p, theta, phi, baseRadius) {
    const r = shapeMap.get(shapeRadio.value())(baseRadius, theta, phi);
    const x = r * p.sin(theta) * p.cos(phi);
    const y = r * p.sin(theta) * p.sin(phi);
    const z = r * p.cos(theta);
    p.vertex(x, y, z);
}
