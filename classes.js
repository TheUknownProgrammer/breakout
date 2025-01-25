class Button {
  constructor(
    width,
    height,
    x,
    y,
    btnColor,
    text = "Button",
    textColor,
    canvas,
    func,
    mouseObj
  ) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.clicked = false;
    this.btnColor = btnColor;
    this.btnColorDisplay = btnColor;
    this.text = text;
    this.textColor = textColor;
    this.textColorDisplay = textColor;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.func = func;
    this.mouseObj = mouseObj;
  }
  display() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.btnColorDisplay;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = this.textColorDisplay;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "start";

    this.ctx.fillText(
      this.text,
      this.x + (this.width - this.ctx.measureText(this.text).width) / 2,
      this.y + this.height / 2
    );
    this.checkClick(this.mouseObj);
    this.hover(this.mouseObj);
  }
  checkClick(cursor) {
    if (cursor.clicked && collisionDetection(this, cursor)) {
      this.func();
    }
  }

  hover(cursor) {
    if (collisionDetection(this, cursor)) {
      this.textColorDisplay = "black";
      this.btnColorDisplay = "white";
      this.canvas.title = this.text;

    } else {
      this.textColorDisplay = this.textColor;
      this.btnColorDisplay = this.btnColor;
      this.canvas.removeAttribute("title");

    }
  }
}

class Brick {
  constructor(x, y, width, height, breakSound) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.broked = false;
    this.color = `rgb(0,${Math.floor(Math.random() * 129) + 127},${Math.floor(Math.random() * 129) + 127})`;
    this.breakSound = breakSound;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class TravelText {
  constructor(font, fontSize, text = "Hello World!", x, y, toX, toY, color = "white", canvas) {
    this.text = text;
    this.font = font;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.toX = toX;
    this.toY = toY;
    this.color = color;
    this.ctx = canvas.getContext("2d");
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.font = this.fontSize + "px" + " " + this.font;
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.text, this.x, this.y);

  }
  update() {
    if (this.toX != undefined) {
      if (Math.abs(this.toX - this.x) > 0) {

      } else {

      }
    }
    if (this.toY != undefined) {

    }
  }
} 