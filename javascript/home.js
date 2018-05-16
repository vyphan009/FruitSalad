//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.

var leftImg = new Image();
leftImg.src = '../images/left.png';
var rightImg = new Image();
rightImg.src = '../images/right.png'; 

function canvasApp() {
	
	var theCanvas = document.getElementById("gameCanvas");
	var context = theCanvas.getContext("2d");
	
	init();
	var dish = [];
	var dragIndex;
	var dragging;
	var mouseX;
	var mouseY;
	var dragHoldX;
	var dragHoldY;
	var timer;
	var targetX;
	var targetY;
    var easeAmount;
	var cart = [];
	var currentPage = 0;

    var BUTTON_EAT = 1;
    var BUTTON_CART_LEFT = 2;
    var BUTTON_CART_RIGHT = 3;
	
    var btnEat
	function init() {
		
        easeAmount = 0.45;
        
        makeShapes();
        
        btnEat = new Button(300, 200, 100, 40, "Eat", BUTTON_GO_HOME, null);
        
        var CART_ARROW_BTN_WIDTH = 38;
        var CART_ARROW_BTN_HEIGHT = 108;
        var CART_ARROW_DIFF_X = 3;
        var CART_ARROW_Y = 430;

        btnCartLeft = new Button(CART_ARROW_DIFF_X, CART_ARROW_Y - CART_ARROW_BTN_HEIGHT / 2,
            CART_ARROW_BTN_WIDTH, CART_ARROW_BTN_HEIGHT, null, BUTTON_CART_LEFT, leftImg);
        btnCartRight = new Button(theCanvas.width - CART_ARROW_DIFF_X - CART_ARROW_BTN_WIDTH, CART_ARROW_Y - CART_ARROW_BTN_HEIGHT / 2,
            CART_ARROW_BTN_WIDTH, CART_ARROW_BTN_HEIGHT, null, BUTTON_CART_RIGHT, rightImg);

        // draw
		drawScreen();
		
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
    }

	
	function makeShapes() {

        var i;
		var startX = 30;
		var startY = 30;
        var width = 80;
        var height = 80;
        var diffX = 150;
        var diffY = 150;
        var rowItemCount = 3;
        
        for (i = 0; i < cart.length; i++) {
            var tempX = startX + diffX * (i % rowItemCount);
            var tempY = startY + diffY * Math.floor(i / rowItemCount);
			
            tempShape = new StoreItem(tempX, tempY, width, height);
			
			cart.push(tempShape);
		}
	}
	
	function mouseDownListener(evt) {
		var i;
		
		//getting mouse position correctly 
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);
				
		/*
		Below, we find if a shape was clicked. Since a "hit" on a square or a circle has to be measured differently, the
		hit test is done using the hitTest() function associated to the type of particle. This function is an instance method
		for both the SimpleDiskParticle and SimpleSqureParticle classes we have defined with the external JavaScript sources.		
		*/
		for (i=0; i < cart.length; i++) {
			if (cart[i].hitTest(mouseX, mouseY)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
				dragIndex = i;
			}
		}
		
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
			//place currently dragged shape on top
			cart.push(cart.splice(dragIndex,1)[0]);
			
			//shapeto drag is now last one in array
			dragHoldX = mouseX - shapes[numShapes-1].x;
			dragHoldY = mouseY - shapes[numShapes-1].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			
			//start timer
			timer = setInterval(onTimerTick, 1000/30);
        }
        else  if (btnEat.mouseDownListener(mouseX, mouseY)) {
            Eat();
        }
        else if (btnCartLeft.mouseDownListener(mouseX, mouseY)) {
            CartLeft();
        }
        else if (btnCartRight.mouseDownListener(mouseX, mouseY)) {
            CartRight();
        }
		theCanvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}
	
	function onTimerTick() {
		//because of reordering, the dragging shape is the last one in the array.
		cart[cart.length-1].x = cart.length[cart.length-1].x + easeAmount*(targetX - cart[cart.length-1].x);
		cart[cart.length-1].y = cart[cart.length-1].y + easeAmount*(targetY - cart[cart.length-1].y);
		
		//stop the timer when the target position is reached (close enough)
		if ((!dragging)&&(Math.abs(cart[cart.length-1].x - targetX) < 0.1) && (Math.abs(cart[cart.length-1].y - targetY) < 0.1)) {
			cart[cart.length-1].x = targetX;
			cart[cart.length-1].y = targetY;
			//stop timer:
			clearInterval(timer);
		}
		drawScreen();
	}
	
	function mouseUpListener(evt) {
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
			getShapes();
            getFood();
			targetX = cart[cart.length - 1].origX;
			targetY = cart[cart.length - 1].origY;
		}
	}

	function mouseMoveListener(evt) {
		var posX;
		var posY;
		var shapeRad = cart[cart.length-1].radius;
		var minX = shapeRad;
		var maxX = theCanvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = theCanvas.height - shapeRad;
		
		//getting mouse position correctly 
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		targetX = posX;
		targetY = posY;
	}
		
	function drawShapes() {
		var i;
		for (i=0; i < cart.length; i++) {
			//the drawing of the shape is handled by a function inside the external class.
			//we must pass as an argument the context to which we are drawing the shape.
			cart[i].drawToContext(context);
		}
	}

    function drawCart() {
		var i;
        var cartMaxItem = 4;
		var startIndex = currentPage * cartMaxItem;
		var max = Math.min(cartMaxItem, cart.length - startIndex);
		for (i = 0; i < max; ++i){
			cart[startIndex + i].setX(i * 80 + 40);
			cart[startIndex + i].drawToContext(context);
		}
	}
	
    function drawDish(){
        var i;
        var dishMaxItem = 4;
        var max = Math.min(dishMaxItem, dish.length - dishMaxItem);
        for (i = 0; i < max; i++){
            dish[dishMaxItem + i].setX(i * 80 + 40);
            dish[dishMaxItem + i].drawToContext(context);
            
        }
    }
    
	function drawScreen() {
		//bg
        drawShapes();
        
        btnEat.drawToContext(context);
        btnCartLeft.drawToContext(context);
        btnCartRight.drawToContext(context);

        if (cart != null) {
            drawCart();
        }
        if(dish != null){
            drawDish();
        }

    }
    
    function getShapes() {
        var i;
        if(mouseX >= 0 && mouseY >= 370 && mouseY < theCanvas.height){
            var temp = new StoreItem(cart.length * 80, 370, 80, 80);
            // need to copy values
            temp.hunger = shapes[shapes.length -1].hunger;
            temp.grain = shapes[shapes.length -1].grain;
            temp.vegetable = shapes[shapes.length -1].vegetable;
            temp.meat = shapes[shapes.length -1].meat;
            temp.refreshProgressBar();
            cart.push(temp);
        }
    }
        
    function getFood(){
        var i;
        if(mouseX >= 0 && mouseY <= 350){
            var temp = new StoreItem(dish.length * 80, 200, 80, 80);
            
            temp.hunger = cart[cart.length -1].hunger;
            temp.grain = cart[cart.length -1].grain;
            temp.vegetable = cart[cart.length -1].vegetable;
            temp.meat = cart[cart.length -1].meat;
            temp.refreshProgressBar();
            dish.push(temp);
        }
    }
    
    function CartLeft() {
		if(currentPage > 0){
			currentPage--;
		}
		drawScreen();

    }

    function CartRight() {
		if(currentPage != (cart.length / 4)){
			currentPage++;
		}
		drawScreen();
    }
    
    function Eat(){
        var i;
        for(i = 0; i < dish.length; i++){
            dish[i].style.display = "none";
        }
        drawScreen();
        
    }
}