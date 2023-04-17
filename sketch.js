var song
var img
var fft
var particles = []
let vectors = []
let gradient
const num = 5000
const noiseScale = 0.01

function preload() {
  //song = loadSound('drak.wav')
  img = loadImage('glitchImage.jpg')
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight)
  cnv.mousePressed(userStartAudio)
  mic = new p5.AudioIn()
  mic.start()
  for (let j = 0; j < 5; j++)
  {
    img.filter(ERODE)
  }
  
  angleMode(DEGREES)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  textSize(width/20)
  fft = new p5.FFT(0.9, 1024)
  fft.setInput(mic)

  gradient = createConicGradient(PI,width/2,height/2)

  for(let i = 0; i < num; i++)
  {
    vectors.push(createVector(random(-width,width), random(-height,height)))
  }

  stroke(255)
}

function draw() {
  translate(width / 2, height / 2)
  
  noStroke()
  spectrum = fft.analyze()
  lowEnd = fft.getEnergy("bass")
  background(img, 30)
  //image(glitch.image,-width/2,-height/2,width,height)
  
  
  //center is at 0,0

  // respond to low frequency between 20,200
  lowEndGrad = map(lowEnd,0,250,0.5,0.8)
  gradient.colors(0,"lightblue",0.6, "magenta", 0.6, "white")
  
  
  
  //Background Perlin noise vectors
  let lowEndFactor = map(lowEnd,0,250, 0,1000)
  stroke(255)
  fill(255)
  const speed = lowEnd/128
  strokeWeight(1.5)
  for(let z = 0; z < num; z++) {
    let v = vectors[z]
    point(v.x, v.y)
    let n = noise(v.x * noiseScale, v.y * noiseScale)
    let a = n * 360 
    v.x += cos(a) * speed
    v.y += sin(a) * speed
    if(onScreen(v)) {
      v.x = random(-width, width)
      v.y = random(-height,height)
    }
  }

  // gets the waveform as an array
  var wave = fft.waveform()

  // connects all the points with a line
  // iterates to 180 because that is degree of 1/2 circle
  //Circle
  noFill()
  strokeGradient(gradient)
  //stroke(255)
  strokeWeight(5)
  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i < 180; i += 0.1) {
      var index = floor(map(i, 0, 180, 0, wave.length -1))
  
      var r = map(wave[index], -1, 1, 100, 250)

      var x = r * sin(i) * t
      var y = r * cos(i) * t
      vertex(x, y)
    }
    endShape()
  }
}

function onScreen(v) {
  return v.x < -width || v.x > width ||
    v.y < -height || v.y > height;
}