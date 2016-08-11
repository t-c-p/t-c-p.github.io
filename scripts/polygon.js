;(function($){
  // p5 functions
  // ----------------------------------------
  // math
  function abs(_v){ return Math.abs(_v); }
  function min(_v1, _v2){ return Math.min(_v1, _v2); }
  function max(_v1, _v2){ return Math.max(_v1, _v2); }
  function floor(_v){ return Math.floor(_v); }
  function round(_v){ return Math.round(_v); }
  function pow(_b, _e){ return Math.pow(_b, _e); }
  function random(_max){ return Math.random() * (_max || 1); }

  function sin(_v){ return Math.sin(_v); }
  function cos(_v){ return Math.cos(_v); }
  function atan2(_y, _x){ return Math.atan2(_y, _x); }
  function sqrt(_v){ return Math.sqrt(_v); }

  // time
  function millis(){ return new Date().getTime(); }

  // clear
  function clear(){ ctx.clearRect(0, 0, w+1, h+1); }

  // fill
  function fill(_r, _g, _b, _a){
    bFill = true;
    ctx.fillStyle = "rgba(" + _r + "," + _g + "," + _b + "," + (_a || 255 / 255) + ")";
  }
  function noFill(){ bFill = false; }

  // stroke
  function stroke(_r, _g, _b, _a){
    bStroke = true;
    ctx.strokeStyle = "rgba(" + _r + "," + _g + "," + _b + "," + (_a || 255 / 255) + ")";
  }
  function noStroke(){ bStroke = false; }
  function strokeWeight(_w){ ctx.lineWidth = _w; }

  // drawing
  function rect(_x, _y, _w, _h){
    if(bFill && bStroke){
      ctx.fillRect(_x, _y, _w, _h);
      ctx.strokeRect(_x, _y, _w, _h);
    }
    else if(bFill) ctx.fillRect(_x, _y, _w, _h);
    else if(bStroke) ctx.strokeRect(_x, _y, _w, _h);
  }

  // coordinate
  function push(){ ctx.save(); }
  function pop(){ ctx.restore(); }

  function translate(_x, _y){ ctx.translate(_x, _y); }
  function rotate(_rad){ ctx.rotate(_rad); }

  // shape
  function beginShape(){
    ctx.beginPath();
    bFirstVertex = true;
  }

  function endShape(){
    ctx.closePath();

    if(bFill)   ctx.fill();
    if(bStroke) ctx.stroke();
  }

  function vertex(_x, _y){
    if(bFirstVertex){
      bFirstVertex = false;
      ctx.moveTo(_x, _y);
    }
    else{
      ctx.lineTo(_x, _y);
    }
  }

  function arcVerex(_x1, _y1, _x2, _y2, _r){
    if(bFirstVertex){
      bFirstVertex = false;
      var v = new Vector(_x2 - _x1, _y2 - _y1);
      v.div(2);
      ctx.moveTo(_x1 + v.x, _y1 + v.y);
    }
    else{
      ctx.arcTo(_x1, _y1, _x2, _y2, _r);
    }
  }

  function quadraticVertex(_cx, _cy, _x, _y){
    if(bFirstVertex){
      bFirstVertex = false;
      ctx.moveTo(_x, _y);
    }
    else{
      ctx.quadraticCurveTo(_cx, _cy, _x, _y);
    }
  }

  function equilateralPlygon(_x, _y, _r, _n){
    push();
      translate(_x, _y);
      var a = TWO_PI / _n;
      beginShape();
        for(var i = 0; i <= _n; ++i){
          var x = cos(i * a) * _r;
          var y = sin(i * a) * _r;
          vertex(x, y);
        }
      endShape();
    pop();
  }

  function equilateralPlygon2(_x, _y, _r, _n){
    push();
      translate(_x, _y);
      var a = TWO_PI / _n;
      beginShape();
        for(var i = 0; i <= _n; ++i){
          var p0 = new Vector(cos(i * a) * _r, sin(i * a) * _r);
          var p1 = new Vector(cos((i + 1) * a) * _r, sin((i + 1) * a) * _r);
          arcVerex(p0.x, p0.y, p1.x, p1.y, _r  * (sin(millis() / 1000) + 1.0) / 2 * 0.5);
        }
      endShape();
    pop();
  }


  // Colot
  // ----------------------------------------
  var Color = function(_r, _g, _b, _a){
    this.r = _r;
    this.g = _g;
    this.b = _b;
    this.a = _a || 255;
  };

  // Vector
  // ----------------------------------------
  var  Vector = function(_x, _y){
    this.x = _x || 1;
    this.y = _y || 1;
    this.length = sqrt((this.x * this.x) + (this.y * this.y));
  };
  Vector.prototype.add = function(_v){
    this.x += _v.x;
    this.y += _v.y;
    return this;
  };
  Vector.prototype.sub = function(_v){
    this.x -= _v.x;
    this.y -= _v.y;
    return this;
  };
  Vector.prototype.mult = function(_val){
    this.x *= _val;
    this.y *= _val;
    return this;
  };
  Vector.prototype.div = function(_val){
    this.x /= _val;
    this.y /= _val;
    return this;
  };
  Vector.prototype.normalize = function(){
    this.x /= this.length;
    this.y /= this.length;
    this.length = sqrt((this.x * this.x) + (this.y * this.y));
    return this;
  };
  Vector.prototype.rotate = function(_rad){
    var radians = atan2(this.y, this.x);
    radians += _rad;
    this.x = cos(radians) * this.length;
    this.y = sin(radians) * this.length;
    return this;
  };

  // Polygon
  // ----------------------------------------
  var Polygon = function(_n){
    this.dead = false;

    this.pos = new Vector(0, 0);
    this.rad = random(TWO_PI);
    this.vel = new Vector(cos(this.rad), sin(this.rad));
    this.radius = 10;
    this.rot = random(TWO_PI);
    this.rotInc = random(HALF_PI / 200) - (HALF_PI / 400);
    this.num = _n;
    this.a = TWO_PI / _n;
    this.curveStep = random(1000);
    this.curveStepInc = random(10) + 1;

    this.bFill = true;
    this.color = new Color(255, 255, 255);
  };
  Polygon.prototype.setPosition = function(_x, _y){
    this.pos = new Vector(_x, _y);
    return this;
  };
  Polygon.prototype.setVelocity = function(_x, _y){
    this.vel = new Vector(_x, _y)
    return this;
  };
  Polygon.prototype.setRadius = function(_r){
    this.radius = _r;
    return this;
  };
  Polygon.prototype.setNumAngles = function(_n){
    this.num = _n;
    this.a   = TWO_PI / this.num;
    return this;
  };
  Polygon.prototype.setFill = function(_b){
    this.bFill = _b;
    return this;
  };
  Polygon.prototype.setColor = function(_r, _g, _b, _a){
    this.color.r = _r;
    this.color.g = _g;
    this.color.b = _b;
    this.color.a = _a || 255;
    return this;
  };
  Polygon.prototype.update = function(){
    this.pos.add(this.vel);
    this.rot += this.rotInc;
    this.curveStep += this.curveStepInc;

    if((this.pos.y > $doc.height() + this.radius) || (this.pos.x < -this.radius) || (this.pos.x > w + this.radius)){
      this.dead = true;
    }
  };
  Polygon.prototype.draw = function(){
    if(this.bFill){
      fill(this.color.r, this.color.g, this.color.b, this.color.a);
      noStroke();
    }
    else{
      stroke(this.color.r, this.color.g, this.color.b, this.color.a);
      noFill();
    }
    // vertex
    // push();
    //   translate(this.pos.x, this.pos.y);
    //   rotate(this.rot);
    //   beginShape();
    //     for(var i = 0; i < this.num; ++i){
    //       vertex(cos(i * this.a) * this.radius, sin(i * this.a) * this.radius);
    //     }
    //   endShape();
    // pop();

    // arc vertex
    push();
      translate(this.pos.x, this.pos.y);
      rotate(this.rot);
      beginShape();
      ctx.shadowBlur = 50;
      ctx.shadowColor = "rgba(0,0,0, 0.4)";
        for(var i = 0; i <= this.num; ++i){
          var p0 = new Vector(cos(i * this.a) * this.radius, sin(i * this.a) * this.radius);
          var p1 = new Vector(cos((i + 1) * this.a) * this.radius, sin((i + 1) * this.a) * this.radius);
          arcVerex(p0.x, p0.y, p1.x, p1.y, (sin(this.curveStep / 1000) + 1.0) / 2 * (sin((PI * (this.num - 2) / this.num) / 2) * this.radius));
        }
      endShape();
    pop();
  };


  var PI = Math.PI,
      TWO_PI = Math.PI * 2,
      HALF_PI = Math.PI / 2,
      QUARTER_PI = Math.PI / 4;

  var $window = $(window),
      $doc = $(document);
  var scrollTop, scroll;

  var w, h;
  var canvas, ctx;

  var polygons,
      gravity;

  var lastMillis = 0,
      interval   = 3500;

  var bFill   = true,
      bStroke = true,
      bFirstVertex = true;

  var PALLETE = [new Color(241, 222, 57), 
                 new Color(83, 167, 204),
                 new Color(196, 72, 144),
                 new Color(233, 79, 7),
                 new Color(123, 187, 41),
                 new Color(137, 137, 137)];

  // main
  // ----------------------------------------
  $doc.ready(function(){

    init();

    // // scroll event
    // $doc.scroll(function(){
    //   scrollTop = $(this).scrollTop();
    // });

    // resize event
    $window.resize(function(){
      resize();
    });
  });

  // init
  // ----------------------------------------
  function init(){
    canvas = document.getElementById('polygon');
    ctx    = canvas.getContext('2d');

    resize();

    var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.setTimeout;
      window.requestAnimationFrame = requestAnimationFrame;

    setup();
    draw();
  }

  // setup
  // ----------------------------------------
  function setup(){
    scrollTop = $doc.scrollTop();
    scroll    = 0;

    polygons = new Array();
    gravity  = (random(QUARTER_PI / 4) - (QUARTER_PI / 8)) + HALF_PI;

    for(var i = 0; i < 30; ++i){
      addRandomPolygon(random(w), random($doc.height()) - h / 2);
    }

    strokeWeight(8);
  }

  // update
  // ----------------------------------------
  function update(){
    if(millis() > lastMillis + interval){
      addRandomPolygon(random(w), random(-h) - (w * 0.2));
      lastMillis = millis();
    }

    for(var i = polygons.length - 1; i >= 0; --i){
      polygons[i].update();

      // remove polygon
      if(polygons[i].dead) polygons.splice(i, 1);
    }

    // update scroll
    // if(abs(scrollTop - scroll) > 1){
    //   scroll += (scrollTop - scroll) / 10;
    // }
  }

  // draw
  // ----------------------------------------
  function draw(){
    requestAnimationFrame(draw);

    update();

    // clear background
    clear();
    push();
      translate(0, -scrollTop);
      for(var i = 0; i < polygons.length; ++i){
        polygons[i].draw();
      }
    pop();
  }

  // resize
  // ----------------------------------------
  function resize(){
    w = $window.width();
    h = $window.height();

    setCanvasSize();
    clear();
  }

  // setCanvas
  // ----------------------------------------
  function setCanvasSize(){
    canvas.width  = w;
    canvas.height = h;
    strokeWeight(8);
  }

  // addRandomPolygon
  // ----------------------------------------
  function addRandomPolygon(_x, _y){
    var i = floor(random(10));
    var num = (i % 5 === 0) ? 64: floor(random(3)) + 3;
    var wh = min(w, h);
    var radius = (random(wh * 0.1) + (wh * 0.15)) + (floor(random(1)) * random(wh * 0.1));
    var strength = 0.1 + random(0.6) + (1.0 - (radius / (wh * 0.3)));
    var fill = i % 4 === 0;
    var c = PALLETE[i % PALLETE.length];

    polygons.push(new Polygon(num).setPosition(_x, _y)
                    .setVelocity(cos(gravity) * strength, sin(gravity) * strength)
                    .setRadius(radius)
                    .setFill(fill)
                    .setColor(c.r, c.g, c.b, 255));
  }
})(jQuery);