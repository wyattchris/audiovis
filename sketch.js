var song
var img
var fft
var particles = []
let vectors = []
const num = 5000
const noiseScale = 0.01
// loads the song

function preload() {
  //song = loadSound('drak.wav')

  // imageLoad
  //img = loadImage('blue-bg.jpeg')
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight)
  //let cnv = createCanvas(windowWidth, windowHeight, WEBGL)
  //Mic start
  cnv.mousePressed(userStartAudio)
  mic = new p5.AudioIn()
  let sources = mic.getSources()
  //mic.setSource(1)
  mic.start()

  angleMode(DEGREES)
  //imageMode(CENTER)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  textSize(width/20)
  fft = new p5.FFT(0.9)
  fft.setInput(mic)
  //img.filter(BLUR, 12)
  //colorMode(RGB)


  for(let i = 0; i < num; i++)
  {
    vectors.push(createVector(random(-width,width), random(-height,height)))
  }

  stroke(255)
}

function draw() {
  background(0, 10)

  //center is at 0,0
  translate(width / 2, height / 2)

  // respond to low frequency between 20,200
  spectrum = fft.analyze()
  lowEnd = fft.getEnergy(20, 200)
  stroke(50 + lowEnd)

  centroid = fft.getCentroid()
  
  //I want the spectrum to be displayed

  //beginShape()
  /*
  for (let i = 0; i < spectrum.length; i++) 
  {
  
    //var mappedCent = floor(map(i, 0, 180, 0, spectrum.length -1))
    var freqH = map(spectrum[i], 0,255, 0,200)
    rect(150,height-50, width/spectrum.length, spectrum[i])
  }
  */

  //rectangle as background, fill color determined by low frequencies
  //noStroke()
  //fill(48 + lowEnd, 25, 100)
  //rect(0, 0, width, height)

  
  //Background Perlin noise vectors
  const speed = 1
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

  // micLevel = mic.getLevel()
  // text(micLevel*10,0,0)
  
  // slightly rotates bg based on lowEndlitude 
  if (lowEnd > 230) {
    rotate(random(-0.5, 0.5))
  }

  // gets the waveform as an array
  var wave = fft.waveform()

  // connects all the points with a line
  // iterates to 180 because that is degree of 1/2 circle
  stroke(255)
  noFill()
  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i < 180; i += 0.1) {
      var index = floor(map(i, 0, 180, 0, wave.length -1))
  
      var r = map(wave[index], -1, 1, 150, 300)

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