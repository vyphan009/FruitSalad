

function Button(posX, posY, width, height, message, value)
{
    // position
    this.x = posX;
    this.y = posY;

    // size
    this.width = width;
    this.height = height;

    // color
    this.bgcolor = "#00FFFF";
    this.textColor = "#FF0000";
    
    // data
    this.message = message;
    this.value = value;
}

Button.prototype.mouseDownListener = function (mouseX, mouseY)
{
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height)
    {
        return true;
    }

    return false;
}

// draw button
Button.prototype.drawToContext = function (theContext)
{
    theContext.fillStyle = this.bgcolor;
    theContext.fillRect(this.x, this.y, this.width, this.height);

    theContext.fillStyle = this.textColor;
    theContext.textAlign = "center";
    theContext.fillText(this.message, this.x + this.width / 2, this.y + this.height / 2);
}