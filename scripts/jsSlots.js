/** @license
 *
 * @source: https://github.com/anizaeger/jsSlots
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 *
 * Copyright (C) 2016-2017 Anakin-Marc Zaeger
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
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

function gplAlert() {
	var copyTxt = "";
	copyTxt += "Copyright (C) 2016-2017 Anakin-Marc Zaeger\n"
	copyTxt += "\n"
	copyTxt += "\n"
	copyTxt += "The JavaScript code in this page is free software: you can\n"
	copyTxt += "redistribute it and/or modify it under the terms of the GNU\n"
	copyTxt += "General Public License (GNU GPL) as published by the Free Software\n"
	copyTxt += "Foundation, either version 3 of the License, or (at your option)\n"
	copyTxt += "any later version.  The code is distributed WITHOUT ANY WARRANTY;\n"
	copyTxt += "without even the implied warranty of MERCHANTABILITY or FITNESS\n"
	copyTxt += "FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.\n"
	copyTxt += "\n"
	copyTxt += "As additional permission under GNU GPL version 3 section 7, you\n"
	copyTxt += "may distribute non-source (e.g., minimized or compacted) forms of\n"
	copyTxt += "that code without the copy of the GNU GPL normally required by\n"
	copyTxt += "section 4, provided you include this license notice and a URL\n"
	copyTxt += "through which recipients can access the Corresponding Source.\n"
	window.alert(copyTxt)
}

/*
 *	Configuration
 */

// Number of cells in message ticker.
// [Default: 40]
var tickerCells = 45;

// Milliseconds between ticker steps.
// [Default: 250]
var tickerTime = 250;

// Number of 32 bit random seeds to generate.  These will be XORed together to generate the final seed.
// [Default: 10]
var numSeeds = 10;

// Default number of credits when inserting bill.
// [Defaut: 100]
var billCredits = 100;

// Default max line bet.
// [Default: 3]
var maxLineBet = 3;

// Maximum jackpot payout.
// [Default: 100000]
var maxProg = 100000;

// Width of bonus wheel.
// [Default: 150]
var wheelWidth = 150;

// Number of rows to display on bonus wheel.  Even values will be incremented to the next odd integer.
// [Default: 9]
var wheelRows = 9;

// Number of times for wheel to land on double before winning progressive times wild multiplier, or maxProg, whichever is less.
// [Default: 5]
var wheelProg = 5;

// Size, in pixels, of reel symbols.
// [Default: 150]
var symSize = 150;

// Paytable icon size.
// [Default: 25]
var payIcoSize = 25;

// Time in milliseconds between spin steps.  Must be between 10 and 100.
// [Default: 55]
var spinSpeed = 55;

// Default virtual reel debugging stops.
// [Default: 10,18,4; 3 Wilds]
var dbgVReelStops = [10,18,4];

// Default physical reel debugging stops.
// [Default: 3,5,1; 3 Wilds]
var dbgSpinStops = [3,5,1];

// Default bonus wheel debugging stop.
// [Default: 7; Double]
var dbgWheelStop = 7;

/*
 *	Constants
 */

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

// Reel symbol names.
var symName = ["Blank", "Red Bar", "White Bar", "Blue Bar", "Blue 7", "White 7", "Red 7", "Wild", "Spin"]

// Image filename for symbols, not including file extension.  Must be PNG format, and in images subdirectory.  Index number is symbol ID.
var symbols = ["blank","BR", "BW", "BB", "7B", "7W", "7R", "Wild", "Spin"];

var groups = new Array();
groups[0] = [4,5,6];	// Any 7
groups[1] = [1,2,3];	// Any Bar
groups[2] = [1,6];	// Any Red
groups[3] = [2,5];	// Any White
groups[4] = [3,4];	// Any Blue

// Symbol-group names.
var grpName = ["Any 7", "Any Bar", "Any Red", "Any White", "Any Blue"]

// Paytable image filename for groups, not including file extension.  Must be PNG format, and in images subdirectory.  Index number is group ID.
var grpSym = ["7A", "BA", "Red", "White", "Blue"];

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

var strip = new Array();  // Phys. reels
var numVirtStops = new Array();  // Virt. reels

// Reel Stop		   0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2
// Numbers		   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1

strip[0] 		= [0,4,0,7,0,3,0,5,0,2,0,4,0,1,0,5,0,3,0,6,0,2];
numVirtStops[0]		= [4,1,5,1,6,3,4,1,3,2,5,1,3,6,4,1,5,3,5,1,5,3];

strip[1] 		= [0,4,0,1,0,7,0,6,0,3,0,4,0,1,0,5,0,3,0,6,0,2];
numVirtStops[1]		= [4,1,4,4,5,1,7,1,5,3,3,1,3,4,3,1,3,4,5,1,5,4];

strip[2] 		= [0,7,0,1,0,5,0,3,0,2,0,4,0,8,0,5,0,3,0,6,0,2];
numVirtStops[2]		= [4,1,6,9,3,1,3,3,2,4,4,2,4,1,5,1,3,2,5,1,3,5];

// Odds of symbol nudging to  payline space if selected, in symbols[] order
var nudgeOdds = [0,1,2,3,10,20,30,100,50]

/*
	Script follows
*/

var numReels = strip.length;  // Number of reels
var virtReel = new Array(numReels);  // Auto-generated virtual reels.
var virtStop = new Array(numReels);  // Stop position for virtual reel.  Randomly-selected at spin.

var nudgeVal = new Array(numReels);  // Direction, if any, to nudge reels.


// Reels and Positions
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
var wheelTopPos;
var wheelPayRow;
var wheelStop = new Array(wheelProg);

var doWheel;
var wheelRun;

/*
	Symbol Group Legend
		0: Any 7
		1: Any Bar
		2: Any Red
		3: Any White
		4: Any Blue
		
*/

// Paytable
// Format: [Reel 1 Symbol, Reel 2 Symbol, Reel 3 Symbol, Payout, Win Name]
// Negative values indicate number of "Wilds" on payline.
// Symbol values 100 and higher indicate symbol groups.
var paytable = new Array();
paytable[0] = [7,7,7,1000,"3 Wilds"];
paytable[1] = [6,5,4,300,"Red, White, & Blue 7s"];
paytable[2] = [6,6,6,120,"3 Red Sevens"];
paytable[3] = [5,5,5,100,"3 White Sevens"];
paytable[4] = [4,4,4,80,"3 Blue Sevens"];
paytable[5] = [100,100,100,40,"3 Sevens"];
paytable[6] = [1,2,3,40,"Red, White, & Blue Bars"];
paytable[7] = [3,3,3,30,"3 Blue Bars"];
paytable[8] = [2,2,2,20,"3 White Bars"];
paytable[9] = [102,103,104,20,"Red, White, & Blue"];
paytable[10] = [1,1,1,10,"3 Red Bars"];
paytable[11] = [101,101,101,5,"3 Bars"];
paytable[12] = [-2,-2,-2,5,"2 Wilds"];
paytable[13] = [102,102,102,2,"3 Reds"];
paytable[14] = [103,103,103,2,"3 Whites"];
paytable[15] = [104,104,104,2,"3 Blues"];
paytable[16] = [-1,-1,-1,2,"1 Wild"];
paytable[17] = [0,0,0,1,"3 Blanks"];
paytable[18] = ["-","-",8,10,"Spin"];

var payline = new Array(numReels);	// Physical reel stop at payline
var paySym = new Array(numReels);	// Numeric value representing symbol on payline
var paylines = 1;			// Number of paylines.  Must remain set to one.  Included for multiple paylines in the future
var payout;
var payingOut;				// Machine is currently paying out a prize.

var miscDataType;

// Spin related variables
var spinCount;
var lockSpin = 0;
var spinSteps;
var reelSteps = new Array(numReels);
var possWin;

var wheelPrePay;
var wheelPreMult;
var wheelMult;
var wheelSteps;

// Random Numbers
// Raw random numbers utilized by the game.

var rndReel = new Array(numReels);		// Reel stop randomizer
var rndNudgePos = new Array(numReels);		// Nudge position randomizer
var rndNudgeSym = new Array(numReels);		// Symbol nudge probability randomizer
var rndWheel = new Array(wheelProg);		// Bonus wheel randomizer

// Bet related variables
var betLimit = maxLineBet * paylines

var credits = 0;
var betAmt = 0;
var lastBet = 0;
var lockBtn = 0;
var cashingOut = 0;
var reBet = 0;

var dbgMode = 0;
var rndDisp = 0;

// Bypass timers to run through spins and payouts instantanously
var dbgRapid = 0;

// Virtual reel debugging
var dbgVReel = 0;

// Physical reel debugging
var dbgSpin = 0;

// Bonus wheel debugging
var dbgWheel = 0;

var progCnt;
var progVal;

var i;
var s;

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
			return parseInt(c.substring(name.length,c.length),10);
		}
	}
	return 0;
}

// Print Paytable
function printPaytable() {
	var paytext = "";
	var g;
	for (p = 0; p < paytable.length; p++) {
		paytext += '<tr id="payRow' + p + '">';
		if ( paytable[p][0] < 0 ) {  // Print payout name for wild-only combinations.
			paytext += '<td class=payCell valign=middle colspan=' + ( numReels - 1 ) + '>Any ' + Math.abs( paytable[p][0] ) + '</td>';
			paytext += '<td class=payCell><image width="' + payIcoSize + '" src=images/Wild.png /></td>';
		} else {
			for ( s = 0; s < numReels; s++ ) {
				if (paytable[p][s] >= 100 ) {
					var g = paytable[p][s] - 100;
					paytext += '<td class=payCell><image width="' + payIcoSize + '" src=images/' + grpSym[g] + '.png /></td>';
				} else if ( paytable[p][s] === "-" ) {
					paytext += '<td class=payCell valign=middle>-</td>';
				} else if ( paytable[p][s] == 0 ) {
					paytext += '<td class=payCell><image width="' + payIcoSize + '" src=images/blankico.png /></td>';
				} else {
					symbol = symbols[ paytable[p][s] ];
					paytext += '<td class=payCell><image width="' + payIcoSize + '" src=images/'+symbol+'.png /></td>';
				}
			}
		}
		for ( c = 1; c <= maxLineBet; c++ ) {
			if ( p == 0 && c == maxLineBet ) {
				paytext += '<td class="c' + c + ' payCell" id="pt' + p + 'c' + c + '" colspan=2 style="text-align:left;">Jackpot!</td>';
			} else if ( p == 18 && c == maxLineBet ) {
				paytext += '<td class="c' + c + ' payCell" id="pt' + p + 'c' + c + '" colspan=2 style="text-align:left;">SPIN</td>';
			} else {
				paytext += '<td class="c' + c + ' payCell" id="pt' + p + 'c' + c + '" width=32>' + paytable[p][numReels] * c + '</td>';
				if ( c == maxLineBet ) {
					paytext += '<td />';
				}
			}
		}
		paytext += '</tr>';
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
	if ( dbgSpin == 1 || dbgVReel == 1 ) { return ; }
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
	}
	
	setCookie("paidIn",paidIn,expiry);
	setCookie("paidOut",paidOut,expiry);
	if ( miscDataType == "stats" ) {
		document.getElementById("paidIn").innerHTML=paidIn;
		document.getElementById("paidOut").innerHTML=paidOut;
		document.getElementById("paidNet").innerHTML=paidNet;
		document.getElementById("paidPcnt").innerHTML=((Math.round(paidPcnt * 1000))/1000);
	}
}

function winStats(w,c) {
	if ( dbgSpin == 1 || dbgVReel == 1 ) { return; }
	var cIndex = c - 1;
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

/*
	Symbol Odds Calculation
*/

var numVirtReelStops = new Array(numReels);
var symsNums = new Array(symbols.length);
var symsOdds = new Array(symbols.length);
var grpNums = new Array(groups.length);
var grpOdds = new Array(groups.length);

function initSymOdds() {
	for ( r = 0; r < numReels; r++ ) {
		numVirtReelStops[r] = virtReel[r].length;
	}
	for ( symnum = 0; symnum < symbols.length; symnum++) {
		symsNums[symnum] = new Array(numReels)
		symsOdds[symnum] = new Array(numReels)
		for ( r = 0; r < numReels; r++ ) {
			symsNums[symnum][r] = 0;
			for ( s = 0; s < strip[r].length; s++ ) {
				if ( strip[r][s] == symnum || ( strip[r][s] == 7 && symnum != 0 && symnum != 8 )) {
					symsNums[symnum][r] += numVirtStops[r][s]
				}
			}
			symsOdds[symnum][r] = symsNums[symnum][r] / numVirtReelStops[r]
		}
	}
	
	for ( grpnum = 0; grpnum < groups.length; grpnum++ ) {
		grpNums[grpnum] = new Array(groups[grpnum].length)
		grpOdds[grpnum] = new Array(groups[grpnum].length)
		for ( r = 0; r < numReels; r++ ) {
			grpNums[grpnum][r] = 0;
			grpOdds[grpnum][r] = 0;
			for ( s = 0; s < groups[grpnum].length; s++) {
				grpNums[grpnum][r] += symsNums[groups[grpnum][s]][r]
				grpOdds[grpnum][r] += symsOdds[groups[grpnum][s]][r]
			}
		}
	}
}

var payOdds = new Array(paytable.length);
var payPcnt = new Array(paytable.length);

function initPayOdds() {
	for ( p = 0; p < paytable.length; p++ ) {
		payOdds[p] = 1;
		for ( r = 0; r < numReels; r++ ) {
			s = paytable[p][r]
			if ( !( isNaN( s ))){
				if ( s > 99 ) {
					payOdds[p] *= grpOdds[s - 100][r]
				} else if ( s < 0 ) {
					payOdds[p] = Math.pow(symsOdds[7][0],Math.abs( s ))
				} else {
					payOdds[p] *= symsOdds[s][r]
				}
				payPcnt[p] = payOdds[p] * paytable[p][numReels];
			}
		}
	}
	return;
}

function printSymOdds() {
	var symOddsHtml = '';

	symOddsHtml += '<tr><td><table>'
	symOddsHtml += '<tr><td colspan=' + ( numReels * 2 + 1 ) + '>Number of vReel stops: </td></tr>';
	symOddsHtml += '<tr>';
	for ( r = 0; r < numReels; r++ ) {
		symOddsHtml += '<td>' + numVirtReelStops[r] + '</td>';
	}
	symOddsHtml += '</tr>';
	symOddsHtml += '</table></td></tr>';
	symOddsHtml += '<tr><td valign=top><table>';
	symOddsHtml += '<tr><td>Symbols:</td></tr>';
	for ( s = 0; s < symbols.length; s++ ) {
		symOddsHtml += '<tr>';
		symbol = symbols[s];
		if ( s == 0 ) {
			symOddsHtml += '<td align="center"><image width="' + payIcoSize + '" src=images/blankico.png /></td>';
		} else {
			symOddsHtml += '<td align="center"><image width="' + payIcoSize + '" src=images/'+symbol+'.png /></td>';
		}
		for ( r = 0; r < numReels; r++ ) {
			symOddsHtml += '<td>' + symsNums[s][r] + ':' + numVirtReelStops[r] + '<br />' + ( Math.round( symsOdds[s][r] * 10000) / 100 ) + '%</td>';
		}
		symOddsHtml += '</tr>';
	}	
	symOddsHtml += '</table><table>'
	symOddsHtml += '<tr><td>Groups:</td></tr>';
	for ( g = 0; g < groups.length; g++ ) {
		symOddsHtml += '<tr>';
		group = grpSym[g];
		symOddsHtml += '<td align="center"><image width="' + payIcoSize + '" src=images/'+group+'.png /></td>';
		for ( r = 0; r < numReels; r++ ) {
			symOddsHtml += '<td>' + grpNums[g][r] + ':' + numVirtReelStops[r] + '<br />' + ( Math.round( grpOdds[g][r] * 10000) / 100 ) + '%</td>';
		}
		symOddsHtml += '</tr>';
	}
	symOddsHtml += '</tr></table></td></tr>';
	document.getElementById("miscDataTbl").innerHTML=symOddsHtml;
}

function printPayOdds() {
	var payOddsHtml = "";
	for ( p = 0; p < paytable.length; p++ ) {
		payOddsHtml += '<tr>';
		payOddsHtml += '<td>' + paytable[p][4] + '&nbsp;</td>';
		payOddsHtml += '<td>&nbsp;' + ( Math.round( payOdds[p] * 10000000) / 100000 ) + '%</td>'
		payOddsHtml += '</tr>';
	}
	document.getElementById("miscDataTbl").innerHTML=payOddsHtml;
}

function miscData(value) {
	dbgMode=0;
	dbgSpin=0;
	dbgRapid=0;
	rndDisp=0;
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
	case "rndDisp":
		rndDisp = 1;
		printRnd();
		break;
	case "symOdds":
		printSymOdds();
		break;
	case "payOdds":
		printPayOdds();
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
	rndDisp=0;
	var miscHtml="";
	miscHtml += '<tr><td>&nbsp;</td></tr>'
	document.getElementById("miscDataTbl").innerHTML=miscHtml;
}

function printStats() {
	var statsHtml = "";
	statsHtml += '<tr><td style="width: 15em" /><td colspan=' + maxLineBet + '/></tr>';
	statsHtml += '<tr><td colspan=' + ( maxLineBet + 1 ) + '>';
	statsHtml += '<table width=100%>';
	statsHtml += '<tr><td width=50% /><td width=50% /></tr>';
	statsHtml += '<tr><td valign=top style="text-align:right"><span>Spin Count:</span></td><td id="spinCount" style="text-align:left">' + spinCount + '</td></tr>';
	statsHtml += '<tr><td valign=top style="text-align:right"><span>Paid In/Out:</span></td><td style="text-align:left"><span id="paidIn">' + paidIn + '</span> / <span id="paidOut">' + paidOut + '</span></td></tr>';
	statsHtml += '<tr><td><div style="text-align:right">Net Gain / Payout %:</div></td><td style="text-align:left"><span  id="paidNet">' + paidNet + '</span> / <span id="paidPcnt">' + ((Math.round(paidPcnt * 1000))/1000) + '</span>%</td></tr>';
	statsHtml += '</table></td></tr>';
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
	statsHtml += '<tr><td><button onclick="resetStats()">Reset Stats</button><button onclick="progReset()">Reset Progressive</button></td></tr>'
	document.getElementById("miscDataTbl").innerHTML=statsHtml;
}


function printDebug() {
	var debugHtml = "";
	var maxStop = new Array(numReels);
	var maxVStop = new Array(numReels);
	var paypos;
	var symnum;
	var symbol;
	for ( r = 0; r < numReels; r++ ) {
		maxStop[r] = strip[r].length - 1;
		maxVStop[r] = virtReel[r].length - 1;
	}
	var maxWheelStop = wheelStrip.length - 1;
	
	//Spin Debugging
	debugHtml += '<tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Rapid Mode: <input type="checkbox" id="dbgRapid" onClick="tgglDbgRapid()" /></td>';
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Virtual Reel Debugging: <input type="checkbox" id="vReelDebug" onClick="tgglVReelDbg()" /></td>';
	debugHtml += '</tr><tr>'
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:center">' + r + ': <input type="number" id="dbgVReelStop'+r+'" min=0 max=' + maxVStop[r] + ' value='+dbgVReelStops[r]+' style="width:5em" onInput="setVReelStops('+r+')" disabled /></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Physical Reel Debugging: <input type="checkbox" id="spinDebug" onClick="tgglSpinDbg()" /></td>';
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:center">' + r + ': <input type="number" id="dbgSpinStop'+r+'" min=0 max=' + maxStop[r] + ' value='+dbgSpinStops[r]+' style="width:5em" onInput="setSpinStops('+r+')" disabled /></td>';
	}
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
		debugHtml += '<td width=33% style="text-align:left"><div style="width:5em">' + r + ': <span id="reelStop' + r + '">' + (reelTopPos[r] + 1) + '</span>&nbsp;-&gt;&nbsp;<span id="reelTopPos' + r + '"> ' + (reelTopPos[r] + 1) + '</span></div></td>';
	}
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		payPos = reelTopPos[r] + 1;
		if ( payPos >= strip[r].length ) {
			payPos = 0;
		}
		symnum = strip[r][payPos];
		if ( symnum == 0 ) {
			symbol = "blankico"
		} else {
			symbol = symbols[symnum];
		}
		debugHtml+= '<td width=33% style="text-align:left"><div style="width:5em"><image id="dbgReelSym' + r + '" width="' + payIcoSize + '" src=images/'+symbol+'.png /></div></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Reel Nudging:</td>';
	debugHtml += '</tr><tr>';
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:left"><div style="width:5em">' + r + ': <span id="nudgePos' + r + '"></span></div></td>';
	}
	debugHtml += '</tr><tr>';
	
	for ( r = 0; r < numReels; r++ ) {
		debugHtml += '<td width=33% style="text-align:left"><div style="width:5em"><image id="nudgeSym' + r + '" width="' + payIcoSize + '" src=images/blank.png /></div></td>';
	}
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Bonus Debugging: <input type="checkbox" id="wheelDebug" onClick="wheelDbg()" /></td>';
	debugHtml += '</tr><tr>';
	debugHtml += '<td colspan='+numReels+' style="text-align:left"><input type="number" id="dbgWheelStop" min=0 max=' + maxWheelStop + ' value='+dbgWheelStop+' style="width:5em" onInput="setWheelStop()" disabled /></td>';
	debugHtml += '</tr><tr>';
	
	debugHtml += '<td colspan='+numReels+' style="text-align:left">Bonus Wheel Stop:</td>';
	debugHtml += '</tr>';

	for ( w = 0; w < wheelProg; w++ ) {
		wheelStop[w] = rndWheel[w];
		symnum = wheelStrip[wheelStop[w]];
		symbol = wheelSlotVals[symnum];
		
		debugHtml += '<tr>';
		debugHtml += '<td colspan='+numReels+' width=33% style="text-align:left"><span id="wheelStop' + w + '">' + wheelStop[w] + '</span>&nbsp;-&gt;&nbsp;<span id="wheelTopPos' + w + '">' + (wheelTopPos + wheelPayRow) + '</span>, Slot: <span id="dbgWheelSlot' + w + '">'+symbol+'</span></td>';
		debugHtml += '</tr>';
	}
	document.getElementById("miscDataTbl").innerHTML=debugHtml;
}

function tgglSpinDbg() {
	if (document.getElementById('spinDebug').checked) {
		document.getElementById('vReelDebug').checked = false;
		for ( r = 0; r < numReels; r++ ) {
			document.getElementById("dbgSpinStop" + r).disabled = false;
			document.getElementById("dbgVReelStop" + r).disabled = true;
			setSpinStops(r);
		}
		dbgVReel = 0;
		dbgSpin = 1;
	} else {
		dbgSpin = 0;
		for ( r = 0; r < numReels; r++ ) {
			document.getElementById("dbgSpinStop" + r).disabled = true;
			payPos = reelTopPos[r] + 1;
			if ( payPos >= strip[r].length ) {
				payPos = 0;
			}
			symnum = strip[r][payPos];
			if ( symnum == 0  ) {
				symbol = "blankico"
			} else {
				symbol = symbols[ symnum ];
			}
			document.getElementById( "dbgReelSym" + r ).src='images/'+symbol+'.png'
		}
	}
}

function tgglVReelDbg() {
	if (document.getElementById('vReelDebug').checked) {
		document.getElementById('spinDebug').checked = false;
		for ( r = 0; r < numReels; r++ ) {
			document.getElementById("dbgVReelStop" + r).disabled = false;
			document.getElementById("dbgSpinStop" + r).disabled = true;
			setVReelStops(r);
		}
		dbgSpin = 0;
		dbgVReel = 1;
	} else {
		dbgVReel = 0;
		for ( r = 0; r < numReels; r++ ) {
			document.getElementById("dbgVReelStop" + r).disabled = true;
			payPos = reelTopPos[r] + 1;
			if ( payPos >= strip[r].length ) {
				payPos = 0;
			}
			symnum = strip[r][payPos];
			if ( symnum == 0  ) {
				symbol = "blankico";
			} else {
				symbol = symbols[ symnum ];
			}
			document.getElementById( "dbgReelSym" + r ).src='images/'+symbol+'.png'
		}
	}
}

function wheelDbg() {
	if (document.getElementById('wheelDebug').checked) {
		dbgWheel = 1;
		document.getElementById("dbgWheelStop").disabled = false;
		setWheelStop();
	} else {
		dbgWheel = 0;
		document.getElementById("dbgWheelStop").disabled = true;
		wheelStop[(wheelMult + 1)] = rndWheel[w];
		payPos = wheelTopPos + wheelPayRow;
		if ( payPos >= wheelStrip.length ) {
			payPos -= wheelStrip.length;
		}
		symnum = wheelStrip[payPos];
		symbol = wheelSlotVals[symnum];
		document.getElementById( "dbgWheelSlot" + (wheelMult + 1)).innerHTML = symbol;
	}
}

function tgglDbgRapid() {
	if (document.getElementById('dbgRapid').checked) {
		dbgRapid = 1;
	} else {
		dbgRapid = 0;
	}
}

function printRnd() {
	var rndHtml = "";
	rndHtml += '<tr><td>';
	rndHtml += '<table>';
	for (var s = 0; s < numSeeds; s++) {
		rndHtml += '<tr id=seed_s' + s + '><td>' + s + ':</td>';
		for (var b = 31; b >= 0; b--) {
			rndHtml += '<td id=bit_s' + s + 'b' + b + '>';
			rndHtml += '&nbsp;';
			rndHtml += '</td>';
		}
		rndHtml += '</tr>';
	}
	rndHtml += '<tr><td>XOR</td>';
	for (var b = 31; b >= 0; b--) {
		rndHtml += '<td id=xor_b' + b + '>';
		rndHtml += '&nbsp;';
		rndHtml += '</td>';
	}
	rndHtml += '</tr></table>';
	rndHtml += '</td>';
	rndHtml += '</tr>'
	rndHtml += '<tr><td><table>'
	for (var s = 0; s< numSeeds; s++) {
		rndHtml += '<tr><td style="text-align:left">' + s + ':</td><td id=seedNum_s' + s + ' style="text-align:left"></td></tr>';
	}
	rndHtml += '<tr><td style="text-align:left">XOR:</td><td id=seedXor style="text-align:left"></td></tr>'
	rndHtml += '<tr>';
	rndHtml += '<tr><td style="text-align:left">Float:</td><td id=seedFloat style="text-align:left"></td></tr>'
	rndHtml += '<tr>';
	rndHtml += '<td style="text-align:left">Set Seed:</td><td id="rndSeed" style="text-align:left"></td>';
	rndHtml += '</tr><tr>';
	rndHtml += '<td style="text-align:left">PRNG:</td><td id="rndNum" style="text-align:left"></td>';
	rndHtml += '</tr></table>'
	rndHtml += '</td></tr>';
	document.getElementById("miscDataTbl").innerHTML=rndHtml;
}

function setSpinStops(r) {
	dbgSpinStops[r] = document.getElementById( "dbgSpinStop" + r ).value;
	var symnum = strip[r][dbgSpinStops[r]];
	if ( symnum == 0  ) {
		var symbol = "blankico"
	} else {
		var symbol = symbols[ symnum ];
	}
	document.getElementById( "dbgReelSym" + r ).src='images/'+symbol+'.png'
}

function setVReelStops(r) {
	dbgVReelStops[r] = document.getElementById( "dbgVReelStop" + r ).value
	document.getElementById( "dbgSpinStop" + r ).value = virtReel[r][dbgVReelStops[r]];
	setSpinStops(r);
}

function setWheelStop() {
	dbgWheelStop = document.getElementById( "dbgWheelStop" ).value;
	wheelStop[(wheelMult + 1)] = dbgWheelStop;
	var symnum = wheelStrip[dbgWheelStop];
	var symbol = wheelSlotVals[symnum];
	var symColor = wheelSlotColors[symnum];
	document.getElementById( "dbgWheelSlot" + (wheelMult + 1) ).innerHTML = symbol;
}

// Credit related functions
function insertCoin() {
	if ( cashingOut == 1 || lockBtn == 1 ) {
		return;
	} else {
		lockBtn = 1;
		playSound("insertCoin");
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
		document.getElementById("credits").innerHTML=padNumber(credits,6);
		setCookie("credits",credits,expiry);
		playSound("coinBong");
	}
}

function cashOut() {
	if ( credits == 0 || cashingOut == 1 || betAmt != 0 || lockBtn == 1 ) {
		return;
	} else {
		cashingOut = 1;
		lastBet = 0;
		playSound("cashOut");
		setTimeout(function () {
			document.getElementById("paid").innerHTML=padNumber(credits,6);
			credits = 0;
			setCookie("credits",credits,expiry)
			document.getElementById("credits").innerHTML=padNumber(credits,6);
			cashingOut = 0;
		}, 4250 );
	}
}

function clearWin() {
	for (var pt = 0; pt < paytable.length; pt++) {
		document.getElementById("payRow" + pt).style.backgroundColor = "white";
	}
	for ( var r = 0; r < numReels; r++ ) {
		for ( var p = 0; p < numReelPos; p++ ) {
			lightReel(r,p,0);
		}
	}
	document.getElementById("win").innerHTML=padNumber("",6);
	document.getElementById("paid").innerHTML=padNumber("",6);
	document.getElementById("reelMult").innerHTML=padNumber("",2);
	document.getElementById("wheelPrepay").innerHTML=padNumber("",3);
	document.getElementById("wheelMult").innerHTML=padNumber("",2);
	document.getElementById("totMult").innerHTML=padNumber("",2);
	document.getElementById("wheelWin").innerHTML=padNumber("",6);
	document.getElementById("wheelPay").innerHTML=padNumber("",6);
	clearTicker();
}

function betOne() {
	var weight;
	if ( lockBtn != 1 ) {
		if ( credits > 0 ) {
			clearWin();
			document.getElementById("gameover").innerHTML="";
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
			document.getElementById("credits").innerHTML=padNumber(credits,6);
			playSound("coinBong");
			if ( betAmt >= betLimit ) {
				betAmt = betLimit;
			}
			document.getElementById("betAmt").innerHTML=padNumber(betAmt,2);
			if ( betAmt == betLimit ) {
				reBet = 0;
				setTimeout(function() {
					spin();
				}, 250 );
			}
		}
	}
}

function rebet() {
	if ( reBet == 0 || lockSpin == 1 || lastBet == 0 || betAmt == betLimit || credits <= 0 ) {
		return;
	} else {
		betOne();
	}
	if ( betAmt == lastBet ) {
		reBet = 0;
		setTimeout(function () {
			spin();
		}, 250 );
	} else {
		setTimeout(function () {
			rebet();
		}, 125 );
	}
}

function betMax() {
	if ( betAmt >= betLimit || credits <= 0) {
		return;
	} else {
		gameIdle = 0;
		betOne();
	}
	setTimeout(function () {
		betMax();
	}, 125 )
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

// Generate reel display table
function makeReels() {
	var reelHtml;
	for ( r = 0; r < numReels; r++ ) {
		reelHtml = "";
		for ( p = 0; p < numReelPos; p++ ) {
			reelHtml += '<img id="r' + r + 'p' + p + '"></img><br />'
		}
		document.getElementById('r'+r).innerHTML = reelHtml;
	}
}

// Set random starting position for physical reels
function initReels() {
	makeReels();
	var reelHeight = Math.floor((symSize * 2) + (symSize / 2));
	for ( r = 0; r < numReels; r++ ) {
		virtStop[r] = rndReel[r];
		document.getElementById('r' + r).height = reelHeight;
		reelTopPos[r] = virtReel[r][virtStop[r]] - 1;
		if ( reelTopPos[r] < 0 ) {
			reelTopPos[r] = strip[r].length - 1;
		}
		setReel(r);
	}
	
}

// Advance reels by one step.
function advReel(minSpin) {
	for ( r = minSpin; r < numReels; r++ ) {
		reelTopPos[r]--;
		if ( reelTopPos[r] < 0 ) {
			reelTopPos[r] = strip[r].length - 1;
		}
		if ( reelTopPos[r] + 1 > strip[r].length - 1 ) {
			rPos = reelTopPos[r] + 1 - strip[r].length;
		} else {
			rPos = reelTopPos[r] + 1;
		}
		if ( dbgMode == 1 ) {
			document.getElementById("reelTopPos" + r).innerHTML=rPos;
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
		var symnum = reel[r][p];
		var symbol = symbols[symnum];
		var icosize;
		if ( symnum == 0 ) {
			icosize = Math.round( symSize / 3 );
		} else {
			icosize = symSize;
		}
		document.getElementById( "r" + r + "p" + p ).height = icosize;
		document.getElementById( "r" + r + "p" + p ).src='images/' + symbol + '.png';
	}
}

// Control lighting effects for individual reel positions

function lightReel(reelNum,posNum,toggle) {
	var toggle = ( toggle || 0 );
	var color;
	var bright;
	if ( toggle == 1 ) {
		bright=100;
//		color="";
	} else {
		bright=50;
//		color="";
	}
//	document.getElementById("r" + reelNum + "p" + posNum).style.backgroundColor = color;
	document.getElementById("r" + reelNum + "p" + posNum).style.WebkitFilter="brightness(" + bright + "%)" 
}

// Spin related functions
function startGame() {
	if ( credits == 0 && betAmt == 0 || lockSpin == 1 && wheelRun != 1 && payingOut != 1 ) {
		return;
	} else {
		gameIdle = 0;
	}
	if ( wheelRun == 1 ) {
		createjs.Sound.stop();
		wheelSpin();
	} else if ( payingOut == 1 ) {
		payingOut = 2;
	} else if ( betAmt == 0 ) {
		reBet = 1;
		rebet();
	} else {
		spin();
	}
}

function spin() {
	if ( lockSpin == 1 || betAmt <= 0) {
		return;
	}
	gameIdle = 0;
	lockSpin = 1;
	lockBtn = 1;
	popRnd();
	spinCount++;
	if ( miscDataType == "stats") {
		document.getElementById("spinCount").innerHTML=spinCount;
	}
	setCookie("spinCount",spinCount,expiry);
	setCookie("credits",credits,expiry);
	progInc(betAmt);
	spinSteps = 0;
	possWin = 1;
	wheelMult = -1;
	wheelPreMult = 0;
	var payPos;
	var sumPos;
	var symnum;
	var symbol;
	var nudgeSymPos;
	var nudgeSymNum;
	for ( r = 0; r < numReels; r++ ) {
		spinSteps += Math.floor(Math.random() * strip[r].length) + Math.floor(strip[r].length / 2);
		reelSteps[r] = spinSteps;
		if ( dbgSpin == 1 ) {
			reelStop[r] = dbgSpinStops[r];
		} else {
			if ( dbgVReel == 1 ) {
				virtStop[r] = dbgVReelStops[r];
			} else {
				virtStop[r] = rndReel[r];
			}
			reelStop[r] = virtReel[r][virtStop[r]];
		}
		if ( dbgMode == 1 ) {
			document.getElementById("virtStop" + r ).innerHTML=virtStop[r];
			document.getElementById("reelStop" + r ).innerHTML=reelStop[r];
			document.getElementById("nudgePos" + r).innerHTML=rndNudgePos[r];
			symPos = reelStop[r];
			symnum = strip[r][symPos];
			if ( symnum == 0  ) {
				symbol = "blankico"
			} else {
				symbol = symbols[ symnum ];
			}
			document.getElementById("dbgReelSym" + r ).src='images/' + symbol + '.png';
			if ( rndNudgePos[r] != 1 ) {
				if ( rndNudgePos[r] < 1 ) {
					document.getElementById("nudgePos" + r).innerHTML="Top";
				} else {
					document.getElementById("nudgePos" + r).innerHTML="Btm";
				}
			} else {
				document.getElementById("nudgePos" + r).innerHTML="Mid";
			}
			nudgeSymPos = symPos + rndNudgePos[r] - 1;
			if ( nudgeSymPos >= strip[r].length ) {
				nudgeSymPos = 0;
			} else if ( nudgeSymPos < 0 ) {
				nudgeSymPos = strip[r].length - 1;
			}
			nudgeSymNum = strip[r][nudgeSymPos];
			if ( nudgeSymNum == 0  ) {
				symbol = "blankico"
			} else {
				symbol = symbols[ nudgeSymNum ];
			}
			document.getElementById("nudgeSym" + r ).src='images/' + symbol + '.png';

			rndNudgeSym[r] = Math.round( rndNudgeSym[r] * nudgeOdds[nudgeSymNum] )
			
		}
	}
	for ( w = 0; w < wheelProg; w++ ) {
		if ( dbgWheel == 1 && w == 0) {
			wheelStop[w] = dbgWheelStop;
		} else {
			wheelStop[w] = rndWheel[w];
		}
		if ( dbgMode == 1 ) {
			document.getElementById("wheelStop" + w).innerHTML=wheelStop[w];
			symnum = wheelStrip[wheelStop[w]];
			symbol = wheelSlotVals[symnum];
			document.getElementById("dbgWheelSlot" + w).innerHTML=symbol;
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
		playSound("reelStop");
		if ( possWin == 1 ) {
			if ( payline[minSpin] == 7 ) {
				playSound("possWin" + minSpin);
				lightReel(minSpin,1,1);
			} else {
				possWin = 0;
				for ( var r = 0; r < numReels; r++ ) {
					lightReel(r,1,0);
				}
			}
		}
		minSpin++
	
	}
	
	if ( spinSteps % Math.round( 100 / spinSpeed ) == 0 ) {
		playSound( "tone" + Math.floor(Math.random() * 4 ));
	}
	spinSteps++;

	var looptime; 
	if ( minSpin >= numReels ) {
			checkNudge();
	} else {
		setTimeout(function () {
			spinLoop(minSpin);
		}, spinSpeed );
	}
}

function checkNudge() {
	var nudge = 0;
	for ( r = 0; r < numReels; r++ ) {
		nudgeVal[r] = 0;
		if ( payline[r] != 0 ) { continue; }
		var nudgePos = rndNudgePos[r];
		if ( nudgePos == 1 ) { continue; }
		var nudgeSym = reel[r][nudgePos];
		var nudgeProb = rndNudgeSym[r];
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
			doNudge(0,nudge);
		}, looptime)
	} else {
		setTimeout(function() {
			checkPayline();
		}, looptime)
	}
}

function doNudge(r,nudge) {
	for ( ; r < numReels; r++ ) {
		if ( nudgeVal[r] != 0 ) {
			reelTopPos[r] += nudgeVal[r];
			if ( reelTopPos[r] > strip[r].length - 1 ) {
				reelTopPos[r] = 0
			} else if ( reelTopPos[r] < 0 ) {
				reelTopPos[r] = strip[r].length - 1
			}
			setReel(r);
			playSound("reelStop");
			nudgeVal[r] = 0;
			nudge--;
			break;
		}
	}
	if ( dbgRapid == 1 ) {
		looptime = 100;
	} else {
		looptime = 250;
	}
	
	if ( r == numReels - 1 || nudge == 0 ){
		setTimeout(function () {
			checkPayline();
		}, looptime )
	} else {
		setTimeout(function () {
			doNudge(r,nudge);
		}, looptime )
	}
}

function checkPayline() {
	var wilds = 0;
	var matches;
	var gnum;
	var wintype = -1;
	var doWheel = 0;
	for (r = 0; r < numReels; r++) {
		if (payline[r] == 7) {
			wilds++;
		}
	}
	if ( payline[2] == 8 ) {
		wintype = paytable.length - 1;
		doWheel = 1;
	} else {
		for (p = 0; p < paytable.length - 1; p++) {
			match = 0;
			if ( p == 18 && doWheel == 1 ) {
				wintype = p;
				break;
			} else if ( p == 17 && wilds > 0 ) {
				continue;
			} else if (( p == 12 && wilds == 2 ) || ( p == 16 && wilds == 1 )) { // Any Wilds
				wintype = p;
			} else {
				for (r = 0; r < numReels; r++) {
					paySym[r] = paytable[p][r];
				}
				for (r = 0; r < numReels; r++) {
					if ( paySym[r] < 0 ) {
						break;
					} else if (paySym[r] === "-" ) {
						continue;
					} else if (paySym[r] < 100) {
						if (payline[r] == paySym[r] || payline[r] == 7) {
							if (r == numReels - 1) {
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
						gnum = paySym[r] - 100;
						for ( sym = 0; sym < groups[gnum].length; sym++) {
							if (payline[r] == groups[gnum][sym] || payline[r] == 7) {
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
	}
	if ( wintype >= 0 ) {
		if ( wintype != 17 ) {
			for ( var r = 0; r < numReels; r++ ) {
				if ( (wintype == 12 || wintype == 16 ) && ( payline[r]) != 7 ) {
					continue
				}
				if ( wintype == 18 && r != 2 ) {
					continue
				}
				lightReel( r, 1 , 1 );
			}
		}
		document.getElementById("payRow" + wintype).style.backgroundColor = "yellow";
		if ( wintype == 0 && betAmt == maxLineBet) {
			payout = progVal;
		} else {
			payout = paytable[wintype][3];
			payout *= betAmt;
		}
		if ( wintype != 0 && wintype != 12 && wintype != 16 ) {
			payout *= Math.pow(2, wilds);

		}
		winStats( wintype, betAmt );
		if ( wintype == 18 && betAmt == betLimit) {
			setTimeout(function () {
				playSound("wheelSpin")
			}, 250);
			wheelPrePay = payout;
			wheelPreMult = wilds;
			wheelMult = 0;
			document.getElementById("reelMult").innerHTML=padNumber(Math.pow(2, wheelPreMult),2);
			document.getElementById("wheelPrepay").innerHTML=padNumber(wheelPrePay,3);
			setTimeout(function () {
				playWheelWait();
			}, 1500);
		} else {
			payFinal = payout + credits;
			payStats( payout * -1 );
			payWin( wintype,payout,(payout+credits),0,0 );
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
	wheelMult = -1;
	wheelPreMut = 0;
	if ( wheelRows % 2 == 0 ) {
		wheelRows++
	}
	wheelPayRow = ( wheelRows - 1 ) / 2;
	wheelTopPos = rndWheel[0] - wheelPayRow;
	if ( wheelTopPos < 0 ) {
		wheelTopPos = wheelStrip.length - 1
	}
	printWheel();
	document.getElementById("wheelMult").innerHTML=padNumber((Math.pow(2, wheelMult)),2);
	setWheel();
}

function printWheel() {
	var wheeltext = '';
	wheeltext += '<tr><td>--&gt;</td><td class="wheel" width=' + wheelWidth + '><table width=100%>';
	for ( var row = 0; row < wheelRows; row++ ) {
		wheeltext += "<tr><td id='wp"+row+"'></td></tr>";
	}
	wheeltext += '</table><td>&lt;--</td></tr>';
	document.getElementById("bonusWheel").innerHTML=wheeltext;
	
	var bright;
	for ( var row = 0; row < wheelRows; row++ ) {
		if ( row == wheelPayRow ) {
			bright = 100;
		} else {
			bright = 50;
		}
		document.getElementById("wp" + row).style.WebkitFilter="brightness(" + bright + "%)"
	}
}

function advWheel() {
	wheelTopPos--;
	if ( wheelTopPos < 0 ) {
		wheelTopPos = wheelStrip.length - 1
	}
	if ( wheelTopPos + wheelPayRow > wheelStrip.length - 1 ) {
		wPos = wheelTopPos + wheelPayRow - wheelStrip.length
	} else {
		wPos = wheelTopPos + wheelPayRow
	}
	if ( dbgMode == 1 ) {
		document.getElementById("wheelTopPos" + wheelMult).innerHTML=wPos;
	}
	playSound("wheelTick");
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

function playWheelWait() {
	wheelRun = 1;
	wheelTotMult = wheelPreMult + wheelMult;
	document.getElementById("wheelMult").innerHTML=padNumber((Math.pow(2, wheelMult)),2);
	document.getElementById("totMult").innerHTML=padNumber((Math.pow(2, wheelTotMult)),2);
	createjs.Sound.play("wheelWait",{loop:-1});
}

function wheelSpin() {
	if ( dbgWheel == 1 ) {
		document.getElementById("wheelStop" + (wheelMult + 1)).innerHTML=wheelStop[wheelMult];
		symnum = wheelStrip[wheelStop[wheelMult]];
		symbol = wheelSlotVals[symnum];
		document.getElementById("dbgWheelSlot" + (wheelMult + 1)).innerHTML=symbol;
	}
	spinSteps = 0;
	wheelRun = 0;
	wheelTotMult = wheelPreMult + wheelMult;
	document.getElementById("wheelMult").innerHTML=padNumber((Math.pow(2, wheelMult)),2);
	document.getElementById("totMult").innerHTML=padNumber((Math.pow(2, wheelTotMult)),2);
	wheelSteps = Math.floor(Math.random() * wheelStrip.length) + wheelStrip.length;
	wheelLoop();
}

function wheelLoop() {
	var topPos = wheelStop[wheelMult] - wheelPayRow;
	var paysym;
	if ( topPos < 0 ) {
		topPos = wheelStrip.length - 1
	}
	if ( spinSteps < wheelSteps || wheelTopPos != topPos ) {
		advWheel();
		paysym = wheelSlotVals[wheel[wheelPayRow]];
		if ( isNaN(paysym) ) {
			document.getElementById("wheelWin").innerHTML=paysym;
		} else {
			document.getElementById("wheelWin").innerHTML=padNumber(wheelSlotVals[wheel[wheelPayRow]] * Math.pow(2, wheelTotMult),6);
		}
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
	var totMult = wheelPreMult + wheelMult;
	if ( payslot == 0 ) {
		payout *= 2
	}
	wheelPay = wheelSlotVals[payslot];
	if ( wheelPay  == "Double" ) {
		wheelMult++;
		if ( wheelMult == wheelProg ) {
			jackpot(0,wheelPreMult);
		} else {
			setTimeout(function () {
				wheelSpin()
			}, 500);
		}
	} else {
		wheelTotMult = wheelPreMult + wheelMult;
		document.getElementById("totMult").innerHTML=padNumber(Math.pow(2, wheelTotMult),2);
		payout = wheelPay * Math.pow(2, wheelTotMult);
		document.getElementById("wheelWin").innerHTML=padNumber(payout,6);
		payout += wheelPrePay;
		document.getElementById("wheelPay").innerHTML=padNumber(payout,6);
		payStats( payout * -1 );
		payWin(18,payout,(payout+credits),0,0)
	}
}

function payWin(wintype,payout,payfinal,i,paySound) {
	if ( payingOut == 2 ) {
		setTimeout(function () {
			payComplete( wintype, payout, payfinal);
		}, 500);
	} else {
		payingOut = 1;
		var loopTime;
		document.getElementById("win").innerHTML=padNumber(payout,6);
	
		if (payout >= 300) {
			loopTime = 25;
		} else {
			loopTime = 100;
		}
		if ( wintype == 0 && betAmt == maxLineBet) {
			jackpot(0,1);
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
		document.getElementById("paid").innerHTML=padNumber(i,6);
		document.getElementById("credits").innerHTML=padNumber(credits,6);
		payStats(-1);

		if ( dbgRapid == 1 ) {
			loopTime = 0;
		}

		setTimeout(function () {
			if ( i < payout ) {
				payWin( wintype, payout, ( payout + credits ), i, paySound);
			} else {
				payout = 0;
				payingOut = 0;
				displayWin(wintype);
			}
		}, loopTime);
	}
}

function payComplete(wintype,payout,payfinal) {
	credits = payfinal;
	document.getElementById("paid").innerHTML=padNumber(payout,6);
	document.getElementById("credits").innerHTML=padNumber(credits,6);
	playSound("coinBong");
	payout = 0;
	payingOut = 0;
	displayWin(wintype);
}

function displayWin(wintype) {
	startTicker(paytable[wintype][4]);
	endGame();
}

/*
 End Game
*/

function endGame() {
	lastBet = betAmt;
	lockSpin = 0;
	lockBtn = 0;
	betAmt = 0;
	wheelPreMult = -1;
	wheelMult = -1;
	gameIdle = 1;
	cyclePRNG();
	document.getElementById("betAmt").innerHTML=padNumber(betAmt,2);
	document.getElementById("gameover").innerHTML="<blink>Game Over</blink>";
}

function jackpot(c,m) {
	playSound("jackpot");
	if ( c < 9 ) {
		c++;
		setTimeout(function () {
			jackpot(c,m);
		}, 625);
	} else {
		if ( (progVal * m) > maxProg ) {
			progVal = maxProg
		} else {
			progVal *= m;
		}
		setTimeout(function () {
			credits += progVal;
			setCookie("credits",credits,expiry)
			payStats(-(progVal));
			document.getElementById("paid").innerHTML=padNumber(progVal, 6);
			document.getElementById("credits").innerHTML=padNumber(credits, 6);
			progReset();
			endGame()
		}, 625)
	}
}

function progInc (steps) {
	for ( i = 0; i < steps; i++ ) {
		progCnt++
		if ( progCnt == 5 ) {
			progCnt = 0;
			if ( progVal < maxProg ) {
				progVal++;
			}
			setCookie("progVal",progVal,expiry);
			document.getElementById("progVal").innerHTML=padNumber(progVal,6,'',1);
		}
	}
}

function progInit() {
	if (progVal == 0) {
		progCnt = 0;
		progVal = paytable[0][numReels] * maxLineBet * 5/3;
		setCookie("progCnt",progCnt,expiry)
		setCookie("progVal",progVal,expiry)
	}
	document.getElementById("progVal").innerHTML=padNumber(progVal,6,'',1);
	document.getElementById("progVal").style.color = "#00ff00";
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
	for ( p = 0; p<paytable.length+1; p++ ) {
		for ( c = 0; c<maxLineBet; c++ ) {
			payouts[p][c] = getCookie("payouts"+p+"c"+c);
		}
	}
}

/*
	Random Number Generator
*/

var gameIdle;

function initRNG() {
	gameIdle = 1;
	genRndSeed();
	cyclePRNG();
}

function genRndSeed() {
	var seedNums = new Uint32Array(numSeeds);
	var rndSeed = 0;
	var zerotxt = '<small>.</small>';
	var zerocolor = '#ff0000';
	var onetxt = '<small>!</small>';
	var onecolor = '#00ff00';
	window.crypto.getRandomValues(seedNums);
	for (var s = 0; s < seedNums.length; s++) {
		for (var b = 0; b < 32; b++) {
			if (seedNums[s] & 1<<b) {
				bitval = onetxt;
				bgc=onecolor;
			} else {
				bitval = zerotxt;
				bgc=zerocolor;
			}
			if ( rndDisp == 1 ) {
				document.getElementById('bit_s' + s + 'b' + b).style.backgroundColor=bgc;
				document.getElementById('bit_s' + s + 'b' + b).innerHTML = bitval;
			}
		}
		if ( rndDisp == 1 ) {
			document.getElementById('seedNum_s' + s).innerHTML = seedNums[s];
		}
		rndSeed ^= seedNums[s];
	}
	rndSeed = rndSeed>>>0;
	floatSeed = rndSeed / Math.pow(2,32);
	for (var b = 0; b < 32; b++) {
		if (rndSeed & 1<<b) {
			bitval = onetxt;
			bgc=onecolor;
		} else {
			bitval = zerotxt;
			bgc=zerocolor;
		}
		if ( rndDisp == 1 ) {
			document.getElementById('xor_b' + b).style.backgroundColor=bgc
			document.getElementById('xor_b' + b).innerHTML = bitval;
		}
	}
	if ( rndDisp == 1 ) {
		document.getElementById("seedXor").innerHTML = rndSeed;
		document.getElementById("seedFloat").innerHTML = floatSeed.toExponential();;
	}
	setRndSeed(floatSeed,0)
	setTimeout(function () {
		genRndSeed()
	}, 1000 );
}

function setRndSeed(seednum,i) {
	if ( gameIdle == 1 ) {
		Math.seedrandom(seednum)
		if ( rndDisp == 1 ) {
			document.getElementById("rndSeed").innerHTML=seednum.toExponential();;
		}
	} else if ( i > 2 ) {
		return;
	} else {
		setTimeout(function () {
			setRndSeed(seednum,++i)
		}, 250 );
	}
}

function cyclePRNG() {
	if ( gameIdle == 1 ) {
		var n = Math.random();
		if ( rndDisp == 1 ) {
			document.getElementById("rndNum").innerHTML=n.toExponential();
		}
		setTimeout(function () {
			cyclePRNG();
		}, 100 );
	}
}

function popRnd() {
	for ( r = 0; r < numReels; r++ ) {
		rndReel[r] = Math.floor(Math.random() * virtReel[r].length);
		rndNudgePos[r] = Math.floor( Math.random() * numReelPos);
		rndNudgeSym[r] = Math.random();
	}
	for ( w = 0; w < wheelProg; w++ ) {
		rndWheel[w] = Math.floor( Math.random() * wheelStrip.length);
	}
}

// Message ticker

var tickerTape = new Array(tickerCells);
var runTicker;
function initTicker() {
	var tickerHtml = ""
	runTicker = 0;
	tickerHtml += '<tr cellpadding=0>';
	for (var c = tickerCells - 1; c >= 0; c--) {
		tickerTape[c] = '';
		tickerHtml += '<td id="ticker_' + c + '">';
		tickerHtml += '&nbsp;';
		tickerHtml += '</td>';
	}
	tickerHtml += '</tr>';
	document.getElementById("tickerTape").innerHTML=tickerHtml;
}

function startTicker(tickerText) {
	runTicker = 1;
	tickerLoop(tickerText,0);
}

function tickerLoop(tickerText,tickerStep) {
	if (runTicker == 0) {
		clearTicker();
	} else {
		var msgTxt = tickerText.split('');
		var nextCell;
		if (tickerStep >= (tickerText.length + tickerCells)) {
			tickerStep = 0
		}
		if (tickerStep < tickerText.length && tickerText[tickerStep] != ' ') {
			nextCell = tickerText[tickerStep]
		} else {
			nextCell = '&nbsp;';
		}
		for (var c = tickerCells - 1; c >= 0; c--) {
			if ( c == 0 ) {
				tickerTape[c] = nextCell;
			} else {
				tickerTape[c] = tickerTape[(c-1)];
			}
			document.getElementById("ticker_" + c).innerHTML = tickerTape[c]
		}
		tickerStep++;
		setTimeout(function () {
			tickerLoop(tickerText,tickerStep);
		}, tickerTime );
	}
}

function clearTicker() {
	runTicker = 0;
	setTimeout(function () {
		for (c = 0; c < tickerCells; c++) {
			tickerTape[c] = '&nbsp;';
			document.getElementById("ticker_" + c).innerHTML = tickerTape[c];
		}
	}, (Math.floor(tickerTime + (tickerTime / 2))) );
}

// Number padding

/*
	The following function, padNumber() is derived in part from a function shared on StackOverflow
	URL: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
	Contributer: coderjoe <http://stackoverflow.com/users/127792>
	License: Creative Commons CC-BY-SA https://creativecommons.org/licenses/by-sa/3.0/deed.en
 */

function padNumber(num, padLen, char, just) {
	var padChar = ( char || "&nbsp" );
	if ( just ) {
		var justify = "left";
	} else {
		var justify = "right";
	}
	var n = Math.abs(num);
	var padding = Math.max(0, padLen - Math.floor(n).toString().length );
	var padString = ""
	if( num < 0 ) {
		--padding
	}
	for ( p = 0; p < padding; p++ ) {
		padString += padChar;
	}
	if ( justify == "left" ) {
		return n+padString;
	} else {
		return padString+n;
	}
}

function init() {
	var spinnum;
	var symbol;
	var symnum;
	var miscDataType="none";
	preloadImage();
	preloadSound();
	printPaytable();
	initRNG();
	initVReels();
	popRnd();
	initReels();
	initWheel();
	initSymOdds();
	initPayOdds();
	initTicker();
	clearWin();
	cookieRestore();
	progInit();
	clearMisc();
	payStats(0);
	endGame();
	document.getElementById("credits").innerHTML=padNumber(credits,6);
	document.getElementById("betAmt").innerHTML=padNumber(betAmt,2);
	document.getElementById("gameover").innerHTML="Game Over";
	document.getElementById("maxcred").innerHTML="Play " + betLimit + " Credits";
	document.getElementById("miscDataNone").selected = true;
	if ( spinSpeed < 10 ) {
		spinSpeed = 10;
	} else if ( spinSpeed > 100 ){
		spinSpeed = 100;
	}
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
	case 32:
		startGame();
		return false;
	case 51:
		betMax();
		return false;
	case 52:
		insertCoin();
		return false;
	case 27:
		cashOut();
		return false;
	case 54:
		insertBill();
		return false;
	default:
		break;
	}
});

function preloadImage() {
	for ( i = 0; i < symbols.length; i++)
	var img=new Image();
	img.src='images/' + symbols[i] + '.png';
}

/*
	SoundJS Functions
*/

var sounds = ["insertCoin","coinBong","reelStop","jackpot","cashOut"];

var wheelSounds = ["Spin","Wait","Tick"]

var paySounds = 33;

function preloadSound() {

	// General sounds
	for ( var sIndex = 0; sIndex < sounds.length; sIndex++ ) {
		createjs.Sound.registerSound({id:sounds[sIndex], src:"sounds/" + sounds[sIndex] + ".wav"});
	};
	// Reel spinning tones
	for ( var sIndex = 0; sIndex < 4; sIndex++ ) {
		createjs.Sound.registerSound({id:"tone" + sIndex, src:"sounds/tone" + sIndex + ".wav"});
	};
	// Possible progressive
	for ( var sIndex = 0; sIndex < wheelSounds.length; sIndex++ ) {
		createjs.Sound.registerSound({id:"possWin" + sIndex, src:"sounds/possWin" + sIndex + ".wav"});
	};	
	// Bonus wheel sounds
	for ( var sIndex = 0; sIndex < wheelSounds.length; sIndex++ ) {
		createjs.Sound.registerSound({id:"wheel" + wheelSounds[sIndex], src:"sounds/wheel" + wheelSounds[sIndex] + ".wav"});
	};
	// Payout Sounds
	for ( var sIndex = 0; sIndex < paySounds; sIndex++ ) {
		createjs.Sound.registerSound({id:"paySound" + sIndex, src:"sounds/payOut/paySound" + sIndex + ".wav"});
	};
}

function playSound(sIndex) {
	createjs.Sound.play(sIndex)
}
