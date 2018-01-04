var my_canvas = document.getElementById("canvas");
var ctx = my_canvas.getContext("2d");

var krivulje = [];
var koordinate = [];
var bgcolor = "#ffffff";
var button = 1;					//spremenljivka, ki pove, ali je uporabnik kliknil na gumb DRAW(1), EDIT(2), DELETE(3), CHANGE COLOR(4), CLEAR CANVAS(5), ali CHANGE BACKGROUND COLOR(6)
var press = false;				//spremenljivka, ki sodeluje pri click & drag v EDITu
var mouseDown = false;			//spremenljivka, ki pove, če je uporabnik že kliknil, a še ni spustil levega klika

ctx.beginPath();
drawButtons();


canvas.onmousedown = function(e){
	var x = e.clientX-8;
	var y = e.clientY-30;
	
	mouseDown = true;
}

canvas.onmouseup = function(e){
	var x = e.clientX-8;
	var y = e.clientY-30;
	
	press = false;
	
	if (mouseDown == true){				//to se izvede, ko uporabnik naredi poln klik na platno
		
		mouseDown = false;	
		
		//ko uporabnik klikne na gumb "DRAW"
		if ( (x >= 1140	&& x <= 1400) && (y >= 80 && y <= 160) ){
			button = 1;
			koordinate = [];
			return;
		}
		//ko uporabnik klikne na gumb "EDIT"
		else if ( (x >= 1140 && x <= 1400) && (y >= 180 && y <= 260) ){
			button = 2;
			koordinate = [];
			return;
		}
		//ko uporabnik klikne na gumb "DELETE"
		else if ( (x >= 1140 && x <= 1400) && (y >= 280 && y <= 360) ){
			button = 3;
			koordinate = [];
			return;
		}
		//ko uporabnik klikne na gumb "CHANGE COLOR" - line
		else if ( (x >= 1140 && x <= 1400) && (y >= 380 && y <= 460) ){
			button = 4;
			koordinate = [];
			return;
		}
		//ko uporabnik klikne na gumb "CLEAR"
		else if ( (x >= 1140 && x <= 1400) && (y >= 530 && y <= 610) ){
			button = 5;
			koordinate = [];
		}
		//ko uporabnik klikne na gumb "CHANGE COLOR" - canvas
		else if ( (x >= 1140 && x <= 1400) && (y >= 630 && y <= 710) ){
			button = 6;
			koordinate = [];
		}
		//ko uporabnik klikne na "i" znak
		else if ( (x >= 1445 && x <= 1485) && (y >= 17 && y <= 57) ){
			var infoWindow = window.open("info.html", "MsgWindow", "width=434, height=570, top=100, left=600");
			return;
		}
		
		if (button == 1){	// DRAW
					
			koordinate.push([x, y]);
			if (koordinate.length == 1 || koordinate.length == 4){
				for (var j = 0; j < krivulje.length; j++){
					if ( (x >= krivulje[j].t1[0]-4 && x <= krivulje[j].t1[0]+4) && (y >= krivulje[j].t1[1]-4 && y <= krivulje[j].t1[1]+4) ){
						x = krivulje[j].t1[0];
						y = krivulje[j].t1[1];
						koordinate.pop();
						koordinate.push([x, y]);
					}
					else if ( (x >= krivulje[j].t4[0]-4 && x <= krivulje[j].t4[0]+4) && (y >= krivulje[j].t4[1]-4 && y <= krivulje[j].t4[1]+4) ){
						x = krivulje[j].t4[0];
						y = krivulje[j].t4[1];
						koordinate.pop();
						koordinate.push([x, y]);
					}
				}
				
				ctx.beginPath();
				ctx.fillRect(x, y, 5, 5);
			}
			else if (koordinate.length == 2 || koordinate.length == 3){
				ctx.beginPath();
				ctx.strokeStyle = "#000000";
				ctx.arc(x, y, 2, 0, 2*Math.PI);
				ctx.stroke(); 
			}
			
			if (koordinate.length == 4){
				
				var barva = document.getElementById('colorPicker').value;
				krivulje.push( new HomemadeBezier( koordinate[0], koordinate[1], koordinate[2], koordinate[3], "#" +barva ));
				var natancnost = 0.01;
				ctx. moveTo(koordinate[0][0], koordinate[0][1]);
				ctx.strokeStyle = "#" +barva;
					
				for (var i = 0; i < 1; i += natancnost){
					var tocka = calculateBezier( i, koordinate[0], koordinate[1], koordinate[2], koordinate[3] );
					ctx.lineTo(tocka[0], tocka[1]);
				}
				ctx.stroke();

				koordinate = [];
			}
		}
		
		else if (button == 2){ 		// EDIT
			press = false;
		}
		
		else if (button == 3){		// DELETE
					
			for (var j = 0; j < krivulje.length; j++){
				if ( (x >= krivulje[j].t2[0]-4 && x <= krivulje[j].t2[0]+4) && (y >= krivulje[j].t2[1]-4 && y <= krivulje[j].t2[1]+4)){
					for (var k = j; k < krivulje.length-1; k++){
						krivulje[k] = krivulje[k+1];
					}
					krivulje.splice(-1, 1);
					reDraw();
				}
				if ( (x >= krivulje[j].t3[0]-4 && x <= krivulje[j].t3[0]+4) && (y >= krivulje[j].t3[1]-4 && y <= krivulje[j].t3[1]+4)){
					for (var k = j; k < krivulje.length-1; k++){
						krivulje[k] = krivulje[k+1];
					}
					krivulje.splice(-1, 1);
					reDraw();
				}
			}
		}
		
		else if (button == 4){		// CHANGE LINE COLOR 
			for (var j = 0; j < krivulje.length; j++){
				if ( (x >= krivulje[j].t2[0]-4 && x <= krivulje[j].t2[0]+4) && (y >= krivulje[j].t2[1]-4 && y <= krivulje[j].t2[1]+4)){
					var barva = document.getElementById('colorPicker').value;
					krivulje[j].color = "#" +barva;
					reDraw();
				}
				if ( (x >= krivulje[j].t3[0]-4 && x <= krivulje[j].t3[0]+4) && (y >= krivulje[j].t3[1]-4 && y <= krivulje[j].t3[1]+4)){
					var barva = document.getElementById('colorPicker').value;
					krivulje[j].color = "#" +barva;
					reDraw();
				}
			}
		}
		
		else if (button == 5){		// CLEAR
			ctx.fillStyle = "#ffffff";
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			drawButtons();
			krivulje = [];
		}
		
		else if (button == 6){		// CHANGE CANVAS COLOR
			var barva = document.getElementById('colorPicker').value;
			bgcolor = "#" +barva;
			reDraw();
		}
	}
	
}

canvas.onmousemove = function(e){
	
	if (mouseDown == false){
		press = false;
		return;
	}
	
	if (button == 2){
		var x = e.clientX-8;
		var y = e.clientY-30;
		
		for (var j = 0; j < krivulje.length; j++){
			
			if ( (x >= krivulje[j].t1[0]-4 && x <= krivulje[j].t1[0]+4) && (y >= krivulje[j].t1[1]-4 && y <= krivulje[j].t1[1]+4)){
				press = true;
				krivulje[j].t1 = [x, y];
			}			
			else if ( (x >= krivulje[j].t2[0]-4 && x <= krivulje[j].t2[0]+4) && (y >= krivulje[j].t2[1]-4 && y <= krivulje[j].t2[1]+4) ){
				press = true;
				krivulje[j].t2 = [x, y];
			}
			else if ( (x >= krivulje[j].t3[0]-4 && x <= krivulje[j].t3[0]+4) && (y >= krivulje[j].t3[1]-4 && y <= krivulje[j].t3[1]+4) ){
				press = true;
				krivulje[j].t3 = [x, y];
			}
			else if ( (x >= krivulje[j].t4[0]-4 && x <= krivulje[j].t4[0]+4) && (y >= krivulje[j].t4[1]-4 && y <= krivulje[j].t4[1]+4) ){
				press = true;
				krivulje[j].t4 = [x, y];
			}
			
			if (press == true){
				reDraw();
				press = false;
			}
		}
	}
}	

function drawButtons(){
	
	ctx.beginPath();
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#000000";
	ctx.font = "50px Courier new";
	ctx.fillText("Bezier curve tool", 410, 55);
	
	ctx.fillRect(1445, 17, 40, 40);
	ctx.fillStyle = "#FFE53B";
	ctx.fillRect(1448, 20, 34.5, 34.5);
	ctx.fillStyle = "#000000";
	ctx.font = "33px Palatino";
	ctx.fillText("i", 1460, 49);

	ctx.font = "25px Arial";
	ctx.fillText("LINE TOOLS", 1198, 65);
	ctx.fillRect(1140, 80, 260, 80);
	ctx.fillRect(1140, 180, 260, 80);
	ctx.fillRect(1140, 280, 260, 80);
	ctx.fillRect(1140, 380, 260, 80);
	ctx.fillRect(1140, 530, 260, 80);
	ctx.fillRect(1140, 630, 260, 80);

	ctx.fillStyle = "#0066FC";
	ctx.fillRect(1145, 85, 250, 70);
	ctx.fillRect(1145, 185, 250, 70);
	ctx.fillRect(1145, 285, 250, 70);
	ctx.fillRect(1145, 385, 250, 70);
	ctx.fillRect(1145, 535, 250, 70);
	ctx.fillRect(1145, 635, 250, 70);

	ctx.font = "40px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("DRAW", 1210, 135);
	ctx.fillText("EDIT", 1225, 234);
	ctx.fillText("DELETE", 1195, 335);
	ctx.font = "28px Arial";
	ctx.fillText("CHANGE COLOR", 1156, 432);
	ctx.font = "25px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("CANVAS TOOLS", 1176, 515);
	ctx.font = "40px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("CLEAR", 1200, 585);
	ctx.font = "28px Arial";
	ctx.fillText("CHANGE COLOR", 1156, 682);
	ctx.fillStyle = "#000000";
	
}

//funkcija za očiščenje canvasa in ponoven izris vseh krivulj na novih točkah
function reDraw(){
	
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//krivulje
	ctx.fillStyle = "#000000";	
	var natancnost = 0.01;
			
	for (var k = 0; k < krivulje.length; k++){
		ctx.beginPath();
		ctx.moveTo(krivulje[k].t1[0], krivulje[k].t1[1]);
		ctx.strokeStyle = krivulje[k].color;
		
		for (var i = 0; i < 1; i += natancnost){
			var tocka = calculateBezier( i, krivulje[k].t1, krivulje[k].t2, krivulje[k].t3, krivulje[k].t4 );
			ctx.lineTo(tocka[0], tocka[1]);
		}
		
		//točke krivulj
		ctx.stroke();
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#000000";
		ctx.fillRect(krivulje[k].t1[0], krivulje[k].t1[1], 5, 5);
		ctx.moveTo(krivulje[k].t2[0], krivulje[k].t2[1]);
		ctx.beginPath();
		ctx.arc(krivulje[k].t2[0], krivulje[k].t2[1], 2, 0, 2*Math.PI);
		ctx.moveTo(krivulje[k].t3[0], krivulje[k].t3[1]);
		ctx.arc(krivulje[k].t3[0], krivulje[k].t3[1], 2, 0, 2*Math.PI);
		ctx.fillRect(krivulje[k].t4[0], krivulje[k].t4[1], 5, 5);
		ctx.stroke();
	}
	
	ctx.fillStyle = "#000000";
	ctx.font = "50px Courier new";
	ctx.fillText("Bezier curve tool", 410, 55);
	
	ctx.fillRect(1445, 17, 40, 40);
	ctx.fillStyle = "#FFE53B";
	ctx.fillRect(1448, 20, 34.5, 34.5);
	ctx.fillStyle = "#000000";
	ctx.font = "33px Palatino";
	ctx.fillText("i", 1460, 49);

	ctx.font = "25px Arial";
	ctx.fillText("LINE TOOLS", 1198, 65);
	ctx.fillRect(1140, 80, 260, 80);
	ctx.fillRect(1140, 180, 260, 80);
	ctx.fillRect(1140, 280, 260, 80);
	ctx.fillRect(1140, 380, 260, 80);
	ctx.fillRect(1140, 530, 260, 80);
	ctx.fillRect(1140, 630, 260, 80);

	ctx.fillStyle = "#0066FC";
	ctx.fillRect(1145, 85, 250, 70);
	ctx.fillRect(1145, 185, 250, 70);
	ctx.fillRect(1145, 285, 250, 70);
	ctx.fillRect(1145, 385, 250, 70);
	ctx.fillRect(1145, 535, 250, 70);
	ctx.fillRect(1145, 635, 250, 70);

	ctx.font = "40px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("DRAW", 1210, 135);
	ctx.fillText("EDIT", 1225, 234);
	ctx.fillText("DELETE", 1195, 335);
	ctx.font = "28px Arial";
	ctx.fillText("CHANGE COLOR", 1156, 432);
	ctx.font = "25px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("CANVAS TOOLS", 1176, 515);
	ctx.font = "40px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("CLEAR", 1200, 585);
	ctx.font = "28px Arial";
	ctx.fillText("CHANGE COLOR", 1156, 682);
	ctx.fillStyle = "#000000";
	
}

function calculateBezier(nat, t1, t2, t3, t4) {
	var cx = 3 * (t2[0] - t1[0]);
	var bx = 3 * (t3[0] - t2[0]) - cx;
	var ax = t4[0] - t1[0] - cx - bx;

	var cy = 3 * (t2[1] - t1[1]);
	var by = 3 * (t3[1] - t2[1]) - cy;
	var ay = t4[1] - t1[1] - cy - by;

	var x = (ax * Math.pow(nat, 3)) + (bx * Math.pow(nat, 2)) + (cx * nat) + t1[0];
	var y = (ay * Math.pow(nat, 3)) + (by * Math.pow(nat, 2)) + (cy * nat) + t1[1];

	return [x, y];
	
}

class HomemadeBezier {
	
	constructor(t1, t2, t3, t4, color){
		this.t1 = t1;
		this.t2 = t2;
		this.t3 = t3;
		this.t4 = t4;
		this.color = color;
	}
		
}