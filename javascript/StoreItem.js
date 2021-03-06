// Simple class example
var fruit_apple = new Image();  
fruit_apple.src = '../images/Food/apple.png';
var diffX = 10;

function StoreItem(posX, posY, width, height, foodData) {
    // position
    this.x = posX;
    this.y = posY;
    this.origX = posX;
    this.origY = posY;

    // size
    this.width = width;
    this.height = height;

    // temp data. max is 100
    if (foodData != null) {
        this.foodData = Object.assign({}, foodData);
        this.hunger = foodData.Hunger;
        this.meat = foodData.Meat;
        this.grain = foodData.Grain;
        this.vegetable = foodData.Vegetable;
        this.name = foodData.Name;
    }
    else {
        this.hunger = 25;
        this.price = 20;
        this.expiration = Math.floor(Math.random() * 7);

        switch (Math.floor(Math.random() * 3)) {
            case 1:
                this.meat = 10;
                this.grain = 0;
                this.vegetable = 0;
                break;

            case 2:
                this.meat = 0;
                this.grain = 10;
                this.vegetable = 0;
                break;

            default:
                this.meat = 0;
                this.grain = 0;
                this.vegetable = 10;
                break;
        }
        this.name = null;
    }

    var progressWidth = this.width - 20;
    var progressHeight = 5;
    var diffY = 8;
    var progressX = diffX + this.x;
    var progressCurY = this.y + this.height;
    var max = 100;

    this.hungerProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.hunger, max);
    progressCurY += diffY;
    this.hungerProgressBar.vcolor = "#4169e1";
    this.meatProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.meat, max);
    progressCurY += diffY;
    this.meatProgressBar.vcolor = "#ED4337";
    this.grainProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.grain, max);
    progressCurY += diffY;
    this.grainProgressBar.vcolor = "#ffa500";
    this.vegetableProgressBar = new ProgressBar(progressX, progressCurY, progressWidth, progressHeight, this.vegetable, max);
    this.vegetableProgressBar.vcolor = "#50c878";
}

StoreItem.prototype.refreshProgressBar = function() {
    this.hungerProgressBar.current = this.hunger;
    this.meatProgressBar.current = this.meat;
    this.grainProgressBar.current = this.grain;
    this.vegetableProgressBar.current = this.vegetable;
}

StoreItem.prototype.setX = function(x) {
    var diff = x - this.x;
    this.x = x;
    this.origX = x;
    this.hungerProgressBar.x = this.x + diffX;
    this.meatProgressBar.x = this.x + diffX;
    this.grainProgressBar.x = this.x + diffX;
    this.vegetableProgressBar.x = this.x + diffX;
}

StoreItem.prototype.setY = function (y) {
    var diff = y - this.y;
    this.y = y;
    this.hungerProgressBar.y += diff;
    this.meatProgressBar.y += diff;
    this.grainProgressBar.y += diff;
    this.vegetableProgressBar.y += diff;
}

//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
StoreItem.prototype.hitTest = function (hitX, hitY) {
    return (hitX > this.x && hitX < this.x + this.width && hitY > this.y && hitY < this.y + this.height);
}

//A function for drawing the particle.
StoreItem.prototype.drawToContext = function (theContext) {

    this.hungerProgressBar.drawToContext(theContext);
    this.meatProgressBar.drawToContext(theContext);
    this.grainProgressBar.drawToContext(theContext);
    this.vegetableProgressBar.drawToContext(theContext);

    theContext.font = "12px Comfortaa";
    theContext.fillStyle = "#FFF";
    theContext.textAlign = "left";

    if (this.name == null) {
        theContext.drawImage(fruit_apple, this.x, this.y, this.width, this.height);
        theContext.fillText("Price: " + this.price, this.x + 0, this.y + 0);
        theContext.fillText("Expiration: " + this.expiration, this.x + 0, this.y + 15);
    }
    else {
        theContext.drawImage(foodImages.get(this.name), this.x, this.y, this.width, this.height);
        theContext.fillText("Price: " + this.foodData.Price, this.x + 0, this.y + 0);
        theContext.fillText("Expiration: " + this.foodData.Expiration, this.x + 0, this.y + 15);
    }
}