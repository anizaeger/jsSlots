/*
Copyright 2016 Anakin-Marc Zaeger

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/*
Symbol Legend
0: Blank
1: Red Bar
2: White Bar
3: Blue Bar
4: Blue 7
5: White 7
6: Red 7
7: Wild
*/

var symbols = ["blank","BR", "BW", "BB", "7B", "7W", "7R", "Wild"];
	
// Reels and Positions
var reel = new Array(3);
var reelpos = new Array(3);

// Reel Strips
var strip = new Array(3);
strip[0] = [0,4,0,7,0,3,0,5,0,2,0,4,0,1,0,5,0,3,0,6,0,2];
strip[1] = [0,4,0,1,0,7,0,6,0,5,0,4,0,1,0,5,0,3,0,6,0,2];
strip[2] = [0,7,0,1,0,5,0,3,0,2,0,4,0,1,0,5,0,3,0,6,0,2];
	
// Paytable
var paytable = new Array();
paytable[0] = [7,7,7,1000,"3 Wilds"];
paytable[1] = [6,5,4,300,"Red 7, White 7, Blue 7"];
paytable[2] = [6,6,6,120,"3 Red Sevens"];
paytable[3] = [5,5,5,100,"3 White Sevens"];
paytable[4] = [4,4,4,80,"3 Blue Sevens"];
paytable[5] = [8,8,8,40,"Any 3 Sevens"];
paytable[6] = [1,2,3,40,"Red Bar, White Bar, Blue Bar"];
paytable[7] = [3,3,3,30,"3 Blue Bars"];
paytable[8] = [2,2,2,20,"3 White Bars"];
paytable[9] = [10,11,12,20,"Any Red, Any White, Any Blue"];
paytable[10] = [1,1,1,10,"3 Red Bars"];
paytable[11] = [9,9,9,5,"Any 3 Bars"];
paytable[12] = [-1,-1,-1,5,"2 Wilds"];
paytable[13] = [10,10,10,2,"Any 3 Reds"];
paytable[14] = [11,11,11,2,"Any 3 Whites"];
paytable[15] = [12,12,12,2,"Any 3 Blues"];
paytable[16] = [-1,-1,-1,2,"1 Wild"];
paytable[17] = [0,0,0,1,"3 Blanks"];
	
var groups = new Array();
groups[0] = [4,5,6,"Any<br />7"];
groups[1] = [1,2,3,"Any<br />Bar"];
groups[2] = [1,6,-1,"Any<br />Red"];
groups[3] = [2,5,-1,"Any<br />White"];
groups[4] = [3,4,-1,"Any<br />Blue"];

var payline = new Array(3);
	
var credits = 100;
var coinin = 0;
var canspin = 0;
var nocoin = 0;
var spinning = 0;
var spinsecs;
var paysym = new Array(3);
	
var i;
var s;
var tone;
var tones = ["4C","4E","4G","5C"]
var winpct;
	
function placeBet() {
	if ( nocoin != 1 ) {
		if ( credits > 0 ) {
			document.getElementById("win").value="";
			document.getElementById("paid").value="";
			document.getElementById("wintype").innerHTML="";
				
			credits--;
			coinin++;
			canspin = 1;
			for (pt = 0; pt < paytable.length; pt++) {
				for ( c = 0; c < 2; c++ ) {
					document.getElementById("pt" + pt + "c" + c).innerHTML="";
				}
				payAmt = paytable[pt][3] * coinin;
				document.getElementById( "pt" + pt ).innerHTML=payAmt;
			}
			document.getElementById("credits").value=credits;
			coinbong = new Audio( "sounds/coinbong.wav" )
			coinbong.play();
			if ( coinin >= 3 ) {
				coinin = 3;
			}
			document.getElementById("coinin").value=coinin;
			if ( coinin == 3 ) {
				nocoin = 1;
				setTimeout( function() { spin(); }, 500 )
			}
		}
	}
}
	
function betMax() {
	if ( coinin >= 3 ) {
		return;
	} else {
		placeBet();
	}
	setTimeout(function () {
		betMax();
	}, 125 )
}
	
function spin() {
	if ( spinning != 1 && canspin == 1 ) {
		nocoin = 1;
		spinning = 1;
		i = 0;
		s = 0;
		spinsecs = Math.floor(Math.random() * 8) + 8;
		toneLoop();
	}
}
	
function toneLoop() {
	setTimeout(function () {
		tone = new Audio( "sounds/"+tones[ Math.floor(Math.random() * 4) ]+".wav" );
		tone.play();
		i++;
		spinReels(s);
		if (i < spinsecs) {
			toneLoop(spinsecs);
		} else {
			if (s < 2) {
				i = 0;
				s++;
				spinsecs = Math.floor(Math.random() * 8) + 8;
				toneLoop(spinsecs);
			} else {
				checkPayline();
				spinning = 0;
				canspin = 0;
				nocoin = 0;
				coinin = 0;
				document.getElementById("coinin").value=coinin;
			}
		}
	}, 125 )
}
	
function spinReels(s) {
	var pos;
	for ( r = s; r < 3; r++ ) {
		pos = reelpos[r] +  Math.floor(Math.random() * 20 + 1);
		if ( pos > 21 ) {
			pos = pos - 21
		}
		reelpos[r] = pos
		setReel(r);
	}
}
	
function setReel(r) {
	for ( p = 0; p < 3; p++ ) {
		if ( reelpos[r] + p > 21 ) {
			symnum = reelpos[r] + p - 22;
		} else {
			symnum = reelpos[r] + p;
		}
		symbol = symbols[ strip[r][symnum] ];
		if (p == 1) {
			payline[r] = strip[r][symnum];
		}
		document.getElementById( "r"+r+"p"+p ).innerHTML="<image width=\"100\" src=images/"+symbol+".png />"
	}
}
	
function checkPayline() {
	var wilds = 0;
	var matches;
	var gnum;
	var wintype = -1;
	for (r = 0; r < 3; r++) {
		if (payline[r] == 7) {
			wilds++;
		}
	}
	for (p = 0; p < 18; p++) {
		match = 0;
		if ((p == 12 && wilds == 2) || (p == 16 && wilds == 1)) { // Any Wilds
			wintype = p;
			p = 18;
			break;
		} else {
			for (r = 0; r < 3; r++) {
				paysym[r] = paytable[p][r];
			}
				
			for (r = 0; r < 3; r++) {							
				if (paysym[r] < 8) {
					if (payline[r] == paysym[r] || payline[r] == 7) {
						if (r == 2) {
							wintype = p;
							p = 18;
							break;	
						} else {
							continue;
						}
					} else {
						break;
					}
				} else {
					gnum = paysym[r] - 8;
					for ( i = 0; i < groups[gnum].length; i++) {
						if (payline[r] == groups[gnum][i] || payline[r] == 7) {
							match++;
							if (r == 2 && match == 3) {
								wintype = p;
								p = 18;
							}
							break;
						}
					}								
				}
			}
		}
	}
	if ( wintype >= 0 ) {
		for ( c = 0; c < 2; c++ ) {
			if ( c == 0) {
				document.getElementById("pt" + wintype + "c" + c).innerHTML="-->";
			} else {
				document.getElementById("pt" + wintype + "c" + c).innerHTML="<--";
			}
		}
		document.getElementById("wintype").innerHTML=paytable[wintype][4];
		i = 0;
		jackpot( paytable[wintype][3] * coinin );
	}
}
	
function jackpot(payout) {
	document.getElementById("win").value=payout;
	setTimeout(function () {
		credits++
		document.getElementById("credits").value=credits;
		coinbong = new Audio( "sounds/coinbong.wav" )
		coinbong.play();
		i++
		document.getElementById("paid").value=i;
		if (i < payout) {
			jackpot(payout);
		}
	}, 125)
}
	
function printPaytable() {
	var paytext = "";
	var g;
	for (p = 0; p < paytable.length; p++) {
		if ( paytable[p][0] <= 0 ) {
			paytext = paytext + "<tr><td width=\"25\" id=\"pt" + p + "c0\">&nbsp;</td>";
			paytext = paytext + "<td align=\"center\" colspan=3>" + paytable[p][4] + "</td>";
			paytext = paytext + "<td id=\"pt" + p + "\">" + paytable[p][3] + "</td>";
			paytext = paytext + "<td width=\"25\" id=\"pt" + p + "c1\">&nbsp;</td></tr>";
		} else {
			paytext = paytext + "<tr><td width=\"25\" id=\"pt" + p + "c0\">&nbsp;</td>";
			for ( s = 0; s < 3; s++ ) {
				if (paytable[p][s] > 7 ) {
					var g = paytable[p][s] - 8
					paytext = paytext + "<td>" + groups[g][3] + "</td>";
				} else {
					symbol = symbols[ paytable[p][s] ]
					paytext = paytext + "<td><image width=\"25\" src=images/"+symbol+".png /></td>";
				}
			}
			paytext = paytext + "<td id=\"pt" + p + "\">" + paytable[p][3] + "</td>";
			paytext = paytext + "<td width=\"25\" id=\"pt" + p + "c1\">&nbsp;</td></tr>";
		}
	}
	document.getElementById( "paytable" ).innerHTML=paytext;
}
	
function init() {
	var spinnum;
	var symbol;
	var symnum;
	document.getElementById("credits").value=credits;
	document.getElementById("coinin").value=coinin;
	printPaytable();
	for ( r = 0; r < 3; r++ ) {
		reelpos[r] = Math.floor(Math.random() * 22)
		setReel(r);
	}
		
}
	
function rigspin() {
	if ( spinning != 1 && canspin == 1 ) {
		nocoin = 1;
		spinning = 1;
		i = 0;
		s = 0;
		reelpos[0] = 2;
		setReel(0);
		reelpos[1] = 16;
		setReel(1);
		reelpos[2] = 20;
		setReel(2);
		checkPayline();
		spinning = 0;
		canspin = 0;
		nocoin = 0;
		coinin = 0;
		document.getElementById("coinin").value=coinin;
	}
}
	
$(window).keypress(function(e){
	var code = e.which || e.keyCode;
	switch ( code )
	{
	case 49:
		//do stuff
		spin();
		return false;
	case 53:
		//do stuff
		placebet(1);
		return false;
	case 54:
		//do stuff
		placebet(3);
		return false;
	default:
		break;
	}
});