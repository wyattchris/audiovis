var song
var img
var fft
var particles = []

// loads the song
function preload() {
  //song = loadSound('drak.wav')

  // imageLoad
  img = loadImage('blue-bg.jpeg')
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
  imageMode(CENTER)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  textSize(width/20)
  fft = new p5.FFT(0.1)
  fft.setInput(mic)
  img.filter(BLUR, 12)
}

function draw() {
  background(0)
  translate(width / 2, height / 2)

  // respond to low frequency between 20,200
  spectrum = fft.analyze()
  lowEnd = fft.getEnergy(20, 200)
  centroid = fft.getCentroid()
  
  //I want the spectrum to be displayed
  strokeWeight(5)
  noFill()

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
  
  colorMode(RGB)
  fill(48 + lowEnd, 25, 100)
  rect(0, 0, width, height)
  
  colorMode(RGB)
  noiseScale = .02
  
  /*
  for (x = -width/2; x < width/2; x++)
  {
    for (i = 0; i < spectrum.length; i++)
    {
    var spAmp = spectrum[i] * 300
    stroke(noiseNum*255)
    rect(x, height/2, 1, spAmp)
    }
  }
  */
  
  /*
  for (let x=-width/2; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
  */

  micLevel = mic.getLevel()
  stroke(255, 255, 255, 255) // won't be white?
  text(micLevel*10,0,0)
  
  // slightly rotates bg based on lowEndlitude 
  push()
  if (lowEnd > 230) {
    rotate(random(-0.5, 0.5))
  }

  //image(img, 0, 0, width + 100, height + 100)
  pop()

  // rectangle
  var alpha = map(lowEnd, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(255)
  strokeWeight(5)
  noFill()

  // gets the waveform as an array
  var wave = fft.waveform()

  // connects all the points with a line
  // iterates to 180 because that is degree of 1/2 circ
  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i < 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length -1))
  
      var r = map(wave[index], -1, 1, 150, 300)
  
      //Mapping to polar coordinates?

      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }

  // creates new particle and adds to the array
  //flying things
  
  var p = new Particle()
  particles.push(p)

  // shows the particles on canvas
  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(lowEnd > 230)
      particles[i].show()
    }
    else {
      particles.splice(i, 1)
    }
  }
} 

/*function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  }
  else {
    song.play()
    loop()
  }
}
*/

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3, 5)

    this.color = [random(200, 255), random(200, 255), 
      random(200, 255)]
  }

  // makes the particles move on the screen
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges() {

    // is this particle off the screen?
    if (this.pos.x < - width / 2 || this.pos.x > width / 2 ||
    this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    }
    else {
      return false
    }
  }

  // to show particle on the canvas
  show () {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, 4)
  }
}