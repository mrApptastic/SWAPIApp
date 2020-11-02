
/*
To-do-list:
- When changing brush the pseudo-brush only changes when moving cursor: Find mouse move event and ad logic to change brush event. DONE. Now needs testing.
- Languages: Functions: Bum Bum: Something about changing methods to arrays of objects with translations on.
- Menu: Option to collapse more.
- Delete: Maybe delete top-object, which is being clicked on?
- Capture object: Click on object, remove it from canvas and 
- Add ids and functions to canvas code.
- Layers:
	- Test and fix splice issues 
	- Enable load json file as layers.
	- Move Objects on layer
	- Loads of other issues...
- HTML Export: Bug! Only the selected layer is exported...
- Save: Perhaps save work to local storage;	
- Steps Back-Buffer.
- New drawing functions: // Halvmåne, Pil, Kors, Figur (Kurve), Figur (Bézier)
*/

var captainCanvas = function(canvas, tools, settings) {
	var cpt = this;
	cpt.elem = document.getElementById(canvas);
	cpt.tools = document.getElementById(tools);
	cpt.context = cpt.elem.getContext("2d");
	cpt.index = 0;
	cpt.data = [[]];	
	cpt.settings = {
				"fit" : settings ? (settings.Fit !== null ? settings.Fit : true) : true,
				"tog" : settings ? (settings.Toggle !== null ? settings.Toggle : true) : false,
                "key" : settings ? (settings.Shortcuts !== null ? settings.Shortcuts : true) : true,
                "evt" : settings ? (settings.DefaultEvents !== null ? settings.DefaultEvents : true) : true,
				"cls" : settings ? (settings.Colours !== null ? settings.Colours : []) : [],
				"clw" : settings ? (settings.OverwriteColours !== null ? settings.OverwriteColours : false) : false,
				"lan" : window.navigator.language.indexOf("da") !== -1,
				"foc" : false
			  };
	cpt.methods = ["Firkant (Fyld)","Firkant (Streg)", "Firkant", "Cirkel", "Stjerne", "Trekant", "Trekant (Ret)", "Rhombe", "Trapezoid", "Ellipse", "Smiley", "Hjerte", "Linie", "Figur (Linie)"];
    cpt.colours = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed ", "Indigo ", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Transparent", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
	cpt.brush = {"Slc" : "Firkant", "Lvl" : 0, "Hgt" : 10, "Wth" : 10, "Fil" : "Black", "Str" : "Transparent", "LastX" : null, "LastY" : null, "Step" : 0, "Buff" : [], "CursX" : 0, "CursY" : 0 };
	cpt.drg = false;
	cpt.drw = function(mrX, mrY) {
        var z = [];
        var f = document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value;
		var x = mrX - (cpt.elem.getBoundingClientRect().left + window.scrollX);
		var y = mrY - (cpt.elem.getBoundingClientRect().top + window.scrollY);
		var w = parseInt(cpt.brush.Wth);
		var h = parseInt(cpt.brush.Hgt);
        var s =  0;
        var e =  2 * Math.PI;
        if (f === "Firkant (Fyld)") {
            z.push({"Fct" : "fillRect", "X" : x, "Y" : y, "Width" : w, "Height" : h}); 
        }
        else if (f === "Firkant (Streg)") {
            z.push({"Fct" : "strokeRect", "X" : x, "Y" : y, "Width" : w, "Height" : h});
        }
        else if (f === "Firkant") {
		    z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "rect", "X" : x, "Y" : y, "Width" : w, "Height" : h});
		    z.push({"Fct" : "closePath" });
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });
        }
        else if (f === "Cirkel") {
		    z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "arc", "X" : x, "Y" : y, "Width" : w, "StartAngle" : s, "EndAngle" : e});      
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });				      
        }
		else if (f === "Stjerne") {
            let innerRadius = w;
			let outerRadius = h;
            let spikes = 5;
            let rot = Math.PI / 2 * 3;
			let thisx = x;
			let thisy = y;
			let step = Math.PI / spikes;
			z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : y - outerRadius});
			for(let i = 0; i < spikes; i++){
				thisx = x + Math.cos(rot) * outerRadius;
				thisy = y + Math.sin(rot) * outerRadius;
				z.push({"Fct" : "lineTo", "X" : thisx, "Y" : thisy});
				rot += step
				thisx = x + Math.cos(rot) * innerRadius;
				thisy = y + Math.sin(rot) * innerRadius;
				z.push({"Fct" : "lineTo", "X" : thisx, "Y" : thisy});
				rot += step
			}
            z.push({"Fct" : "lineTo", "X" : x, "Y" : y - outerRadius});
			z.push({"Fct" : "closePath" });
			z.push({"Fct" : "fill" });
			z.push({"Fct" : "stroke" });
        }
        else if (f === "Trekant") {
		    z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : y });
            z.push({"Fct" : "lineTo", "X" : (x + w), "Y" : y }); 
            z.push({"Fct" : "lineTo", "X" : (x + w/2), "Y" : (y + h) });      
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });	
		}
        else if (f === "Trekant (Ret)") {
		    z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : y });
            z.push({"Fct" : "lineTo", "X" : (x + w), "Y" : (y + h) }); 
            z.push({"Fct" : "lineTo", "X" : x, "Y" : (y + h) });      
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });	
        }
        else if (f === "Rhombe") {
  		    z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : y });
            z.push({"Fct" : "lineTo", "X" : (x + w) - (w / 5), "Y" : y }); 
            z.push({"Fct" : "lineTo", "X" : (x + w), "Y" : (y + h) });
            z.push({"Fct" : "lineTo", "X" : x + (w / 5), "Y" : (y + h) });       
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });          
        }
        else if (f === "Trapezoid") {
            z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x + (w / 5), "Y" : y });
            z.push({"Fct" : "lineTo", "X" : (x + w) - (w / 5), "Y" : y }); 
            z.push({"Fct" : "lineTo", "X" : (x + w), "Y" : (y + h) });
            z.push({"Fct" : "lineTo", "X" : x, "Y" : (y + h) });         
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });  
        }
        else if (f === "Ellipse") {
            let kappa = .5522848;
            let ox = (w / 2) * kappa;
            let oy = (h / 2) * kappa;
            let xe = x + w;
            let ye = y + h;
            let xm = x + w / 2;
            let ym = y + h / 2; 
            z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : ym });
			z.push({"Fct" : "bezierCurveTo", "Cpx" : x, "Cpy" : ym - oy, "Cpx2" : xm - ox, "Cpy2" : y, "X" : xm, "Y" : y });
			z.push({"Fct" : "bezierCurveTo", "Cpx" : xm + ox, "Cpy" : y, "Cpx2" : xe, "Cpy2" : ym - oy, "X" : xe, "Y" : ym });
			z.push({"Fct" : "bezierCurveTo", "Cpx" : xe, "Cpy" : ym + oy, "Cpx2" : xm + ox, "Cpy2" : ye, "X" : xm, "Y" : ye });
			z.push({"Fct" : "bezierCurveTo", "Cpx" : xm - ox, "Cpy" : ye, "Cpx2" : x, "Cpy2" : ym + oy, "X" : x, "Y" : ym }); 
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });    
        }
		else if (f === "Smiley") {
            z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "arc", "X" : x, "Y" : y, "Width" : w, "StartAngle" : s, "EndAngle" : e, "Anticlockwise" : true });
            z.push({"Fct" : "moveTo", "X" : (x + w - (w * 3 / 10)), "Y" : y });
            z.push({"Fct" : "arc", "X" : x, "Y" : y, "Width" : (w / 2) + (w / 5), "StartAngle" : s, "EndAngle" : Math.PI, "Anticlockwise" : false });      
            z.push({"Fct" : "moveTo", "X" : x - (w / 5), "Y" : y - (w / 5) });
            z.push({"Fct" : "arc", "X" : x - (w * 3 / 10), "Y" :  y - (w / 5), "Width" : (w / 10), "StartAngle" : s, "EndAngle" : e, "Anticlockwise" : true });
            z.push({"Fct" : "moveTo", "X" : x + (w * 2 / 5), "Y" : (y - (w / 5)) });
            z.push({"Fct" : "arc", "X" : x + (w * 3 / 10), "Y" : y - (w / 5), "Width" : (w / 10), "StartAngle" : s, "EndAngle" : e, "Anticlockwise" : true });      
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });				      
		}
		else if (f === "Hjerte") {
            let d = Math.min(w, w);
            z.push({"Fct" : "beginPath" });
            z.push({"Fct" : "moveTo", "X" : x, "Y" : y + d / 4 });
			z.push({"Fct" : "quadraticCurveTo", "Cpx" : x, "Cpy" : y, "X" : x + d / 4 , "Y" : y });
            z.push({"Fct" : "quadraticCurveTo", "Cpx" : x + d / 2, "Cpy" : y, "X" : x + d / 2, "Y" : y + d / 4 });
            z.push({"Fct" : "quadraticCurveTo", "Cpx" : x + d / 2, "Cpy" : y, "X" : x + d * 3/4, "Y" : y });
            z.push({"Fct" : "quadraticCurveTo", "Cpx" : x + d, "Cpy" : y, "X" : x + d, "Y" : y + d / 4 });
            z.push({"Fct" : "quadraticCurveTo", "Cpx" : x + d, "Cpy" : y + d / 2, "X" :x + d * 3/4, "Y" :  y + d * 3/4 });
            z.push({"Fct" : "lineTo", "X" : x + d / 2, "Y" : y + d });
            z.push({"Fct" : "lineTo", "X" : x + d / 4, "Y" : y + d * 3/4 });
            z.push({"Fct" : "quadraticCurveTo", "Cpx" : x, "Cpy" : y + d / 2, "X" : x, "Y" :  y + d / 4 });
		    z.push({"Fct" : "closePath" });	   
		    z.push({"Fct" : "fill" });
		    z.push({"Fct" : "stroke" });   
		}

        if (cpt.drg) {
            cpt.data[cpt.index] = cpt.data[cpt.index].concat(z);
        }

		cpt.dat();  

		if (!cpt.drg) {
            for (let i = 0; i < z.length; i++) {
				cpt.drafi("globalAlpha", null, null, null, null, "0.8");
                cpt.drafi(z[i].Fct, 
					z[i].X, 
					z[i].Y, 
					z[i].Width, 
					z[i].Height, 
					z[i].Value, 
					z[i].StartAngle, 
					z[i].EndAngle, 
					z[i].Angle, 
					z[i].Colour, 
					z[i].Offset, 
					z[i].Text, 
					z[i].MaxWidth, 
					z[i].Radius, 
					z[i].X2, 
					z[i].Y2, 
					z[i].Cpx, 
					z[i].Cpy, 
					z[i].Cpx2, 
					z[i].Cpy2,
					z[i].RadiusY,
					z[i].Rotation,
					z[i].Anticlockwise
				);
				cpt.drafi("globalAlpha", null, null, null, null, "1");
            }
        }
	};
	cpt.cfl = function() {
		var fill = document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].value;
		cpt.brush.Fil = fill;
		if (cpt.data[cpt.index].length > 0) {
			if (cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Fct !== "fillStyle") {
				cpt.data[cpt.index].push({"Fct" : "fillStyle", "Value" : cpt.brush.Fil});
			}
			else {
				cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Value = cpt.brush.Fil;
			}
		}
		else {
			cpt.data[cpt.index].push({"Fct" : "fillStyle", "Value" : cpt.brush.Fil});
		}		
	};
	
	cpt.cst = function() {
		var stroke = document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].value;
		cpt.brush.Str = stroke;
		if (cpt.data[cpt.index].length > 0) {
			if (cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Fct !== "strokeStyle") {
				cpt.data[cpt.index].push({"Fct" : "strokeStyle", "Value" : cpt.brush.Str});
			}
			else {
				cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Value = cpt.brush.Str;
			}
		}
		else {
			cpt.data[cpt.index].push({"Fct" : "strokeStyle", "Value" : cpt.brush.Str});
		}		
	};
	cpt.clw = function() {
		var lineWidth = document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value;
		if (!isNaN(lineWidth)) {
			if (cpt.data[cpt.index].length > 0) {
				if (cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Fct !== "lineWidth") {
					cpt.data[cpt.index].push({"Fct" : "lineWidth", "Value" : lineWidth});
				}
				else {
					cpt.data[cpt.index][cpt.data[cpt.index].length - 1].Value = lineWidth;
				}
			}
			else {
				cpt.data[cpt.index].push({"Fct" : "lineWidth", "Value" : lineWidth});
			}			
        }
	};
	cpt.cls = function () {
		cpt.cfl();
		cpt.cst();
		cpt.clw();	
	};
    cpt.dim = function() {
        var height = document.getElementsByClassName(cpt.tools.id + "_height")[0].value;
        var width =  document.getElementsByClassName(cpt.tools.id + "_width")[0].value;		
        if (!isNaN(height)) {
            cpt.brush.Hgt = height;
        }
        if (!isNaN(width)) {
            cpt.brush.Wth = width;
        }
    };
	cpt.dat = function () {  
		cpt.context.clearRect(0,0, cpt.elem.getAttribute("width"), cpt.elem.getAttribute("height"));        
		for (let j = cpt.data.length -1; j >= 0; j--) {
			for (let i = 0; i < cpt.data[j].length; i++) {
				cpt.drafi(
					cpt.data[j][i].Fct, 
					cpt.data[j][i].X, 
					cpt.data[j][i].Y, 
					cpt.data[j][i].Width, 
					cpt.data[j][i].Height, 
					cpt.data[j][i].Value, 
					cpt.data[j][i].StartAngle, 
					cpt.data[j][i].EndAngle, 
					cpt.data[j][i].Angle, 
					cpt.data[j][i].Colour, 
					cpt.data[j][i].Offset, 
					cpt.data[j][i].Text, 
					cpt.data[j][i].MaxWidth, 
					cpt.data[j][i].Radius, 
					cpt.data[j][i].X2, 
					cpt.data[j][i].Y2, 
					cpt.data[j][i].Cpx, 
					cpt.data[j][i].Cpy, 
					cpt.data[j][i].Cpx2, 
					cpt.data[j][i].Cpy2,
					cpt.data[j][i].RadiusY,
					cpt.data[j][i].Rotation,
					cpt.data[j][i].Anticlockwise
				);
			}
		}
		 
	};
    cpt.drafi = function (f, x, y, w, h, v, s, e, a, c, o, t, m, r, x2, y2, cx, cy, cx2, cy2, ry, rt, aw) {
		if (f == "strokeStyle" || f === "fillStyle" || f === "shadowOffsetX" || f === "shadowOffsetY" || f === "shadowBlur" || f === "shadowColor" || f == "font" || f == "textAlign" || f === "textBaseline" || f === "globalAlpha" || f === "globalCompositeOperation" || f === "lineWidth" || f === "lineCap" || f === "lineJoin" || f === "miterLimit") {
			cpt.context[f] = v;
		}
		else if (f === "save" || f === "restore" || f === "beginPath" || f === "closePath" || f === "fill" || f === "stroke" || f === "clip") {
			cpt.context[f]();	
		}
        else if (f === "rotate") {
            cpt.context[f](a);
        }
		else if (f === "moveTo" || f === "lineTo" || f === "scale" || f === "translate") {
			cpt.context[f](x, y);		
		}
        else if (f === "addColorStop") {
 			cpt.context[f](o, c);           
        }
		else if (f === "fillRect" || f === "strokeRect" || f === "rect" || f === "clearRect") {
			cpt.context[f](x, y, w, h);
		}
        else if (f === "fillText" || f === "strokeText") {
 			cpt.context[f](t, x, y, m); 			
        }
		else if (f === "arc") {
			cpt.context[f](x, y, w, s, e, aw);
		}
        else if (f === "arcTo") {
    		cpt.context[f](x, y, x2, y2, r);        
        }
		else if (f === "ellipse") {
    		cpt.context[f](x, y, r, ry, rt, s, e, aw);        
        }
        else if (f === "quadraticCurveTo") {
       		cpt.context[f](cx, cy, x, y);          
        } 
        else if (f === "bezierCurveTo") {
			cpt.context[f](cx, cy, cx2, cy2, x, y);             
        }   
        else if (f === "drawImage") {
            
        }
        else if (f === "putImageData") {
            
        }
        else if (f === "transform" || f === "setTransform") {
            
        }
    };
	cpt.ref = function () {
		cpt.elem.setAttribute("width",window.innerWidth);
		cpt.elem.setAttribute("height",window.innerHeight);
		cpt.dat();		
	};
	cpt.refl = function () {
		document.getElementsByClassName(cpt.tools.id + "_dataLevelSelect")[0].innerHTML = "";
		for (let i = 0; i < cpt.data.length; i++) {
			document.getElementsByClassName(cpt.tools.id + "_dataLevelSelect")[0].innerHTML += '<option value="' + i + '">' + i + '</option>';
        }
	};
	cpt.rjsn = function(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();            
            reader.onload = function (e) {
				try {
					let newArr = JSON.parse(e.target.result);
					let concato = true;
					
					if (Array.isArray(newArr)) {
						if(concato) {
							cpt.data = cpt.data.concat(newArr);													
						}
						else {
							cpt.data = newArr;
						}
						cpt.ref();
					}										
				}
				catch (e) {
					alert(e);
				}
        	}            
            reader.readAsText(input.files[0]);
        }
	};
	cpt.wjsn = function (fil) {
		var json = JSON.stringify(cpt.data);
		cpt.down((fil ? fil : "captainCanvas")  + ".json", "data:application/json;charset=utf-8," + encodeURIComponent(json));
	};
	cpt.rsvg = function() {

	};
	cpt.wsvg = function (fil) {
		var firstLine = '<?xml version="1.0" encoding="UTF-8"><svg width="' + cpt.elem.getAttribute("width") + '" height="' + cpt.elem.getAttribute("height") + '">';
		var dataLines = '';
		for (let i = 0; i < cpt.data[cpt.index].length; i++) {
			let funky = cpt.data[cpt.index][i].Fct;
			if (funky == "fillRect") {
				dataLines += '<rect x="' + cpt.data[cpt.index][i].X  + '" y="' + cpt.data[cpt.index][i].Y + '" width="' + cpt.data[cpt.index][i].W + '" height="' + cpt.data[cpt.index][i].H + '" style="fill:rgb(0,0,0);" />';
			}
			else if (funky == "strokeRect") {
				dataLines += '<rect x="' + cpt.data[cpt.index][i].X  + '" y="' + cpt.data[cpt.index][i].Y + '" width="' + cpt.data[cpt.index][i].W + '" height="' + cpt.data[cpt.index][i].H + '" style="fill:rgb(0,0,0);" />';
			}			
		}
		var lastLine = '</svg>';
		var svg = firstLine + dataLines + lastLine;
		cpt.down((fil ? fil : "captainCanvas") + ".svg", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
	};
    cpt.whtm = function (fil) {
        var name = (fil ? fil : "captainCanvas");
        var html = '<!doctype html>\r\n<html>\r\n<head>\r\n<title>'         
        + name 
        + '</title>\r\n</head>\r\n<body>\r\n<canvas id="' 
        + name 
        + '" width="' 
        + cpt.elem.getAttribute("width") 
        + '" height="' 
        + cpt.elem.getAttribute("height")  
        + '"></canvas>\r\n<script>\r\n'		
        + 'var '
        + name
        + ' = document.getElementById("'
        + name
        + '").getContext("2d");\r\n';
		
		for (let i = 0; i < cpt.data[cpt.index].length; i++) {	
			let p = cpt.data[cpt.index][i];
			let isAtr = false;
			let add = name + '.' + p.Fct + "(";
			for (let j in p) {				
				if (p.hasOwnProperty(j)) {
					if (j !== "Fct") {
						if (j == "Value") {
							add = name + "." + p.Fct + " = '" + p[j] + "';\r\n";
							isAtr = true;
							break;
						}
						else {
							add += p[j] + ',';
						}
					}
				}				
			}
			if (!isAtr) {
				if (add.indexOf(',') !== -1) {
					add = add.slice(0,-1);
				}
				add += ');\r\n'
			}
			html += add;			
		}		

        html += '</script>\r\n</body>\r\n</html>';

        cpt.down(name  + ".html", "data:text/html;charset=utf-8," + encodeURIComponent(html));
    };
	cpt.wpng = function (fil) {
		cpt.dat();
		cpt.down((fil ? fil : "captainCanvas")  + ".png", "data:image/png;base64;" + cpt.elem.toDataURL());
	};
	cpt.down = function (filename, txt) {
		var l = document.createElement("a");
		l.setAttribute("href", txt);
		l.setAttribute("download", filename);
		if (document.createEvent) {
			let ev = document.createEvent('MouseEvents');
			ev.initEvent('click', true, true);
			l.dispatchEvent(ev);
		}
		else {
			l.click();
		}
	};
	cpt.moveMouse = function (mrX, mrY) {
		    cpt.brush.Slc = document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value;
			if (cpt.brush.Slc !== "Linie" && cpt.brush.Slc.indexOf("Figur") === -1) {
				cpt.dim();
				cpt.drw(mrX, mrY);
			}
			else if (cpt.brush.Slc === "Linie") {
				if (cpt.brush.LastX !== null || cpt.brush.LastY !== null) {
					let x = mrX - (cpt.elem.getBoundingClientRect().left + window.scrollX);
					let y = mrY - (cpt.elem.getBoundingClientRect().top + window.scrollY);
					cpt.dim();
					cpt.dat();					  
					cpt.drafi("lineTo", x, y);
					cpt.drafi("closePath");
					cpt.drafi("stroke");
				}
			}
            else if (cpt.brush.Slc.indexOf("Figur") !== -1) {
				if (cpt.brush.LastX !== null || cpt.brush.LastY !== null) {
					let x = mrX - (cpt.elem.getBoundingClientRect().left + window.scrollX);
					let y = mrY - (cpt.elem.getBoundingClientRect().top + window.scrollY);
					cpt.dim();
					cpt.dat();
                    for (let i = 0; i < cpt.brush.Buff.length; i++) {
                        cpt.drafi(cpt.brush.Buff[i].Fct, 
					        cpt.brush.Buff[i].X, 
					        cpt.brush.Buff[i].Y
				        );
                    }					  
					cpt.drafi("lineTo", x, y);
					cpt.drafi("closePath");
					cpt.drafi("stroke");
                    if (cpt.brush.Buff.length > 0) {
                        if (x >= (cpt.brush.Buff[1].X - 5) && x <= (cpt.brush.Buff[1].X + 5) && y >= (cpt.brush.Buff[1].Y - 5) && y <= (cpt.brush.Buff[1].Y + 5)) {
                            // cpt.drafi("fillRect", x, y, 25, 25);
                            cpt.drafi("closePath");
                            cpt.drafi("fill");
                            cpt.drafi("stroke");                       
                        }
                    }
				}                
            }
	};
	cpt.init = function () {
		/* Init toggle in-out toolBox */
		cpt.tools.addEventListener("mouseenter", function() {
			cpt.settings.foc = true;
		});
		cpt.tools.addEventListener("mouseleave", function() {
			cpt.settings.foc = false;
		});
        /* Hide cursor when above drawing area */
        		// cpt.elem.style.cursor = "none";
                //cpt.elem.style.webkitCursor = "none";
		/* Tool Box Contents */
			/* Heading */
				cpt.tools.appendChild(document.createElement("h1"));
                cpt.tools.getElementsByTagName("h1")[0].innerHTML =  cpt.settings.lan ? "V&aelig;rkt&oslash;jer : " : "Tools : ";
			/* Brush Heading */
				var brush = document.createElement("h3");
				brush.innerHTML = cpt.settings.lan ? "Pensel : " : "Brush : "
				cpt.tools.appendChild(brush);
			/* Selected Function */
            	var selectFuncLabel = document.createElement("label");
				selectFuncLabel.innerHTML = cpt.settings.lan ? "Funktion : &nbsp;" : "Function : &nbsp;";
				cpt.tools.appendChild(selectFuncLabel);				
				cpt.tools.appendChild(document.createElement("select"));
				cpt.tools.getElementsByTagName("select")[0].className = cpt.tools.id + "_selectedFunction";
				var funky = cpt.methods.sort();
				for (let i = 0; i < funky.length; i++) {
					document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].innerHTML += "<option value='" + funky[i] + "'>" + funky[i] + "</option>";
				}
				// document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].addEventListener("change", cpt.dat);
                cpt.tools.appendChild(document.createElement("br"));
            /* Selected Height, Width And Linewidth */
            	var heightLabel = document.createElement("label");
				heightLabel.innerHTML = cpt.settings.lan ? "H&oslash;jde : &nbsp;" : "Height : &nbsp;";
				cpt.tools.appendChild(heightLabel);
                var height = document.createElement("input");
				height.value = "20";
				height.setAttribute("type", "number");
				height.className = cpt.tools.id + "_height";
				cpt.tools.appendChild(height);
                // document.getElementsByClassName(cpt.tools.id + "_height")[0].addEventListener("change", cpt.dim);
                cpt.tools.appendChild(document.createElement("br"));
                var widthLabel = document.createElement("label");
				widthLabel.innerHTML = cpt.settings.lan ? "Bredde : &nbsp;" : "Width : &nbsp;";
				cpt.tools.appendChild(widthLabel);	
                var width = document.createElement("input");
				width.value = "20";
				width.setAttribute("type", "number");
				width.className = cpt.tools.id + "_width";
				cpt.tools.appendChild(width);
                // document.getElementsByClassName(cpt.tools.id + "_width")[0].addEventListener("change", cpt.dim);
                cpt.tools.appendChild(document.createElement("br"));
				var linewidthLabel = document.createElement("label");
				linewidthLabel.innerHTML = cpt.settings.lan ? "Linie : &nbsp;" : "Line : &nbsp;";
				cpt.tools.appendChild(linewidthLabel);	
                var linewidth = document.createElement("input");
				linewidth.value = "1";
				linewidth.setAttribute("type", "number");
				linewidth.className = cpt.tools.id + "_lineWidth";
				cpt.tools.appendChild(linewidth);
				document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].addEventListener("change", cpt.clw);				
                cpt.tools.appendChild(document.createElement("br"));
            /* Selected Colours*/
                var selectColLabel = document.createElement("label");
				selectColLabel.innerHTML = cpt.settings.lan ? "Fyldfarve : &nbsp;" : "Fill : &nbsp;";
                cpt.tools.appendChild(selectColLabel);
                var colSelect = document.createElement("select")
                colSelect.className = cpt.tools.id + "_selectedFill";
                cpt.tools.appendChild(colSelect);
                for (let i = 0; i < cpt.colours.length; i++) {
                    document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].innerHTML += "<option style='background: " + cpt.colours[i] + " ;' value='" + cpt.colours[i] + "'>" + cpt.colours[i] + "</option>";
                }
				document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].getElementsByTagName("option")[cpt.colours.indexOf("Black")].setAttribute("selected","");
				document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].addEventListener("change",cpt.cfl);
                cpt.tools.appendChild(document.createElement("br"));
                var selectFilLabel = document.createElement("label");
				selectFilLabel.innerHTML = cpt.settings.lan ? "Stregfarve : &nbsp;" : "Stroke : &nbsp;";
                cpt.tools.appendChild(selectFilLabel);
                var filSelect = document.createElement("select")
                filSelect.className = cpt.tools.id + "_selectedStroke";
                cpt.tools.appendChild(filSelect);
                for (let i = 0; i < cpt.colours.length; i++) {
                    document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].innerHTML += "<option style='background: " + cpt.colours[i] + " ;' value='" + cpt.colours[i] + "'>" + cpt.colours[i] + "</option>";
                }
				document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].getElementsByTagName("option")[cpt.colours.indexOf("Transparent")].setAttribute("selected","");
				document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].addEventListener("change",cpt.cst);
                cpt.tools.appendChild(document.createElement("br"));
                cpt.tools.appendChild(document.createElement("br"));
            /* Import Heading */
				var imp = document.createElement("h3");
				imp.innerHTML = cpt.settings.lan ? "Hent fil : " : "Load file : "
				cpt.tools.appendChild(imp);
			/* Import JSON */
				var importJSONLabel = document.createElement("label");
				importJSONLabel.innerHTML = cpt.settings.lan ? "Hent JSON : &nbsp;" : "Load JSON : &nbsp;";
				cpt.tools.appendChild(importJSONLabel);
				var importJSON = document.createElement("input");
				// importJSON.value = "Hent JSON";
				importJSON.setAttribute("type", "file");
				importJSON.className = cpt.tools.id + "_importJSON";
				cpt.tools.appendChild(importJSON);
				document.getElementsByClassName(cpt.tools.id + "_importJSON")[0].addEventListener("change", function(event) {
					cpt.rjsn(this);
				});
				cpt.tools.appendChild(document.createElement("br"));
				cpt.tools.appendChild(document.createElement("br"));
            /* Export Heading */
				var exp = document.createElement("h3");
				exp.innerHTML = cpt.settings.lan ? "Gem fil : " : "Save file : ";
				cpt.tools.appendChild(exp);
			/* Export File Name */
				var fileName = document.createElement("input");
				fileName.setAttribute("placeholder", cpt.settings.lan ? "Filnavn" : "File Name");
				fileName.setAttribute("type", "text");
				fileName.className = cpt.tools.id + "_fileName";
				cpt.tools.appendChild(fileName);		
			/* Export JSON */
				var exportJSON = document.createElement("input");
				exportJSON.value = cpt.settings.lan ? "Gem JSON" : "Save JSON";
				exportJSON.setAttribute("type", "button");
				exportJSON.className = cpt.tools.id + "_exportJSON";
				cpt.tools.appendChild(exportJSON);
				document.getElementsByClassName(cpt.tools.id + "_exportJSON")[0].addEventListener("click", function() {
					cpt.wjsn(document.getElementsByClassName(cpt.tools.id + "_fileName")[0].value);
				});
			/* Export SVG */
				var exportSVG = document.createElement("input");
				exportSVG.value = cpt.settings.lan ? "Gem SVG" : "Save SVG";
				exportSVG.setAttribute("type", "button");
				exportSVG.setAttribute("disabled", "");
				exportSVG.className = cpt.tools.id + "_exportSVG";
				cpt.tools.appendChild(exportSVG);
				document.getElementsByClassName(cpt.tools.id + "_exportSVG")[0].addEventListener("click", function() {
					cpt.wsvg(document.getElementsByClassName(cpt.tools.id + "_fileName")[0].value);
				});
            /* Export HTML Canvas */
				var exportHtml = document.createElement("input");
				exportHtml.value = cpt.settings.lan ? "Gem HTML" : "Save HTML";
				exportHtml.setAttribute("type", "button");
				exportHtml.className = cpt.tools.id + "_exportHtml";
				cpt.tools.appendChild(exportHtml);
				document.getElementsByClassName(cpt.tools.id + "_exportHtml")[0].addEventListener("click", function() {
					cpt.whtm(document.getElementsByClassName(cpt.tools.id + "_fileName")[0].value);
				});
			/* Export PNG */
				var exportPNG = document.createElement("input");
				exportPNG.value = cpt.settings.lan ? "Gem PNG" : "Save PNG";
				exportPNG.setAttribute("type", "button");
				exportPNG.className = cpt.tools.id + "_exportPNG";
				cpt.tools.appendChild(exportPNG);
				document.getElementsByClassName(cpt.tools.id + "_exportPNG")[0].addEventListener("click", function() {
					cpt.wpng(document.getElementsByClassName(cpt.tools.id + "_fileName")[0].value);
				});
                cpt.tools.appendChild(document.createElement("br"));
			/* Data Level Area */
                var lel = document.createElement("span");
                lel.innerHTML = cpt.settings.lan ? "Rediger Niveau : " : "Edit Level : ";
                cpt.tools.appendChild(lel);
                var ltg = document.createElement("input");
                ltg.setAttribute("type", "checkbox");                
                ltg.className = cpt.tools.id + "_levelToggler";
                cpt.tools.appendChild(ltg);
                document.getElementsByClassName(cpt.tools.id + "_levelToggler")[0].addEventListener("change", function(event) {
                    if (this.checked) {
                        document.getElementsByClassName(cpt.tools.id + "_dataLevelArea")[0].style.display = "block";
						cpt.refl();
                    }
                    else {
                        document.getElementsByClassName(cpt.tools.id + "_dataLevelArea")[0].style.display = "none";
                    }
                });
				var ltf = document.createElement("div");
                ltf.style.cssText = "display: none;";
                ltf.className = cpt.tools.id + "_dataLevelArea";
                cpt.tools.appendChild(ltf);
				var lev = document.getElementsByClassName(cpt.tools.id + "_dataLevelArea")[0];
				var lll = document.createElement("span");
                lll.innerHTML = cpt.settings.lan ? "Niveau : " : "Level : ";
                lev.appendChild(lll);
                cpt.tools.appendChild(document.createElement("br"));
				var lfs = document.createElement("select");
                lfs.className = cpt.tools.id + "_dataLevelSelect";
                lev.appendChild(lfs);
				var lse = document.getElementsByClassName(cpt.tools.id + "_dataLevelSelect")[0];
				cpt.refl();
                lse.addEventListener("change", function (event) {
                    cpt.index = this.value;
                });
				var ltb = document.createElement("input");
                ltb.setAttribute("type", "button");
				ltb.value = cpt.settings.lan ? "Tilføj" : "Add";
                ltb.className = cpt.tools.id + "_dataLevelAdd";
                lev.appendChild(ltb);
				document.getElementsByClassName(cpt.tools.id + "_dataLevelAdd")[0].addEventListener("click", function() {
						cpt.data.push([]);
						cpt.refl();
				});
				var ltr = document.createElement("input");
                ltr.setAttribute("type", "button");
				ltr.value = cpt.settings.lan ? "Fjern sidste" : "Remove last";
                ltr.className = cpt.tools.id + "_dataLevelRemove";
                lev.appendChild(ltr);
				document.getElementsByClassName(cpt.tools.id + "_dataLevelRemove")[0].addEventListener("click", function() {
					if (cpt.data.length > 1) {
						cpt.data.pop();
						cpt.refl();
					}
				});
				var ltu = document.createElement("input");
                ltu.setAttribute("type", "button");
				ltu.value = cpt.settings.lan ? "Flyt op" : "Move up";
                ltu.className = cpt.tools.id + "_dataLevelMoveUp";
                lev.appendChild(ltu);
				document.getElementsByClassName(cpt.tools.id + "_dataLevelMoveUp")[0].addEventListener("click", function() {
					if (cpt.data.length > 1 && cpt.index !== (cpt.data.length - 1)) {
						let index = cpt.index;
						//alert(cpt.data[index]);
						let lvl1 = cpt.data[index]; //cpt.data[index] ? JSON.parse(cpt.data[index]) : [];
						//alert(lvl1);
						let lvl2 = cpt.data[index + 1]; //cpt.data[cpt.index + 1] ? JSON.parse(cpt.data[cpt.index + 1]) : [];
						cpt.data[index] = lvl2;
						cpt.data[index + 1] = lvl1;
						//cpt.data.splice(index, 2, lvl2, lvl1);
						// cpt.data.splice(cpt.index, 2, cpt.data[cpt.index + 1], cpt.data[cpt.index]);
						cpt.refl();
					}
				});
			/* Edit Data Toggler */
                var dtt = document.createElement("span");
                dtt.innerHTML = cpt.settings.lan ? "Rediger Data : " : "Edit Data : ";
                cpt.tools.appendChild(dtt);
                var dtg = document.createElement("input");
                dtg.setAttribute("type", "checkbox");                
                dtg.className = cpt.tools.id + "_dataToggler";
                cpt.tools.appendChild(dtg);
                document.getElementsByClassName(cpt.tools.id + "_dataToggler")[0].addEventListener("change", function(event) {
                    if (this.checked) {
                        document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].value = JSON.stringify(cpt.data[cpt.index]);
                        document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].style.display = "block";
                    }
                    else {
                        document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].value = "";
                        document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].style.display = "none";
                    }
                });
                cpt.tools.appendChild(document.createElement("br"));
			/* Data Edit Area */
                var dtf = document.createElement("textarea");
                dtf.style.cssText = "height: 200px; width: 95%; overflow-y : auto; display: none;";
                dtf.className = cpt.tools.id + "_dataEditArea";
                cpt.tools.appendChild(dtf);
                document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].addEventListener("blur", function(event) {
                    cpt.data[cpt.index] = JSON.parse(this.value);
                });
		/* Tool Box Toggler */
		if (cpt.settings.tog) {
			cpt.tools.style.cssText = "position: fixed; right: 0; top: 0; z-index: 98; width: 30vw;"; // overflow-y : auto;
			let toggler = document.createElement("span");
			let txt = document.createElement("span");
			let chk = document.createElement("input");
			toggler.id = cpt.tools.id + "_toggleBandit";
			toggler.style.cssText = "position: fixed; right: 0; bottom: 0; z-index: 99; color: rgba(155,155,155,0.8);";
			txt.innerHTML = cpt.settings.lan ? "Gem V&aelig;rkt&oslash;jer" : "Hide Tools";
			toggler.appendChild(txt);
			chk.setAttribute("type", "checkbox");
			chk.id = cpt.tools.id + "_toolToggler";			
			toggler.appendChild(chk);
			document.body.appendChild(toggler);
			document.getElementById(cpt.tools.id + "_toolToggler").addEventListener("click", function(event) {
				cpt.tools.style.display = !this.checked ?  "block" : "none";
			});			
		}
		/* Default Events */
		if (cpt.settings.evt) {
			cpt.elem.addEventListener("mousemove", function(event) {
				cpt.moveMouse(event.pageX, event.pageY);
				/* Update Cursor */
				cpt.brush.CursX = event.pageX;
				cpt.brush.CursY = event.pageY;
			});
			cpt.elem.addEventListener("touchmove", function(event) {
				for (const evt of event.touches) {
					event.preventDefault();
					cpt.drg = true;	
					cpt.moveMouse(evt.clientX, evt.clientY);
					/* Update Cursor */
					cpt.brush.CursX = evt.clientX;
					cpt.brush.CursY = evt.clientY;
					cpt.drg = false;	
				}
			});
			cpt.elem.addEventListener("mousedown", function(event) { 
				cpt.drg = true;	
				cpt.brush.Slc = document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value;
				if (cpt.brush.Slc !== "Linie" && cpt.brush.Slc.indexOf("Figur") === -1) {				
					cpt.dim();
					cpt.drw(event.pageX, event.pageY);
				}
				else if (cpt.brush.Slc == "Linie") {
					let x = event.pageX - (cpt.elem.getBoundingClientRect().left + window.scrollX); // event.pageX - cpt.elem.offsetLeft;
					let y = event.pageY - (cpt.elem.getBoundingClientRect().top + window.scrollY); // event.pageY - cpt.elem.offsetTop;
					if (cpt.brush.LastX == null || cpt.brush.LastY == null) {
						cpt.data[cpt.index].push({"Fct" : "beginPath" });
						cpt.data[cpt.index].push({"Fct" : "moveTo", "X" : x, "Y" : y });
						cpt.brush.LastX = x;
						cpt.brush.LastY = y;
					}
					else {
						cpt.data[cpt.index].push({"Fct" : "lineTo", "X" : x, "Y" : y });	
						cpt.data[cpt.index].push({"Fct" : "stroke" });
						cpt.dim();
						cpt.dat();	
						cpt.brush.LastX = null;
						cpt.brush.LastY = null;
					}
				}            
				else if (cpt.brush.Slc.indexOf("Figur") !== -1) {
					let x = event.pageX - (cpt.elem.getBoundingClientRect().left + window.scrollX);
					let y = event.pageY - (cpt.elem.getBoundingClientRect().top + window.scrollY);
					// let x = event.pageX - cpt.elem.offsetLeft;
					// let y = event.pageY - cpt.elem.offsetTop;
					let reset = false;
					
					if (cpt.brush.Buff.length > 0) {
						// console.log("x : " + x + " y : " + y + " x1 : " + cpt.brush.Buff[1].X + " y1 " + cpt.brush.Buff[1].Y);
						if (x >= (cpt.brush.Buff[1].X - 5) && x <= (cpt.brush.Buff[1].X + 5) && y >= (cpt.brush.Buff[1].Y - 5) && y <= (cpt.brush.Buff[1].Y + 5)) {
							cpt.brush.Buff.push({"Fct" : "lineTo", "X" : cpt.brush.Buff[1].X, "Y" : cpt.brush.Buff[1].Y });
							cpt.brush.Buff.push({"Fct" : "closePath" });
							cpt.brush.Buff.push({"Fct" : "stroke" });
							cpt.brush.Buff.push({"Fct" : "fill" });	
							cpt.data[cpt.index] = cpt.data[cpt.index].concat(cpt.brush.Buff);
							cpt.dat();  
							cpt.brush.LastX = null;
							cpt.brush.LastY = null;
							cpt.brush.Buff = [];
							reset = true;
							/*
							if (cpt.brush.Slc.indexOf("(Linie)") != -1) {
								
								alert(cpt.brush.Buff.length);
							}
							*/
						}
					}
					if (!reset) {
						if (cpt.brush.LastX == null || cpt.brush.LastY == null) {
							cpt.brush.Buff.push({"Fct" : "beginPath" });
							cpt.brush.Buff.push({"Fct" : "moveTo", "X" : x, "Y" : y });
							cpt.brush.LastX = x;
							cpt.brush.LastY = y;
						}
						else {
							cpt.brush.Buff.push({"Fct" : "lineTo", "X" : x, "Y" : y });	
							// cpt.brush.Buff.push({"Fct" : "moveTo", "X" : x, "Y" : y });
							cpt.dim();
							cpt.dat();
							for (let i = 0; i < cpt.brush.Buff.length; i++) {
								cpt.drafi( cpt.brush.Buff[i].Fct, 
								cpt.brush.Buff[i].X, 
								cpt.brush.Buff[i].Y
								);
							}
							cpt.drafi("stroke");	
							// cpt.drafi("fill");							
						}
					}                
				}
			});
			cpt.elem.addEventListener("mouseup", function() {
				cpt.drg = false;
				if (document.getElementsByClassName(cpt.tools.id + "_dataToggler")[0].checked) {
					//document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].innerHTML = "";
					document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].value = JSON.stringify(cpt.data[cpt.index]);
					document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].style.display = "block";
					/*
					for (let i = cpt.data[cpt.index].length; i >= 0; i--) {
						let index = cpt.data[cpt.index].length - i;
						let funky = cpt.data[cpt.index][index].Fct.toString();
						document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].innerHTML += i 
						+ " " + '<input type="text" value="' + funky + '"/><br/>';
					}
					*/
				}
				else {
					document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].value = "";
					document.getElementsByClassName(cpt.tools.id + "_dataEditArea")[0].style.display = "none";
				}
				/*
				if (document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value != "Linie") {	
					
				}
				else {
					
				}
				*/
			});
			cpt.elem.addEventListener("mouseout", function() {
				cpt.drg = false;
			});
		}
		if (cpt.settings.fit) {
			window.addEventListener("resize", cpt.ref);
		}
        if (cpt.settings.key) {           
            window.addEventListener("keydown", function (event) {		
				if (!cpt.settings.foc) {
					var k = event.keyCode;
					switch (k) {
						case 81 : document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value = (parseInt(cpt.methods.indexOf(cpt.brush.Slc)) > 0 ? cpt.methods[parseInt(cpt.methods.indexOf(cpt.brush.Slc)) - 1] : cpt.methods[parseInt(cpt.methods.indexOf(cpt.brush.Slc))]); break;
						case 65 : document.getElementsByClassName(cpt.tools.id + "_selectedFunction")[0].value = (parseInt(cpt.methods.indexOf(cpt.brush.Slc)) < cpt.methods.length - 1 ? cpt.methods[parseInt(cpt.methods.indexOf(cpt.brush.Slc)) + 1] : cpt.methods[parseInt(cpt.methods.indexOf(cpt.brush.Slc))]); break;
						case 87 : document.getElementsByClassName(cpt.tools.id + "_height")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_height")[0].value) - 1; break;
						case 83 : document.getElementsByClassName(cpt.tools.id + "_height")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_height")[0].value) + 1; break;
						case 69 : document.getElementsByClassName(cpt.tools.id + "_width")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_width")[0].value) - 1; break;
						case 68 : document.getElementsByClassName(cpt.tools.id + "_width")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_width")[0].value) + 1; break;
						case 82 : document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value) > 0 ? parseInt(document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value) - 1 : parseInt(document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value); cpt.clw(); break;                    
						case 70 : document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value = parseInt(document.getElementsByClassName(cpt.tools.id + "_lineWidth")[0].value) + 1; cpt.clw(); break;                    
						case 84 : document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].value = (parseInt(cpt.colours.indexOf(cpt.brush.Fil)) > 0 ? cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Fil)) - 1] : cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Fil))]); cpt.cfl(); break;
						case 71 : document.getElementsByClassName(cpt.tools.id + "_selectedFill")[0].value = (parseInt(cpt.colours.indexOf(cpt.brush.Fil)) < cpt.colours.length - 1 ? cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Fil)) + 1] : cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Fil))]); cpt.cfl(); break;
						case 89 : document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].value = (parseInt(cpt.colours.indexOf(cpt.brush.Str)) > 0 ? cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Str)) - 1] : cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Str))]); cpt.cst(); break;
						case 72 : document.getElementsByClassName(cpt.tools.id + "_selectedStroke")[0].value = (parseInt(cpt.colours.indexOf(cpt.brush.Str)) < cpt.colours.length - 1 ? cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Str)) + 1] : cpt.colours[parseInt(cpt.colours.indexOf(cpt.brush.Str))]); cpt.cst(); break;				
					}
					
					cpt.dat();
					cpt.moveMouse(cpt.brush.CursX,cpt.brush.CursY);
					// cpt.elem.dispatchEvent(new Event("mousemove"));
				}
            });
        }
		cpt.ref();	
		cpt.cls();
        cpt.dim();	
	};
	cpt.init();
};