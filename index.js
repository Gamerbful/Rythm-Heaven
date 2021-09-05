


let puntos = 0;
let combo = 1;
let heart = 3;

let myMusic = document.getElementById("music");
myMusic.volume = 0.5;
const canv = document.getElementById("canvas");
const context = canv.getContext("2d");
const height = canv.width = 400;
const width = canv.height = 400;
const frameHeight = 127;
const frameWidth = 92;
const xPos = 200;
const yPos = 260;
const scale = 1;
let scale_b = 2.5;
let score = false;
const fps = 30;
const secondsToUpdate = 1 * fps;
let frameIndex = 0;
let frameIndex_b = 0;
let count = 0;
let count_b = 0;
let separate = [265, 185, 100, 5];
let loop = true;
let bucket_t = false;
let punched = false;
var audio_p = new Audio('ost/punch.wav');
var audio_l = new Audio('ost/launch.wav');
var audio_over = new Audio('ost/over.mp3');
var audio_victory = new Audio('ost/victory.mp3');
let lastbeat = 0;
audio_l.volume = 0.05;
audio_p.volume = 0.1;
const spriteSheet = new Image();
spriteSheet.src = "./style/sheet.png";
// pantalon
const pantWidth = 200;
const pantHeight = 60;

// top
const topWidth = 54;
const topHeight = 55;

// arm
const armWidth = 10;
const armHeight = 30;

// head
const headWidth = 35;
const headHeight = 45;

//punch
const punchWidth = 40;
const punchHeight = 30;


let state = "normal";

let pas = 0;
let pas_b = 2;


class Conductor {
  constructor(bpm, offset) {
    this.bpm = bpm;
    this.crotchet = 60 / bpm;
    this.offset = offset;
    this.songposition = 0;
  }

  setSongposition(dpsTime) {
    this.songposition = dpsTime;
  }

}

let conduct = new Conductor(129, 0);






let combo_hit = 0;
let max_frame = conduct.crotchet * 60;
let game_over_frameIndex = 0
let game_over_separate = [0,65,195,325,475,625];
let game_over_width = [65,130,128,150,145,130];


function animate() {

  switch (state) {
    case "normal":

    context.drawImage(
      spriteSheet,
      860,
      610,
      50,
      pantHeight,
      xPos,
      yPos+35,
      50 * scale + pas * 2,
      pantHeight * scale

    );
    context.drawImage(
      spriteSheet,
      860,
      610,
      50,
      pantHeight,
      xPos+25,
      yPos+30,
      50 * scale + pas * 2,
      pantHeight * scale

    );
      context.drawImage(
        spriteSheet,
        55,
        45,
        armWidth,
        armHeight,
        xPos + 43,
        yPos - 45 - pas,
        armWidth * scale,
        armHeight * scale

      )
      context.drawImage(
        spriteSheet,
        55,
        45,
        punchWidth,
        punchHeight,
        xPos + 34,
        yPos - 37 - pas,
        punchWidth * scale,
        punchHeight * scale

      )
      context.drawImage(
        spriteSheet,
        0,
        100,
        pantWidth,
        pantHeight,
        xPos,
        yPos,
        pantWidth * scale + pas * 2,
        pantHeight * scale

      );

      context.drawImage(
        spriteSheet,
        0,
        43,
        topWidth,
        topHeight,
        xPos + 5,
        yPos - 50 - pas,
        topWidth * scale,
        topHeight * scale

      )
      context.drawImage(
        spriteSheet,
        0,
        0,
        headWidth,
        headHeight,
        xPos + 15 + pas,
        yPos - 85 - pas,
        headWidth * scale,
        headHeight * scale

      )
      feelings();



      count++;
      if (count > 30) {
        if (pas == 1) {
          pas = 0
        } else {
          pas = 1;
        }
        count = 0;
      }
      break;
    case "punch":
    context.drawImage(
      spriteSheet,
      860,
      610,
      50,
      pantHeight,
      xPos,
      yPos+35,
      50 * scale + pas * 2,
      pantHeight * scale

    );
    context.drawImage(
      spriteSheet,
      860,
      610,
      50,
      pantHeight,
      xPos+25,
      yPos+30,
      50 * scale + pas * 2,
      pantHeight * scale

    );
      context.drawImage(
        spriteSheet,
        separate[frameIndex],
        157,
        frameWidth-10,
        frameHeight,
        xPos,
        yPos - 70,
        frameWidth * scale,
        frameHeight * scale

      )


      count++;
      if (count > 5) {
        frameIndex++;
        count = 0;
      }
      if (frameIndex > 3) {
        if (score) {
          audio_p.play();
          bucket_t = false;
          scale_b = 2.5;
          shadow_b = 1;
          frameIndex_b = 0;
          score = false;
          punched = true;
          combo_hit++;
          if (combo_hit % 3 === 0 && combo_hit != 0){
                  heal();
          }

          }
         else {
          combo = 1;
          combo_hit = 0;
        }
        state = "normal"
        frameIndex = 0;
      }
      break;
      case "game_over":
      myMusic.pause();
      count++;
      if (count >35) {
        count = 0;
        game_over_frameIndex++;
      }

      context.drawImage(
        spriteSheet,
        game_over_separate[game_over_frameIndex],
        1080,
        game_over_width[game_over_frameIndex],
        140,
        xPos,
        yPos-80,
        game_over_width[game_over_frameIndex],
        140

      );
      if( game_over_frameIndex==5){
        document.getElementById("hint").innerText = "Game Over";
        game_over_frameIndex = 0;
        loop = false;
      }
      break;
      case "win":
      break;
  }
}



let beat = 1;
let rise = false;
let rise_text = false;
// A 1 bucket / B 3 combo faster / C total combo .
beats = [10,30,50,90,120,140];
let old_beat = null;
let lastbeat_combo = 0;
let index = 0;
function throw_bucket() {

  if (conduct.songposition >= conduct.crotchet * beat) {
    beat++;
  }
  if( (conduct.songposition >= conduct.crotchet*beats[index] )|| rise){

    if(!rise ){
      lastbeat_combo = conduct.songposition;
      rise_text = true;
      old_beat = beat;
          rise = true;
      bucket_t = true;
      index++;
    }

    if (conduct.songposition >= lastbeat + conduct.crotchet * 2) {
      lastbeat += conduct.crotchet * 2;
    }
    if (conduct.songposition >= lastbeat_combo + conduct.crotchet * 1.5) {
      bucket_t = true;
      lastbeat_combo += conduct.crotchet * 1.5;
    }
    if( old_beat+6 === beat){
      rise= false;
    }
  }
  else if (conduct.songposition >= lastbeat + conduct.crotchet * 2) {
    rise = false;
    bucket_t = true;
    lastbeat += conduct.crotchet * 2;
  }


}





let count_p = 0;
let scale_p = 1.5;
let index_p = 0;
let new_beat = 0;
let time_pressed = 0;
let shadow_b = 1;
let missed = false;
let gone = false;

function bucket() {
  if (bucket_t) {
    if (frameIndex_b == 0) {
      audio_l.play();
      if (rise) {
        new_beat = lastbeat_combo + (conduct.crotchet*1.5)/2;

      } else {
        new_beat = lastbeat + conduct.crotchet;
      }
    }

    context.drawImage(
      spriteSheet,
      860,
      610,
      50,
      pantHeight,
      xPos + 70,
      yPos+50,
      50 * shadow_b,
      pantHeight * shadow_b

    );

    context.drawImage(
      spriteSheet,
      482.5,
      435,
      36,
      38,
      xPos + 70,
      yPos - 67,
      36 * scale_b,
      38 * scale_b

    )


    if (conduct.songposition > new_beat) {
      score = true;
      time_pressed = conduct.songposition;
    }
    if (rise) {
      if(rise_text){
        context.drawImage(
          spriteSheet,
          950,
          650,
          130,
          50,
          xPos,
          yPos-100,
          130 * scale,
          50 * scale

        );
        if(frameIndex_b > 6  ){
          rise_text = false;
        }
      }
      count_b++;
      if (count_b > (max_frame*1.5) / 5 ) {
        frameIndex_b++;
        count_b = 0;
        scale_b = scale_b - 0.25;
        shadow_b -= 0.1;
      }
      if (frameIndex_b > 7) {
        bucket_t = false;
        score = false;
        gone = true;
        hitted();
        scale_b = 2.5;
        shadow_b = 1;
        frameIndex_b = 0;

      }
    } if (!rise ){
      count_b++;

      if (count_b > (max_frame * 2) / 5) {
        frameIndex_b++;
        count_b = 0;
        scale_b = scale_b - 0.25;
        shadow_b -= 0.1;
      }
      if (frameIndex_b > 7) {
        bucket_t = false;
        score = false;
        if(!missed){
        hitted();
      }
      else{
        missed = false;
      }
        scale_b = 2.5;
        frameIndex_b = 0;
        shadow_b = 1;
      }
    }
  }
  if (punched) {

    context.drawImage(

      spriteSheet,
      482.5,
      435,
      36,
      38,
      xPos + 70 + index_p,
      yPos - 67 + index_p * 2,
      36 * scale_p,
      38 * scale_p

    )
    if( scale_p > 1.3){
    context.drawImage(
      spriteSheet,
      440,
      390,
      55,
      52,
      xPos + 42,
      yPos - 60,
      55 * 1,
      52 * 1

    )
  }
    count_p++;
    if (count_p > 10) {
      index_p += 10;
      count_p = 0;
      scale_p = scale_p - 0.1;
    }
    if (index_p > 50) {
      index_p = 0;
      punched = false;
      scale_p = 1.5;
    }
  }

}

function feelings(){
  if (combo_hit % 3 === 0 && combo_hit != 0){

    context.drawImage(
      spriteSheet,
      193,
      0,
      headWidth-2,
      headHeight,
      xPos + 15 + pas,
      yPos - 85 - pas,
      headWidth-2 * scale,
      headHeight * scale

    )
  }
}
function background() {
  if(state != "win"){
  if (beat % 2 === 0) {
    context.drawImage(
      spriteSheet,
      750,
      700,
      288,
      180,
      90,
      150,
      288,
      180

    )
  } else {
    context.drawImage(
      spriteSheet,
      750,
      885,
      288,
      160,
      90,
      170,
      288,
      160

    )
  }
}
else{
  context.drawImage(
    spriteSheet,
    1280,
    885,
    288,
    160,
    134,
    170,
    288,
    160

  )
  context.drawImage(
    spriteSheet,
    800,
    511,
    175,
    55,
    134,
    270,
    175,
    55

  )
}


}



let misses = 0;
let one_h = true;
let two_h = true;
let three_h = true;
function hitted(){
  misses++;
  if (misses == 2 ){
    switch (heart){
      case 3:
      three_h = false;

      break;

      case 2:
      two_h = false;
      break;

      case 1:
      one_h = false;
      state = "game_over";
      audio_over.play();
      break;

    }
    heart = heart - 1;
    misses = 0;
  }
  combo = 1;
}

function heal(){
  if(!two_h){
    two_h = true;
    heart++;
  }
  else if (!three_h){
    three_h =true;
    heart++;
  }
}
function pv() {
  if (one_h) {
    context.drawImage(
      spriteSheet,
      837,
      602,
      17,
      17,
      150,
      190,
      17,
      17

    )
  }
  if (two_h) {
    context.drawImage(
      spriteSheet,
      837,
      602,
      17,
      17,
      150,
      210,
      17,
      17

    )
  }
  if (three_h) {
    context.drawImage(
      spriteSheet,
      837,
      602,
      17,
      17,
      150,
      230,
      17,
      17

    )
  }
}

myMusic.onended = function() {
    loop=false;
    state = "win";
    background();
      audio_victory.play();
    document.getElementById("hint").innerText = "You win with "+puntos+"pts!";
    document.cookie = "highscore="+puntos+"; expires=Wed, 05 Aug 2022 23:00:00 UTC;";
}
function frame() {
    if (loop) {
  context.clearRect(0, 0, width, height);
  conduct.setSongposition(myMusic.currentTime);
  background();
  pv();
  animate();
  throw_bucket();

  bucket();


    requestAnimationFrame(frame)
  }
}
frame();
document.addEventListener('keydown', function(event) {

  if (event.key === 'd' && state != "game_over" && loop && !myMusic.paused) {
    state = "punch";
    console.log(new_beat - conduct.songposition);
    if (-0.05 < (new_beat - conduct.songposition) && (new_beat - conduct.songposition) < 0.05) {
      misses = 0;
      puntos += 10 * combo;
      document.getElementById("hint").innerText = "Perfect";
      combo++;
    } else if (-0.15 < new_beat - conduct.songposition && new_beat - conduct.songposition < 0.15) {
      misses = 0;
      puntos += 5 * combo;
      document.getElementById("hint").innerText = "Good";
      combo++;
    } else {
      document.getElementById("hint").innerText = "Miss";
      missed = true;
      if ( !gone) {
      hitted();
    }
    else{
      gone = false;
    }
    }

    document.getElementById("Scoring").innerText = puntos;
    document.getElementById("Combing").innerText =  combo;
  }
  if (event.key === 'b' &&state != "game_over") {
    if (myMusic.paused){
      myMusic.play();
    }
    else{
    myMusic.pause();
  }
  }
  if (event.key === 'b' && ( state == "game_over" || state == "win" )) {
    myMusic.currentTime = 0;
    loop = true;
    three_h = true;
    two_h = true;
    one_h = true;
    heart = 3;
    misses = 0;
    combo = 1;
    puntos = 0;
    lastbeat_combo = 0
    lastbeat = 0;
    beat = 0;
    index = 0;
    rise = false;
    rise_text = false;
    frame();
    state ="normal";
    myMusic.play();
  }
});
