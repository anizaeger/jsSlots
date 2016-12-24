/**
 *
 * @source: https://github.com/anizaeger/jsSlots
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 *
 * Copyright (C) 2016 Anakin-Marc Zaeger
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

function gplAlert() {
	var copyText = "";
	copyText += "Copyright (C) 2016, Anakin-Marc Zaeger\n"
	copyText += "\n"
	copyText += "This program is free software: you can redistribute it and/or modify\n"
	copyText += "it under the terms of the GNU General Public License as published by\n"
	copyText += "the Free Software Foundation, either version 3 of the License, or\n"
	copyText += "(at your option) any later version.\n"
	copyText += "\n"
	copyText += "This program is distributed in the hope that it will be useful,\n"
	copyText += "but WITHOUT ANY WARRANTY; without even the implied warranty of\n"
	copyText += "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n"
	copyText += "GNU General Public License for more details.\n"
	copyText += "\n"
	copyText += "You should have received a copy of the GNU General Public License\n"
	copyText += "along with this program.  If not, see <http://www.gnu.org/licenses/>.\n"
	window.alert(copyText)
}

// Slot machine reels

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
		8: Spin
*/

var symbols = ["blank","BR", "BW", "BB", "7B", "7W", "7R", "Wild", "Spin"];

var virtReel = new Array(numReels);	// Auto-generated virtual reels.
var virtStop = new Array(numReels);	// Stop position for virtual reel.  Randomly-selected at spin.


// Physical reel strips and virtual reel stops per physical reel stop
// Physical reel strip elements indicate symbols.  See symbol legend above.
// Virtual reels indicate number of stops in total for the respective virtual reel.

// Example with dummy values:
//	strip[0]	= [0,2,0,4]
//	numVirtStops[0]	= [5,4,6,2]

//	strip[0][2] 		is 0: Blank
//	numVirtStops[0][2]	is 6: There are 6 virtual stops for that particular blank.

// numVirtStops[] stops for each physical reel strip stop will be added, in order, to virtReel[].
// virtReel[] is auto-generated in function initVReels(), and contains physical reel stop numbers.

// Resulting auto-generated virtual reel for above dummy values:

//	virtReel[0]	= [0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,3,3]

//	During game play, the random number generator selects a random element in virtReel[],
//	and stops the physical reel at the location indicated by the value read.

//	Example: Random number generator selects element 7:
//	virtReel[0][7]	is 1

//	That value is used to select an element on the correspond physical reel:
//	strip[0][1]	is 2

//	As a result, the reel will stop at that particular White Bar.

var strip = new Array(numReels);	// Phys. reels
var numVirtStops = new Array(numReels);	// Virt. reels

// Reel Stop		   0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2
// Numbers		   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1

strip[0] 		= [0,4,0,7,0,3,0,5,0,2,0,4,0,1,0,5,0,3,0,6,0,2];
numVirtStops[0]		= [4,1,5,1,6,3,4,1,3,2,5,1,3,6,4,1,5,3,5,1,5,3];

strip[1] 		= [0,4,0,1,0,7,0,6,0,3,0,4,0,1,0,5,0,3,0,6,0,2];
numVirtStops[1]		= [4,1,4,4,5,1,7,1,5,3,3,1,3,4,3,1,3,4,5,1,5,4];

strip[2] 		= [0,7,0,1,0,5,0,3,0,2,0,4,0,8,0,5,0,3,0,6,0,2];
numVirtStops[2]		= [4,1,6,9,3,1,3,3,2,4,4,2,4,1,5,1,3,2,5,1,3,5];

// Odds of symbol nudging to blank payline space, in symbols[] order
var nudgeOdds = [0,1,2,3,10,20,30,100,5]

var nudgeVal = new Array(numReels);  // Direction, if any, to nudge reels.


// Reels and Positions
var numReels = strip.length;  // Number of reels
var numReelPos = 3;  // Number of visible reel positions
var reel = new Array( numReels );  // Array storing symbols for each reel position: reel[r] = [ top, middle, bottom ]
for ( r = 0; r < numReels; r++ ) {
	reel[r] = new Array( numReelPos );
	for ( p = 0; p < numReelPos; p++ ) {
		reel[r][p] = -1;
	}
}
var reelStop = new Array(numReels);
var reelTopPos = new Array(numReels);

// Bonus wheel

/*
	Bonus Wheel Slot Value/Color Legend
		0: Double, Yellow
		1: 1000, Gold
		2: 100, Purple
		3: 50, Orange
		4: 40, Cyan
		5: 30, Blue
		6: 20, Red
		7: 10, Green
*/

var wheelSlotVals	= ["Double",1000,100,50,40,30,20,10];

var wheelSlotColors	= ["yellow","gold","purple","orange","cyan","blue","red","green"];

var wheelStrip = new Array(100);

wheelStrip	= [1,4,2,5,7,6,3,0,4,2,5,6,3,1,4,7,5,6,3,0,4,2,5,6,3,1,4,7,5,2,6,3,0,4,7,5,6,3,1,4,2,5,6,3,0,4,7,5,6,3,1,4,2,5,7,6,3,0,4,2,5,6,3,1,4,7,5,6,3,0,4,2,5,6,3,1,4,7,5,2,6,3,0,4,7,5,6,3,1,4,2,5,6,3,0,4,7,5,6,3];

// Wheel Position and Display
var wheel = [-1,-1,-1,-1,-1];  // Array storing slots for each wheel position: wheel[] = [ top, second, middle (payspot), fourth, bottom ]
var wheelStop;
var wheelTopPos;
var wheelRows = 15;  // Recommend odd values.  Even values will be incremented to the next highest odd integer
var wheelPayRow;
var wheelStop;

// Paytable
// Format: [Reel 1 Symbol, Reel 2 Symbol, Reel 3 Symbol, Payout, Win Name]
// Negative values indicate number of "Wilds" on payline.
// Symbol values 100 and higher indicate symbol groups.
var paytable = new Array();
paytable[0] = [7,7,7,1000,"3 Wilds"];
paytable[1] = [6,5,4,300,"Red 7, White 7, Blue 7"];
paytable[2] = [6,6,6,120,"3 Red Sevens"];
paytable[3] = [5,5,5,100,"3 White Sevens"];
paytable[4] = [4,4,4,80,"3 Blue Sevens"];
paytable[5] = [100,100,100,40,"Any 3 Sevens"];
paytable[6] = [1,2,3,40,"Red Bar, White Bar, Blue Bar"];
paytable[7] = [3,3,3,30,"3 Blue Bars"];
paytable[8] = [2,2,2,20,"3 White Bars"];
paytable[9] = [102,103,104,20,"Any Red, Any White, Any Blue"];
paytable[10] = [1,1,1,10,"3 Red Bars"];
paytable[11] = [101,101,101,5,"Any 3 Bars"];
paytable[12] = [-2,-2,-2,5,"2 Wilds"];
paytable[13] = [102,102,102,2,"Any 3 Reds"];
paytable[14] = [103,103,103,2,"Any 3 Whites"];
paytable[15] = [104,104,104,2,"Any 3 Blues"];
paytable[16] = [-2,-2,-2,2,"1 Wild"];
paytable[17] = [0,0,0,1,"3 Blanks"];
paytable[18] = [-1,-1,8,10,"Spin"];

// Symbol groups
var groups = new Array();
groups[0] = ["Any<br />7",4,5,6];
groups[1] = ["Any<br />Bar",1,2,3];
groups[2] = ["Any<br />Red",1,6];
groups[3] = ["Any<br />White",2,5];
groups[4] = ["Any<br />Blue",3,4];

var payline = new Array(numReels);  // Physical reel stop at payline
var paysym = new Array(numReels);  // Numeric value representing symbol on payline
var paylines = 1;  // Number of paylines.  Must remain set to one.  Included for multiple paylines in the future.

var miscDataType;

// Spin related variables
var spinCount;
var lockSpin = 0;
var spinSteps;
var reelSteps = new Array(numReels);
var possWin;

var wheelPrePay;
var wheelMult;
var wheelSteps;

// Bet related variables
var maxLineBet = 3;
var betLimit = maxLineBet * paylines

var billCredits = 100;
var credits = 0;
var betAmt = 0;
var lastBet = 0;
var lockBtn = 0;
var cashingOut = 0;

var dbgMode = 0;

// Bypass timers to run through spins and payouts instantanously
var dbgRapid = 0;

// Virtual reel debugging
var dbgVReel = 0;
var dbgVReelStops = new Array(numReels);
dbgVReelStops = [10,18,4];  // Default debugging stops: 3 Wilds

// Physical reel debugging
var dbgSpin = 0;
var dbgSpinStops = new Array(numReels);
dbgSpinStops = [3,5,1];  // Default debugging stops: 3 Wilds

// Bonus wheel debugging
var dbgWheel = 0;
var dbgWheelStop;
dbgWheelStop = 7;

var progCnt;
var progVal;

var i;
var s;
var tone;

// Stats
var paidIn = 0;  // Number of credits taken in by machine
var paidOut = 0;  // Number of credits paid out by machine
var paidNet = 0;  // Net gain/lost of machine
var paidPcnt = "";  // Payout percentage
var payouts = new Array(paytable.length + 1);  // Multidimensional array containing number of payouts by win and credits played.
for ( p = 0; p < payouts.length; p++ ) {
	payouts[p] = new Array(maxLineBet);
	for ( c = 0; c < maxLineBet; c++ ) {
		payouts[p][c] = 0;
	}
}

/*
 Cookie Manipulation
*/
var expiry=3650;  // Default number of days before cookies expire

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return parseInt(c.substring(name.length,c.length));
		}
	}
	return 0;
}

// Print Paytable
function printPaytable() {
	var paytext = "";
	var g;
	for (p = 0; p < paytable.length; p++) {
		if ( paytable[p][0] < -1 ) {  // Print payout name for wild-only combinations.
			paytext += '<tr><td width="25" id="pt' + p + 'w0">&nbsp;</td>';
			paytext += '<td align="center" colspan=' + numReels + '>' + paytable[p][ numReels + 1 ] + '</td>';
			for ( c = 1; c <= maxLineBet; c++ ) {
				paytext += '<td id="pt' + p + '" class=c' + c + ' style="fontWeight:normal">' + paytable[p][numReels] * c + '</td>';
			}
			paytext += '<td width="25" id="pt' + p + 'w1">&nbsp;</td></tr>';
		} else {
			paytext += '<tr><td width="25" id="pt' + p + 'w0">&nbsp;</td>';
			for ( s = 0; s < numReels; s++ ) {
				if (paytable[p][s] >= 100 ) {
					var g = paytable[p][s] - 100;
					paytext += '<td align="center">' + groups[g][0] + '</td>';
				} else if ( paytable[p][s] == -1 ) {
					paytext += '<td align="center">*</td>';
				} else {
					symbol = symbols[ paytable[p][s] ];
					paytext += '<td align="center"><image width="25" src=images/'+symbol+'.png /></td>';
				}
			}
			for ( c = 1; c <= maxLineBet; c++ ) {
				if ( p == 0 && c == maxLineBet ) {
					paytext += '<td colspan=2 id="pt' + p + 'c' + c + '"><input type="number" id="progVal" value=' + progVal + ' style="width:5em"></td>';
				} else if ( p == 18 && c == maxLineBet ) {
					paytext += '<td colspan=2 id="pt' + p + 'c' + c + '">' + paytable[p][numReels] * c + ' plus<br />Wheel</td>';
				} else {
					paytext += '<td id="pt' + p + 'c' + c + '" class="c' + c + '">' + paytable[p][numReels] * c + '</td>';
				}
			}
			paytext += '<td width="25" id="pt' + p + 'w1">&nbsp;</td></tr>';
		}
	}
	document.getElementById( "paytable" ).innerHTML=paytext;
}
/*
function printPaytable() {
	var paytext = "";
	for (p = 0; p < paytable.length; p++) {
		paytext += "<tr>";
		for (r = 0; r < numReels; r++) {

		}
		for (c = 1; c <= maxLineBet; c++) {
			
		}
		paytext += "</tr>";
	}
	document.getElementById( "paytable" ).innerHTML=paytext;
}

function populatePaytable() {
	for (p = 0; p < paytable.length; p++) {
		for (r = 0; r < numReels; r++) {
			
		}
		for (c = 1; c <= maxLineBet; c++) {
			
		}
	}
}
*/
function payStats(pmt) {
	if ( pmt > 0 ) {
		paidIn = paidIn + pmt;
	} else {
		paidOut = paidOut - pmt;
	}
	
	paidNet = paidIn - paidOut
	if ( paidIn == 0 ) {
		paidPcnt = "";
	} else {
		paidPcnt = ( paidOut / paidIn ) * 100;
		paidPcnt = (Math.round(paidPcnt * 1000))/1000;
	}
	
	setCookie("paidIn",paidIn,expiry);
	setCookie("paidOut",paidOut,expiry);
	if ( miscDataType == "stats" ) {
		document.getElementById("paidIn").innerHTML=paidIn;
		document.getElementById("paidOut").innerHTML=paidOut;
		document.getElementById("paidNet").innerHTML=paidNet;
		document.getElementById("paidPcnt").innerHTML=paidPcnt;
	}
}

function winStats(w,c) {
	cIndex = c - 1;
	payouts[w][ cIndex ]++;
	setCookie("payouts"+w+"c"+cIndex,payouts[w][ cIndex ],expiry);
	if ( miscDataType == "stats") {
		document.getElementById("payouts"+w+"c"+cIndex).innerHTML=payouts[w][ cIndex ];
	}
}

function resetStats() {
	spinCount = 0;
	setCookie("spinCount",spinCount,expiry);
	document.getElementById("spinCount").innerHTML=spinCount;
	paidIn = 0;
	setCookie("paidIn",paidIn,expiry);
	paidOut = 0;
	setCookie("paidOut",paidOut,expiry);
	payStats(0);
	for ( p = 0; p < payouts.length; p++ ) {
		for ( c = 0; c < maxLineBet; c++) {
			payouts[p][c] = 0;
			setCookie("payouts"+p+"c"+c,+payouts[p][c],expiry);
			document.getElementById("payouts"+p+"c"+c).innerHTML=payouts[p][c];
		}
	}
}

function miscData(value) {
	dbgMode=0;
	dbgSpin=0;
	dbgRapid=0;
	miscDataType=value;
	switch ( miscDataType ) {
	case "none":
		clearMisc();
		break;
	case "stats":
		printStats();
		break;
	case "debug":
		dbgMode = 1;
		printDebug();
		document.getElementById('spinDebug').checked = false;
		document.getElementById('vReelDebug').checked = false;
		document.getElementById('dbgRapid').checked = false;
		break;
	default:
		alert("Error!");
		break;
	}
}

function clearMisc() {
	dbgMode=0;
	dbgSpin=0;
	dbgRapid=0;
	document.getElementById("miscDataTbl").innerHTML="";
}

function printStats() {
	var statsHtml = "";
	statsHtml += '<table>';
	statsHtml += '<tr><td style="width: 15em" /><td colspan='+maxLineBet+'</tr>';
	statsHtml += '<tr><td><div style="text-align:right">Spin Count:</div></td><td id="spinCount" colspan=' + maxLineBet + ' style="text-align:left">' + spinCount + '</td></tr>';
	statsHtml += '<tr><td><div style="text-align:right">Paid In:</div></td><td id="paidIn" colspan=' + maxLineBet + ' style="text-align:left">' + paidIn + '</td></tr>';
	statsHtml += '<tr><td><div style="text-align:right">Paid Out:</div></td><td id="paidOut" colspan=' + maxLineBet + ' style="text-align:left">' + paidOut + '</td></tr>';
	statsHtml += '<tr><td><div style="text-align:right">Net +/-:</div></td><td id="paidNet" colspan=' + maxLineBet + ' style="text-align:left">' + paidNet + '</td></tr>';
	statsHtml += '<tr><td><div style="text-align:right">Percentage:</div></td><td id="paidPcnt" colspan=' + maxLineBet + ' style="width: 5em; text-align:left">' + paidPcnt + '</td></tr>';
	statsHtml += '<tr><td>Payout Type</td>';
	for ( c = 1; c <= maxLineBet; c++) {
		statsHtml = statsHtml + '<td>'+c+'</td>';
	}
	for ( p = 0; p < paytable.length; p++ ) {
		statsHtml += '<tr><td><div style="text-align:left">'+paytable[p][4]+'</div></td>';
		for ( c = 0; c < maxLineBet; c++) {
			statsHtml += '<td id="payouts'+p+'c'+ c +'" style="width:2em">'+payouts[p][c]+'</td>';
		}
		statsHtml += '</tr>';
	}
	statsHtml += '<tr><td><div style="text-align:left">Loss</div></td>'
	for ( c = 0; c < maxLineBet; c++) {
		statsHtml += '<td id="payouts'+paytable.length+'c'+ c +'">'+payouts[paytable.length][c]+'</td>';
	}
	statsHtml += '</tr>';
	statsHtml += '</table>';
	statsHtml += '<button onclick="resetStats()">Reset Stats</button>';
	statsHtml += '<button onclick="progReset()">Reset Progressive</button><br />';
	document.getElementById("miscDataTbl").innerHTML=statsHtml;
}


function printDebug() {
	var debugHtml = "";
	var maxStop = new Array(numReels);
	var maxVStop = new Array(numReels);
	var maxWheelStop = wheelStrip.length - 1;
	
	//Spin Debugging
	debugHtml += '<table><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Rapid Mode: <input type="checkbox" id="dbgRapid" onClick="tgglDbgRapid()" /></td>';
	debugHtml += '</tr><tr>'
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Virtual Reel Debugging: <input type="checkbox" id="vReelDebug" onClick="tgglVReelDbg()" /></td>';
	debugHtml += '</tr><tr>'
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:center">' + r + ': <input type="number" id="dbgVReelStop'+r+'" min=0 max=' + maxVStop[r] + ' value='+dbgVReelStops[r]+' style="width:5em" onInput="setVReelStops('+r+')" /></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Physical Reel Debugging: <input type="checkbox" id="spinDebug" onClick="tgglSpinDbg()" /></td>';
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:center">' + r + ': <input type="number" id="dbgSpinStop'+r+'" min=0 max=' + maxStop[r] + ' value='+dbgSpinStops[r]+' style="width:5em" onInput="setSpinStops('+r+')" /></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Bonus Debugging: <input type="checkbox" id="wheelDebug" onClick="wheelDbg()" /></td>';
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left"><input type="number" id="dbgWheelStop" min=0 max=' + maxWheelStop + ' value='+dbgWheelStop+' style="width:5em" onInput="setWheelStop()" /></td>';
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Virtual Reel Stops:</td>';
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:left"><div id="virtStop' + r + '" style="width:5em">' + r + ": " + virtStop[r] + '</div></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Physical Reel Stops:</td>';
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:left"><div style="width:5em">' + r + ': <span id="reelTopPos' + r + '">' + (reelTopPos[r] + 1) + '</span>&nbsp;-&gt;&nbsp;<span id="reelStop' + r + '"> ' + (reelTopPos[r] + 1) + '</span></div></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Bonus Wheel Stop:</td>';
	debugHtml += '</tr><tr>';
	debugHtml += '<td width=33% style="text-align:left"><div style="width:5em"><span id="wheelTopPos">' + (wheelTopPos + 1) + '</span>&nbsp;-&gt;&nbsp;<span id="wheelStop">' + (wheelTopPos + 1) + '</span></div></td>';
	debugHtml += '</tr><table>';
	document.getElementById("miscDataTbl").innerHTML=debugHtml
}

function tgglSpinDbg() {
	if (document.getElementById('spinDebug').checked) {
		document.getElementById('vReelDebug').checked = false;
		dbgVReel = 0;
		dbgSpin = 1;
	} else {
		dbgSpin = 0;
	}
}

function tgglVReelDbg() {
	if (document.getElementById('vReelDebug').checked) {
		document.getElementById('spinDebug').checked = false;
		dbgSpin = 0;
		dbgVReel = 1;
	} else {
		dbgVReel = 0;
	}
}

function wheelDbg() {
	if (document.getElementById('wheelDebug').checked) {
		dbgWheel = 1;
	} else {
		dbgWheel = 0;
	}
}

function tgglDbgRapid() {
	if (document.getElementById('dbgRapid').checked) {
		dbgRapid = 1;
	} else {
		dbgRapid = 0;
	}
}

function setSpinStops(r) {
	dbgSpinStops[r] = document.getElementById( "dbgSpinStop" + r ).value;
}

function setVReelStops(r) {
	dbgVReelStops[r] = document.getElementById( "dbgVReelStop" + r ).value;
}

function setWheelStop() {
	dbgWheelStop = document.getElementById( "dbgWheelStop" ).value;
}

// Credit related functions
function insertCoin() {
	if ( cashingOut == 1 || lockBtn == 1 ) {
		return;
	} else {
		lockBtn = 1;
		playSound(0);
		setTimeout(function () {
			lockBtn = 0;
			credits++;
			setCookie("credits",credits,expiry)
			betOne();
		}, 750 )
	}
}

function insertBill() {
	if ( cashingOut == 1 || lockBtn == 1 ) {
		return;
	} else {
		clearWin();
		credits = credits + billCredits;
		document.getElementById("credits").value=credits;
		setCookie("credits",credits,expiry);
		playSound(1);
	}
}

function clearWin() {
	for (pt = 0; pt < paytable.length; pt++) {
		for ( w = 0; w < 2; w++ ) {
			document.getElementById("pt" + pt + "w" + w).innerHTML="";
		}
	}
	document.getElementById("win").value="";
	document.getElementById("paid").value="";
	document.getElementById("wintype").innerHTML="";
}

function betOne() {
	var weight;
	if ( lockBtn != 1 ) {
		if ( credits > 0 ) {
			clearWin();
			document.getElementById("gameover").innerHTML=""

			credits--;
			betAmt++;
			payStats(1);
			for (c = 1; c <= maxLineBet; c++) {
				if ( c == betAmt ) {
					weight = "bold";
				} else {
					weight = "normal";
				}
				x = document.getElementsByClassName('c'+c);
				for (i = 0; i < x.length; i++) {
					x[i].style.fontWeight = weight;
				}
			}
			document.getElementById("credits").value=credits;
			playSound(1);
			if ( betAmt >= betLimit ) {
				betAmt = betLimit;
			}
			document.getElementById("betAmt").value=betAmt;
			if ( betAmt == betLimit ) {
				lockBtn = 1;
				setTimeout( function() { spin(); }, 500 );
			}
		}
	}
}

function betMax() {
	if ( betAmt >= betLimit || credits <= 0) {
		return;
	} else {
		betOne();
	}
	setTimeout(function () {
		betMax();
	}, 125 )
}

function cashOut() {
	if ( credits == 0 || cashingOut == 1 || betAmt != 0 || lockBtn == 1 ) {
		return;
	} else {
		cashingOut = 1;
		lastBet = 0;
		playSound(11);
		setTimeout(function () {
			document.getElementById("paid").value=credits;
			credits = 0;
			setCookie("credits",credits,expiry)
			document.getElementById("credits").value=credits;
			cashingOut = 0;
		}, 4250 );
	}
}

/*
 Reel-related Functions
*/

// Generate virtual reels
function initVReels() {
	for ( r = 0; r < numReels; r++ ) {
		var vReelLen = 0;
		// Count total number of stops for each virtual reel.
		for ( n = 0; n < numVirtStops[r].length; n++ ) {
			for ( s = 0; s < numVirtStops[r][n]; s++ ) {
				vReelLen++;
			}
		}
		var vStop = 0;	// Element number for stops in virtual reels
		
		virtReel[r] = new Array(vReelLen);	// Create new array for each virtual reel.
		
		// Generate virtual reel
		for ( n = 0; n < numVirtStops[r].length; n++ ) {
			for ( s = 0; s < numVirtStops[r][n]; s++ ) {	
				virtReel[r][vStop] = n;
				vStop++;
			}
		}
	}
}

// Set random starting position for physical reels
function initReels() {
	for ( r = 0; r < numReels; r++ ) {
		reelTopPos[r] = Math.floor(Math.random() * strip[r].length)
		setReel(r);
	}
}

// Advance reels by one step.
function advReel(minSpin) {
	for ( r = minSpin; r < numReels; r++ ) {
		reelTopPos[r]++;
		if ( reelTopPos[r] > strip[r].length - 1 ) {
			reelTopPos[r] = 0
		}
		if ( reelTopPos[r] + 1 > strip[r].length - 1 ) {
			rPos = reelTopPos[r] + 1 - strip[r].length
		} else {
			rPos = reelTopPos[r] + 1
		}
		if ( dbgMode == 1 ) {
			document.getElementById("reelTopPos" + r).innerHTML=rPos
		}
		setReel(r);
	}
}

function setReel(r) {
	for ( p = 0; p < numReelPos; p++ ) {
		stopNum = reelTopPos[r] + p;
		if ( stopNum > strip[r].length - 1 ) {
			stopNum = stopNum - strip[r].length;
		}
		reel[r][p] = strip[r][stopNum];
	}
	payline[r] = reel[r][1];
	drawReel(r);
}

// Place symbol images onto playfield according to symbol values in reel[r]
function drawReel(r) {
	for ( p = 0; p < numReelPos; p++ ) {
		symbol = symbols[reel[r][p]];
		document.getElementById( "r" + r + "p" + p ).innerHTML='<image width="100" src=images/' + symbol + '.png />';
	}
}

// Spin related functions

function startGame() {
	if ( credits == 0 && betAmt == 0 || lockSpin == 1 ) {
		return;
	}
	if ( betAmt == 0 ) {
		rebet();
	} else {
		spin();
	}
}

function rebet() {
	if ( lockSpin == 1 || lastBet == 0) {
		return;
	}
	if ( credits <= 0) {
		return;
	} else {
		betOne();
		if ( betAmt == lastBet ) {
			spin();
		} else {
			setTimeout(function () {
				rebet();
			}, 125 )
		}
	}
}

function spin() {
	if ( lockSpin == 1 || betAmt <= 0) {
		return;
	}
	lockSpin = 1;
	lockBtn = 1;
	spinCount++;
	if ( miscDataType == "stats") {
		document.getElementById("spinCount").innerHTML=spinCount;
	}
	setCookie("spinCount",spinCount,expiry);
	setCookie("credits",credits,expiry);
	progInc(betAmt);
	spinSteps = 0;
	possWin = 1;
	for ( r = 0; r < numReels; r++ ) {
		spinSteps += Math.floor(Math.random() * strip[r].length) + strip[r].length;
		reelSteps[r] = spinSteps;
		if ( dbgSpin == 1 ) {
			reelStop[r] = dbgSpinStops[r];
		} else {
			if ( dbgVReel == 1 ) {
				virtStop[r] = dbgVReelStops[r];
			} else {
				virtStop[r] = Math.floor(Math.random() * virtReel[r].length);
			}
			reelStop[r] = virtReel[r][virtStop[r]];
		}
		if ( dbgMode == 1 ) {
			document.getElementById("virtStop" + r ).innerHTML=virtStop[r];
			document.getElementById("reelStop" + r ).innerHTML=reelStop[r];
		}
	}
	spinSteps = 0;
	if ( dbgRapid == 1 ) {
		rapidSpin();
	} else {
		spinLoop(0);
	}
}

function rapidSpin() {
	for ( r = 0; r < numReels; r++ ) {
		var topPos = reelStop[r] - 1;
		if ( topPos < 0 ) {
			topPos = strip[r].length - 1
		}
		reelTopPos[r] = topPos;
		setReel(r);
	}
	setTimeout(function () {
		checkNudge();
	}, 100 );
}

function spinLoop(minSpin) {
	var topPos = reelStop[minSpin] - 1;
	if ( topPos < 0 ) {
		topPos = strip[minSpin].length - 1
	}
	if ( spinSteps < reelSteps[minSpin] || reelTopPos[minSpin] != topPos ) {
		advReel(minSpin);
	} else {
		playSound(6);
		if ( possWin == 1 ) {
			if ( payline[minSpin] == 7 ) {
				playSound(minSpin+7);
			} else {
				possWin = 0;
			}
		}
		minSpin++
	
	}
	
	if ( spinSteps % 5 == 0 ) {
		playSound(  Math.floor(Math.random() * 4) + 2  );
	}
	spinSteps++;

	var looptime; 
	if ( minSpin >= numReels ) {
			checkNudge();
	} else {
		setTimeout(function () {
			spinLoop(minSpin);
		}, 20 );
	}
}

function checkNudge() {
	var nudge = 0;
	for ( r = 0; r < numReels; r++ ) {
		nudgeVal[r] = 0;
		if ( payline[r] != 0 ) { continue; }
		var nudgePos = ( Math.floor(Math.random() * numReelPos));
		if ( nudgePos == 1 ) { continue; }
		var nudgeSym = reel[r][nudgePos];
		var nudgeProb = Math.floor( Math.random() * nudgeOdds[nudgeSym] );
		if ( nudgeProb  == 0 ) {
			nudgeVal[r] = nudgePos - 1
			nudge++;
		}
		
	}
	if ( dbgRapid == 1 ) {
		looptime = 100;
	} else {
		looptime = 250;
	}
	if ( nudge > 0 ) {
		setTimeout(function() {
			doNudge(0);
		}, looptime)
	} else {
		setTimeout(function() {
			checkPayline();
		}, looptime)
	}
}

/*
function doNudge(reel) {
	if (nudgeVal[reel] != 0) {
		reelTopPos[reel] += nudgeVal[reel];
		if ( reelTopPos[reel] > 21 ) {
			reelTopPos[reel] = 0
		}
		if ( reelTopPos[reel] < 0 ) {
			reelTopPos[reel] = 21
		}
		setReel(reel);
		playSound(6);
	}
	reel++
	if ( reel == numReels ){
		checkPayline();
	} else {
		setTimeout(function () {
			doNudge(reel);
		}, 250 )
	}
}
*/

function doNudge() {
	for ( r = 0; r < numReels; r++ ) {
		var reelNum = r;
		if ( nudgeVal[reelNum] != 0 ) {
			reelTopPos[r] += nudgeVal[r];
			setReel(r);
			playSound(6);
			nudgeVal[reelNum] = 0;
			break;
		}
	}
	if ( dbgRapid == 1 ) {
		looptime = 100;
	} else {
		looptime = 250;
	}
	
	if ( reelNum == numReels - 1 ){
		setTimeout(function () {
			checkPayline();
		}, looptime )
	} else {
		setTimeout(function () {
			doNudge(reel);
		}, looptime )
	}
}

function checkPayline() {
	var wilds = 0;
	var matches;
	var gnum;
	var wintype = -1;
	var doSpin = 0;
	for (r = 0; r < numReels; r++) {
		if (payline[r] == 7) {
			wilds++;
		}
	}
	if ( payline[2] == 8 ) {
		doSpin = 1;
	}
	for (p = 0; p < paytable.length; p++) {
		match = 0;
		if (p == 18 && doSpin == 1 ) {
			wintype = p;
		}
		if ((p == 12 && wilds == 2) || (p == 16 && wilds == 1)) { // Any Wilds
			wintype = p;
		} else {
			for (r = 0; r < numReels; r++) {
				paysym[r] = paytable[p][r];
			}

			for (r = 0; r < numReels; r++) {
				if (paysym[r] < 100) {
					if (payline[r] == paysym[r] || payline[r] == 7) {
						if (r == 2) {
							wintype = p;
							p = paytable.length;
							break;	
						} else {
							continue;
						}
					} else {
						break;
					}
				} else {
					gnum = paysym[r] - 100;
					for ( i = 1; i < groups[gnum].length; i++) {
						if (payline[r] == groups[gnum][i] || payline[r] == 7) {
							match++;
							if (r == numReels - 1 && match == numReels) {
								wintype = p;
								p = paytable.length;
							}
							break;
						}
					}
				}
			}
		}
	}
	if ( wintype >= 0 ) {
		for ( w = 0; w < 2; w++ ) {
			if ( w == 0) {
				document.getElementById("pt" + wintype + "w" + w).innerHTML="-->";
			} else {
				document.getElementById("pt" + wintype + "w" + w).innerHTML="<--";
			}
		}
		if ( wintype == 0 && betAmt == maxLineBet) {
			payout = progVal;
		} else {
			payout = paytable[wintype][3];
			payout *= betAmt;
		}
		if ( wintype != 0 && wintype != 12 && wintype != 16 && wintype != 18 ) {
			payout *= Math.pow(2, wilds);
		}
		if ( wintype == 18 && betAmt == betLimit) {
			doBonusSpin(payout,wilds);
		} else {
			payWin( wintype, payout, 0, 0 );
		}
	} else {
		winStats( paytable.length, betAmt );
		endGame();
	}
}

/*
 Bonus Game
*/

// Set random starting position for bonus wheel

function initWheel() {
	wheelMult = 0;
	if ( wheelRows % 2 == 0 ) {
		wheelRows++
	}
	wheelPayRow = ( wheelRows - 1 ) / 2;
	wheelTopPos = Math.floor(Math.random() * wheelStrip.length)
	printWheel();
	document.getElementById("wheelmult").innerHTML=wheelMult;
	setWheel();
}

function printWheel() {
	wheeltext = ""
	wheeltext += "<tr><td /><td width=200 /><td /></tr>"
	for ( row = 0; row < wheelRows; row++ ) {
		wheeltext += "<tr><td id='wp"+row+"c0'><td id='wp"+row+"'></td><td id='wp"+row+"c1'></td></tr>";
	}
	document.getElementById("bonusWheel").innerHTML=wheeltext;
	for ( c = 0; c < 2; c++ ) {
		if ( c == 0) {
			document.getElementById("wp" + wheelPayRow + "c" + c).innerHTML="-->";
		} else {
			document.getElementById("wp" + wheelPayRow + "c" + c).innerHTML="<--";
		}
	}
}

function advWheel() {
	wheelTopPos++;
	if ( wheelTopPos > wheelStrip.length - 1 ) {
		wheelTopPos = 0
	}
	if ( wheelTopPos + wheelPayRow > wheelStrip.length - 1 ) {
		wPos = wheelTopPos + wheelPayRow - wheelStrip.length
	} else {
		wPos = wheelTopPos + wheelPayRow
	}
	document.getElementById("wheelTopPos").innerHTML=wPos
	playSound(20);
	setWheel();
}

function setWheel() {
	for ( p = 0; p < wheelRows; p++ ) {
		stopNum = wheelTopPos + p;
		if ( stopNum > wheelStrip.length - 1 ) {
			stopNum = stopNum - wheelStrip.length;
		}
		wheel[p] = wheelStrip[stopNum];
	}
	drawWheel();
}

function drawWheel() {
	for ( p = 0; p < wheelRows; p++ ) {
		slotVal = wheelSlotVals[wheel[p]];
		slotColor = wheelSlotColors[wheel[p]];
		document.getElementById( "wp" + p ).innerHTML=slotVal;
		document.getElementById( "wp" + p ).style.backgroundColor=slotColor;
	}
}

function doBonusSpin(prepay,mult) {
	wheelPrePay = prepay;
	wheelMult = mult;
	wheelSpin();
}

function wheelSpin() {
	spinSteps = 0;
	document.getElementById("wheelmult").innerHTML=Math.pow(2, wheelMult)
	wheelSteps = Math.floor(Math.random() * wheelStrip.length) + wheelStrip.length;
	if ( dbgWheel == 1 ) {
		wheelStop = dbgWheelStop;
	} else {
		wheelStop = Math.floor(Math.random() * wheelStrip.length);
	}
	if ( dbgMode == 1 ) {
		document.getElementById("wheelStop").innerHTML=wheelStop;
	}
	wheelLoop();
}

function wheelLoop() {
	var topPos = wheelStop - wheelPayRow;
	if ( topPos < 0 ) {
		topPos = wheelStrip.length - 1
	}
	if ( spinSteps < wheelSteps || wheelTopPos != topPos ) {
		advWheel();
		spinSteps++;
		if ( spinSteps < wheelSteps ) {
			loopTime = 50;
		} else {
			loopTime = 100;
		}
		setTimeout(function () {
			wheelLoop();
		}, loopTime );
	} else {
		endWheel();
	}
}

function endWheel() {
	payslot = wheel[wheelPayRow];
	if ( payslot == 0 ) {
		payout *= 2
	}
	wheelPay = wheelSlotVals[payslot];
	if ( wheelPay  == "Double" ) {
		wheelMult++
		setTimeout(function () {
			wheelSpin()
		}, 500)
	} else {
		payout = ( wheelPrePay + wheelPay ) * Math.pow(2, wheelMult);
		winStats( 18, betAmt );
		payWin(18,payout,0,0)
	}
}

function payWin(wintype,payout,i,paySound) {
	var loopTime;
	document.getElementById("win").value=payout;
	
	if (payout >= 300) {
		loopTime = 25;
	} else {
		loopTime = 100;
	}
	if ( wintype == 0 && betAmt == maxLineBet) {
		jackpot(0);
		return;
	} else {
		if ( loopTime == 25 ) {
			if ( i % 4 == 0 ) {
				playSound("paySound" + paySound);
				paySound++;
			}
		} else {
			playSound("paySound" + paySound);
			paySound++;
		}
		if (paySound == paySounds ) { paySound = 0; }
	}
	
	i++;
	credits++
	setCookie("credits",credits,expiry);
	document.getElementById("paid").value=i;
	document.getElementById("credits").value=credits;
	payStats(-1);

	if ( dbgRapid == 1 ) {
		loopTime = 0;
	}

	setTimeout(function () {
		if (i < payout) {
			payWin(wintype,payout,i,paySound);
		} else {
			document.getElementById("wintype").innerHTML="<marquee>"+paytable[wintype][4]+"</marquee>";
			endGame();
		}
	}, loopTime);
}

/*
 End Game
*/

function endGame() {
	lastBet = betAmt;
	lockSpin = 0;
	lockBtn = 0;
	betAmt = 0;
	document.getElementById("betAmt").value=betAmt;
	document.getElementById("gameover").innerHTML="<blink>Game Over</blink>";
}

function jackpot(c) {
	playSound(10);
	if ( c < 9 ) {
		c++;
		setTimeout(function () {
			jackpot(c);
		}, 625);
	} else {
		setTimeout(function () {
			lastBet = betAmt;
			lockSpin = 0;
			lockBtn = 0;
			betAmt = 0;
			credits += progVal;
			setCookie("credits",credits,expiry)
			payStats(-(progVal));
			document.getElementById("paid").value=progVal;
			document.getElementById("credits").value=credits;
			document.getElementById("betAmt").value=betAmt;
			progReset();
		}, 625)
	}
}

function progInc (steps) {
	for ( i = 0; i < steps; i++ ) {
		progCnt++
		if ( progCnt == 5 ) {
			progCnt = 0;
			progVal++;
			setCookie("progVal",progVal,expiry);
			document.getElementById("progVal").value=progVal;
		}
	}
}

function progInit() {
	if (progVal == 0) {
		progCnt = 0;
		progVal = paytable[0][numReels] * maxLineBet * 5/3;
		setCookie("progCnt",progCnt,expiry)
		setCookie("progVal",progVal,expiry)
		document.getElementById("progVal").value=progVal;
	}
}

function progReset() {
	progCnt = 0;
	progVal = 0;
	progInit();
}

function cookieRestore() {
	spinCount=getCookie("spinCount");
	credits=getCookie("credits");
	paidIn=getCookie("paidIn");
	paidOut=getCookie("paidOut");
	progCnt=getCookie("progCnt");
	progVal=getCookie("progVal");
	for ( p = 0; p<paytable.length; p++ ) {
		for ( c = 0; c<maxLineBet; c++ ) {
			payouts[p][c] = getCookie("payouts"+p+"c"+c);
		}
	}
}

function init() {
	var spinnum;
	var symbol;
	var symnum;
	var miscDataType="none";
	preloadSound();
	printPaytable();
	initVReels();
	initReels();
	initWheel()
	clearWin(0);
	cookieRestore();
	progInit();
	clearMisc();
	payStats(0);
	document.getElementById("credits").value=credits;
	document.getElementById("betAmt").value=betAmt;
	document.getElementById("progVal").value=progVal;
	document.getElementById("gameover").innerHTML="Game Over";
	document.getElementById("maxcred").innerHTML="Play " + betLimit + " Credits";
	document.getElementById("miscDataNone").selected = true;
}

/*
	jQuery Functions
*/

$(window).keypress(function(e){
	var code = e.which || e.keyCode;
	switch ( code )
	{
	case 49:
		betOne();
		return false;
	case 50:
		startGame();
		return false;
	case 51:
		betMax();
		return false;
	case 52:
		insertCoin();
		return false;
	case 53:
		cashOut();
		return false;
	case 54:
		insertBill();
		return false;
	default:
		break;
	}
});

/*
	SoundJS Functions
*/

var sounds = ["insertCoin","coinBong","4C","4E","4G","5C","reelStop","possWin0","possWin1","possWin2","jackpot","cashOut","scatter1","scatter2","scatter3","bonusWin","bonusHit1","bonusHit2","bonusHit3","spinWheel","wheelTick"];

var paySounds = 33;

function preloadSound() {
	for ( sIndex = 0; sIndex < sounds.length; sIndex++ ) {
		createjs.Sound.registerSound({id:sIndex, src:"sounds/" + sounds[sIndex] + ".wav"});
	};
	for ( pIndex = 0; pIndex < paySounds; pIndex++ ) {
		createjs.Sound.registerSound({id:"paySound" + pIndex, src:"sounds/payOut/paySound" + pIndex + ".wav"});
	};
}

function playSound(sIndex) {
	/*
		sounds sIndex Values:
		0: insertCoin
		1: coinBong
		2: 4C
		3: 4E
		4: 4G
		5: 5C
		6: reelStop
		7: possWin0
		8: possWin1
		9: possWin2
		10: jackpot
		11: cashout
		12: scatter1
		13: scatter2
		14: scatter3
		15: bonusWin
		16: bonusHit1
		17: bonusHit2
		18: bonusHit3
		19: spinWheel
		20: wheelTick
	*/

	createjs.Sound.play(sIndex)
}
