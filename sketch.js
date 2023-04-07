var song
var img
var fft
var particles = []

// loads the song
function preload() {
  song = loadSound('take-me-home.mp3')

  // swithc image to a song
  img = loadImage('blue-bg.jpeg')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.1)

  img.filter(BLUR, 12)
}

function draw() {
  background(0);

  // to put circle in center
  translate(width / 2, height / 2)

  // respond to low frequency
  fft.analyze()
  amp = fft.getEnergy(20, 200)

  // slightly rotates bg based on amplitude 
  push()
  if (amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 100, height + 100)
  pop()

  // rectangle
  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(255)
  strokeWeight(10)
  noFill()

  // gets the waveform as an array
  var wave = fft.waveform()

  // connects all the points with a line
  // iterates to 180 because that is degree of 1/2 circ
  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i < 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length -1))
  
      var r = map(wave[index], -1, 1, 150, 350)
  
      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }

  // creates new particle and adds to the array
  var p = new Particle()
  particles.push(p)

  // shows the particles on canvas
  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show()
    }
    else {
      particles.splice(i, 1)
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  }
  else {
    song.play()
    loop()
  }
}

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