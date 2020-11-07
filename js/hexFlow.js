var hexWidth = 300 + 10;

window.onload = function(e) {
	reOrderHex();
	document.getElementById("text-showcase").innerHTML = document.getElementById("text").innerHTML;
}

function reOrderHex() {
	var width = document.body.clientWidth;
	var hexPerLine = Math.round(width/hexWidth)-1;
	var hexs = document.getElementsByClassName("hexagon");
	
	for (var hex in hexs) {
		if (hex%(hexPerLine*2) == 0) {
			
			hexs[hex].classList.add("hexSub");
		}
	}
}