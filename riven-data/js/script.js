function loader() {
	if(document.getElementsByClassName("lds-css")[0].style.display == "block") {
		document.getElementsByClassName("lds-css")[0].style.display = "none";
		document.getElementsByTagName("body")[0].style.overflow = "auto";
	} else {
		window.location.href = "#";
		document.getElementsByClassName("lds-css")[0].style.display = "block";
		document.getElementsByTagName("body")[0].style.overflow = "hidden";
	}
}

function f_repartition(x, ecart_type, moyenne) {
	return math.eval(
		'(1/('+ecart_type*Math.sqrt(2*Math.PI)+'))^e^(0.5*(('+x+'-'+moyenne+')/'+ecart_type+')^2)'
	);
}

function calc(min, max, moyenne, ecart_type) {
	var x = [];
	var y = [];
	for(var i = min; i< max+1; i++) {
		x[i] = i; 
		y[i] = f_repartition(i,ecart_type, moyenne);
	}
	return {
		x,
		y,
		mode:'lines',
		type: 'scatter',
		name:'Price repartition'
	};
}

function drawGraph(min, max, moy, ecart, median, point) {
	var layout = {
		responsive: true,
		showlegend: false,
		font: {
			color: '#f2f5fa'
		},
		paper_bgcolor:'rgb(17,17,17)',
		plot_bgcolor:'rgb(17,17,17)',
		  yaxis:{
			showgrid:false,
			zeroline:false,
			showticklabels:false,
			hoverformat:'.2f'
		  },
		  xaxis:{
			showgrid:false,
			zeroline:false,
			showticklabels:false,
			hoverformat:'.2f'
			},
	};
	Plotly.newPlot('graph',
		[
			calc(min, max, moy, ecart),
			{
				x: [median],
				y: [f_repartition(median,ecart,moy)],
				mode: "markers",
				name: "Median",
				marker: {
					color: 'green',
					size: 6
				}
			},
			{
				x: [point],
				y: [f_repartition(point,ecart,moy)],
				mode: "markers",
				name: "Your price",
				marker: {
					color: 'orange',
					size: 10
				}
			}
		],
		{
			title: 'Last week price repartition :',
			font: {
				family: 'Roboto, sans-serif',
				size: 18
			},
			width:650,
			height:500
		},
		layout,
		{showSendToCloud: true}
	);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
	  c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
	  return c.substring(name.length, c.length);
	}
  }
  return "";
}

function load(data,i,_callback) {
	_callback();
	var price = document.getElementById('c-price').value;
	if(price < data.min) {
		document.getElementById('c-price').value = data.min;
		price = data.min;
	}
	document.getElementById('c-price').setAttribute('data',i);
	document.getElementById('pop-general').innerHTML = data.pop;
	document.getElementById('avg').innerHTML = data.avg;
	if(data.compatibility != null) {
		document.getElementById('weapon').innerHTML = "<span id='"+data.itemType.split(' ')[0]+"' class='icon'></span> "+data.compatibility;
	} else {
		document.getElementById('weapon').innerHTML = "<span id='"+data.itemType.split(' ')[0]+"' class='icon'></span> Veilled riven";
	}
	if(data.rerolled == true) {
		document.getElementById('reroll').innerHTML = "Rerolled";
	} else {
		document.getElementById('reroll').innerHTML = "Unrolled";
	}
	drawGraph(data.min,data.max,data.stddev,data.avg,data.median,price);
	setTimeout(function(){ _callback(); }, 100);
}

function searchTable(input) {
    var input, filter, found, table, tr, td, i, j;
    filter = input.value.toUpperCase();
    table = document.getElementById("data-list");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
		if (filter == "-POPULAR" && tr[i].classList.contains('popular')) {
			found = true;
		}
		if (filter == "-EXPENSIVE" && tr[i].classList.contains('expensive')) {
			found = true;
		}
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

function popular(n) {
	document.getElementById('pop-value').innerHTML = n;
	var popular = new Set();
	// pour tout les objets
	for(var j = 0; j < getCookie("data-length"); j++) {
		if (popular.size < n) {
			popular.add(j);
		} else {
			// r = objet actuel
			var r = JSON.parse(getCookie("data-"+j));
			// d = les objets populaires
			var d = Array.from(popular);
			// pour chaque objet de déjà populaire (d), comparer avec nouvel objet (r)
			for(var k = 0; k < d.length; k++) {
				// compare = objet de d à traiter ; d[k] = index objet
				var compare = JSON.parse(getCookie("data-"+d[k]));
				// si nouvel objet mieux que celui de d
				if(r.pop > compare.pop) {
					// ajouter l'index de l'objet à l'ensemble des populaires si il n'y est pas déjà
					if(!popular.has(j)) {
						popular.add(j);
						// si taille demandée dépassée, supprimer l'objet précédent (qui est moins bien que le nouveau du coup)
						if(popular.size > n) {
							popular.delete(d[k]);
						}
					}
				}
			};
		}
	}
	return popular;
}

function expensive(n) {
	document.getElementById('p-margin-value').innerHTML = n;
	var expensive = new Set();
	// pour tout les objets
	for(var j = 0; j < getCookie("data-length"); j++) {
		if (expensive.size < n) {
			expensive.add(j);
		} else {
			// r = objet actuel
			var r = JSON.parse(getCookie("data-"+j));
			// d = les objets cher
			var d = Array.from(expensive);
			// pour chaque objet de déjà cher (d), comparer avec nouvel objet (r)
			for(var k = 0; k < d.length; k++) {
				// compare = objet de d à traiter ; d[k] = index objet
				var compare = JSON.parse(getCookie("data-"+d[k]));
				// si nouvel objet mieux que celui de d
				if(r.median > compare.median) {
					// ajouter l'index de l'objet à l'ensemble des populaires si il n'y est pas déjà
					if(!expensive.has(j)) {
						expensive.add(j);
						// si taille demandée dépassée, supprimer l'objet précédent (qui est moins bien que le nouveau du coup)
						if(expensive.size > n) {
							expensive.delete(d[k]);
						}
					}
				}
			};
		}
	}
	return expensive;
}


window.addEventListener("load", function(data) {
	window.location.href = "#";
	loader();	
	var url = 'http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivensPC.json';
	var Ajax = {
		xhr : null,
		request : function (url, method, data, success, failure){
			if (!this.xhr){
				this.xhr = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP"): new XMLHttpRequest();
			}
			var self = this.xhr;

			self.onreadystatechange = function () {
				if (self.readyState === 4 && self.status === 200){
					// the request is complete, parse data and call callback
					var response = JSON.parse(self.responseText);
					success(response);
				}else if (self.readyState === 4) { // something went wrong but complete
					failure();
				}
			};
			this.xhr.open(method,url,true);
			this.xhr.send();
		}
	};
	Ajax.request(url,"GET",null,function(data){
		//set update event
		document.getElementById('update').addEventListener(
			"click",
			function() {
				loader();
				alert("Updating those paremeters can take some time...");
				var popu = Array.from(popular(document.getElementById('pop').value));
				var exp = Array.from(expensive(document.getElementById('p-margin').value));
				var i;
				for(i = 0; i < getCookie("data-length"); i++) {
					document.getElementById(i).classList.remove("popular");
					document.getElementById(i).classList.remove("expensive");
				}
				for(i = 0; i < popu.length; i++) {
					document.getElementById(popu[i]).classList.add("popular");
				}
				for(i = 0; i < exp.length; i++) {
					document.getElementById(exp[i]).classList.add("expensive");
				}
				loader();
			}
		);
		document.getElementById('pop').addEventListener(
			"input",
			function() {
				document.getElementById('pop-value').innerHTML = document.getElementById('pop').value;
			}
		);
		document.getElementById('p-margin').addEventListener(
			"input",
			function() {
				document.getElementById('p-margin-value').innerHTML = document.getElementById('p-margin').value;
			}
		);
		
		//load a riven to init
		load(data[0],0, function(){});
		document.cookie = "data-length="+data.length+";";
		//table list
		for(var j = 0; j < data.length; j++) {
			document.cookie = "data-"+j+"="+JSON.stringify(data[j])+";";
			var row = document.createElement('tr');
			for(var k = 1; k <= 5; k++) {
				var cell = document.createElement('td');
				switch(k) {
					case 1:
						if(data[j].compatibility != null) {
							// also remove <ARCHWING> tag
							var slices = data[j].compatibility.split("<ARCHWING> ");
							if(slices.length > 1) {
								cell.innerHTML = slices[1];
							} else {
								cell.innerHTML = slices[0];
							}
						} else {
							cell.innerHTML = "Veilled riven";
						}
						cell.classList.add('wp-name');
					break;
					case 2:
						cell.innerHTML = data[j].itemType;
					break;
					case 3:
						cell.innerHTML = data[j].rerolled;
					break;
					case 4:
						cell.innerHTML = data[j].median + ' <span id="pl" class="icon"></span>';
					break;
					case 5:
						cell.innerHTML = data[j].pop;
						cell.classList.add("percent");
					break;
				}
				row.appendChild(cell);
			}
			row.id = j;
			row.classList.add("item");
			row.addEventListener("click", function() {
				load(JSON.parse(getCookie("data-"+this.id)),this.id, function(){loader();});
			});
			document.getElementById('content-list').appendChild(row);
		}
		//update metrics
		var popu = Array.from(popular(document.getElementById('pop').value));
		var exp = Array.from(expensive(document.getElementById('p-margin').value));
		var i;
		for(i = 0; i < getCookie("data-length"); i++) {
			document.getElementById(i).classList.remove("popular");
			document.getElementById(i).classList.remove("expensive");
		}
		for(i = 0; i < popu.length; i++) {
			document.getElementById(popu[i]).classList.add("popular");
		}
		for(i = 0; i < exp.length; i++) {
			document.getElementById(exp[i]).classList.add("expensive");
		}
		loader();
		document.getElementById('search').addEventListener(
			"change",
			function() {
				var input = document.getElementById('search');
				searchTable(input);
				input.value = '';
			}
		);
	},function(){
		console.log("Failed to load warframe riven datas");
	});
});
