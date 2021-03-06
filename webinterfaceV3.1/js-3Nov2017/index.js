var year;
var dataSet;
var apvMode;
var subsystem;
var runFrom = -1;
var runTo = -1;
var colors = [];
var runsList = [];
var useList = false;

var collections = {}; //contains file names for each dataset
var chart_list = null; //global ref to ChartList instance

function load_dataset(name) {
    var need_refresh = false;
    var need_update = update_runs();
    
    console.log("index.js -> dataset name = ", name);
    console.log("index.js -> chart_list = ", chart_list);
    //console.log("index.js -> need_update = ", need_update);
    //console.log("index.js -> need_refresh = ", need_refresh);   
    if (chart_list == null) {
        need_refresh = true;
	console.log("index.js -> chart_list == null -> put need_refresh = true");
    }
    else {
        console.log("index.js -> chart_list != null");
        if (name != chart_list.dataset) {
//        if (name != chart_list.dataset || need_update) { // Aris
	    console.log("index.js -> name != chart_list.dataset -> destroy all charts and create new ones");
            need_refresh = true;
            chart_list.charts.forEach(function(c) {
                c.destroy();
            });
        	$("#body").html("");
        }
    }
    if (need_refresh) {
		update_collections();
        chart_list = new ChartList(name, collections[name]);
	//console.log("index.js -> need_refresh = true");
	//console.log("index.js -> new chart_list = ", chart_list);
	console.log("index.js ->  chart_list.dataset = ", chart_list.dataset);  
    }
    else {
        if (need_update) {
	    console.log("index.js -> need_update == true ");
            chart_list.update();
        }
    }
}

function is_num(x) {
    return !isNaN(parseFloat(x))
}

//Checks range inputs for changes and updates runFrom and runTo if needed.
//Returns true if the the range has changed.
function update_runs() {
	var isRange = $("#runs-mode").val() === "range-input";
	console.log(isRange);
	if (isRange) {
		var result = useList;
		useList = false;
		var from = $("#runFrom").val();
		var to = $("#runTo").val();
		console.log(from,to);
		if (!is_num(from) && !is_num(to))
			return result;
		if (from === runFrom && to === runTo)
			return result;
		if (is_num(from)) {
			var tmp = parseInt(from, 10);
			if (tmp !== runFrom) {
				runFrom = tmp;
				result = true;
			}
		}
		if (is_num(to)) {
			var tmp = parseInt(to, 10);
			if (tmp !== runTo) {
				runTo = tmp;
				result = true;
			}
		}
		if (runFrom == -1 && runTo == -1) {
			type = 0;
			//console.log("type : " + type);
		} else if (runFrom >= 0 || runTo >= 0) {
			type = 1;
			//console.log("type : " + type);
		}
		useList = false;
		return result;
	}
	else {
		if (useList && arraysEqual(oldRunsList, runsList))
			return false;
		oldRunsList = runsList;
		useList = true;
		return true;
	}
}

function update_url() {
    if (apvMode == "" || apvMode === null || apvMode == "PEAK + DECO") { 
        urlLink = "/" + year + "/Prompt/" + dataSet + "/"
                + subsystem;
            if (dataSet == "StreamExpress" || dataSet == "StreamExpressCosmics"|| dataSet == "StreamExpressCosmicsCommissioning") {
                urlLink = "/" + year + "/" + dataSet + "/"
                + subsystem;
            }							     			
    } else {
        if (dataSet == "StreamExpress") {
        urlLink = "/" + year + "/" + dataSet + "/"
                + subsystem + "/" + apvMode;
        } else if (dataSet == "StreamExpressCosmics") {
        urlLink = "/" + year + "/" + dataSet + "/"
                + subsystem + "/" + apvMode;
        } else if (dataSet == "StreamExpressCosmicsCommissioning") {
        urlLink = "/" + year + "/" + dataSet + "/"
                + subsystem + "/" + apvMode;
        } else if (dataSet == "Cosmics") {
        urlLink = "/" + year + "/Prompt/" + dataSet + "/"
                + subsystem + "/" + apvMode;
        } else if (dataSet == "CosmicsCommissioning") {
        urlLink = "/" + year + "/Prompt/" + dataSet + "/"
                + subsystem + "/" + apvMode;
        } else {
        urlLink = "/" + year + "/Prompt/" + dataSet + "/"
                + subsystem + "/" + apvMode;
		
        }
    }
    console.log("urlLink : " + urlLink);
}

function update_subsystem() {
	if ($("#subsystem").val() == "Pixel" || $("#subsystem").val() == "PixelPhase1") {
		$("#apvMode").prop("disabled", true);
		$("#apvMode").val("No Selection");
	} else {
		$("#apvMode").prop("disabled", false);
		if ($("#apvMode").val() == null) {
			$("#apvMode").val("");
		}	
	}
}

function update_collections() {

    collec_file = "collections_"+$("#year").val()+".json";
    console.log("collection file  : " + collec_file);
    
    $.getJSON(collec_file, function (data) {
	    //$.getJSON(collec_file, function (data) {
	    collections = data;
    });

}


$(document).ready(
	function() {
		colors.push("#669999");
		colors.push("#FF6600");
		colors.push("#669900");
		colors.push("#002E00");
		colors.push("#CC3300");
		colors.push("#996633");
		colors.push("#000099");
		colors.push("#9900CC");
		colors.push("#FF0066");
		colors.push("#8D1919");
                
		collec_file = "collections_"+$("#year").val()+".json";
		console.log("collection file  : " + collec_file);
		
		$.getJSON("collections_2017.json", function (data) {
			//$.getJSON(collec_file, function (data) {
			collections = data;
		});

		$('<ul id="list" style="white-space:nowrap;overflow-x:auto"></ul>').appendTo('#list-cotnainer');

		$("#" + $("#runs-mode").val()).show();

		$("#runs-mode").change(function(e) {
			$(".runs-input").hide();
			$("#" + this.value).show();
		});

		var readListFile = function(e) {
			var reader = new FileReader();
			reader.onload = function(e) {
				runsList = reader.result.match(/[0-9]+/g).map(x => parseInt(x));
			};
			reader.readAsText(this.files[0]);
		};

		$("#list-file").change(readListFile).val("");

		$("#search").click(
			function() {
				year = $("#year").val();
				dataSet = $("#dataSet").val();
				apvMode = $("#apvMode").val();
				subsystem = $("#subsystem").val();

				if (year == "" || dataSet == "" || apvMode == "" || subsystem == "") {
					alert("Please Make Selection");
				} else {
					update_url(apvMode, dataSet, subsystem, year);
					console.log("update_url executed.............");
					if (dataSet == "ZeroBias"
							&& subsystem == "Pixel"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("Pixel");
					}else if (dataSet == "ZeroBias"
						  && subsystem == "PixelPhase1"
						  && (apvMode == "" || apvMode == null)) {
					    load_dataset("PixelPhase1");
					} else if (dataSet == "ZeroBias"
							&& subsystem == "Tracking"
							&& apvMode == "PEAK + DECO") {
						load_dataset("Tracking");
					} else if (dataSet == "ZeroBias"
							&& subsystem == "RecoErrors"
							&& apvMode == "PEAK + DECO") {
						load_dataset("RecoErrors");
					} else if (dataSet == "StreamExpress"
							&& subsystem == "Pixel"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("StreamExprPixel");
					} else if (dataSet == "StreamExpress"
						   && subsystem == "PixelPhase1"
						   && (apvMode == "" || apvMode == null)) {
					    load_dataset("StreamExprPixelPhase1");
					} else if (dataSet == "StreamExpress"
							&& subsystem == "RecoErrors"
							&& apvMode == "PEAK + DECO") {
						load_dataset("StreamExprRecoErrors");
					} else if (dataSet == "StreamExpress"
							&& subsystem == "Tracking"
							&& apvMode == "PEAK + DECO") {
						load_dataset("StreamExprTracking");
					} else if ((dataSet == "StreamExpress")
							&& subsystem == "Strips"
							&& (apvMode == "PEAK")) {
						load_dataset("StreamExpressStripPeak");
					} else if ((dataSet == "ZeroBias")
							&& subsystem == "Strips"
							&& (apvMode == "PEAK")) {
						load_dataset("StripPeak");
					} else if ((dataSet == "StreamExpress")
							&& subsystem == "Strips"
							&& (apvMode == "DECO")) {
						load_dataset("StreamExpressStripDeco");
					} else if ((dataSet == "ZeroBias")
							&& subsystem == "Strips"
							&& (apvMode == "DECO")) {
						load_dataset("StripDeco");
					} else if ( dataSet == "StreamExpressCosmics"
							&& subsystem == "Strips"
							&& (apvMode == "PEAK" )) {
						load_dataset("StripPeakExprCosmics");
					} else if ( dataSet == "StreamExpressCosmics"
							&& subsystem == "Strips"
							&& (apvMode == "DECO" )) {
						load_dataset("StripDecoStreamExpressCosmics");
					} else if ( dataSet == "StreamExpressCosmicsCommissioning"
							&& subsystem == "Strips"
							&& (apvMode == "PEAK" )) {
						load_dataset("StripPeakExprCosmicsCommissioning");
					} else if ( dataSet == "StreamExpressCosmicsCommissioning"
							&& subsystem == "Strips"
							&& (apvMode == "DECO" )) {
						load_dataset("StripDecoStreamExpressCosmicsCommissioning");
					} else if ( dataSet == "StreamExpressCosmics"
							&& subsystem == "Tracking"
							&& apvMode == "PEAK + DECO") {
						load_dataset("StreamExprCosmicTracking");
					} else if ( dataSet == "StreamExpressCosmics"
							&& subsystem == "Pixel"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("SreamExpressCosmicPixel");
					} else if ( dataSet == "StreamExpressCosmics"
							&& subsystem == "PixelPhase1"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("SreamExpressCosmicPixelPhase1");
					} else if ( dataSet == "StreamExpressCosmicsCommissioning"
							&& subsystem == "PixelPhase1"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("SreamExpressCosmicPixelPhase1Commissioning");
					} else if ( dataSet == "Cosmics" 
							&& subsystem == "Tracking"
							&& apvMode == "PEAK + DECO") {
						load_dataset("CosmicTracking");
					} else if ( dataSet == "Cosmics" 
							&& subsystem == "Pixel"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("CosmicPixel");
					} else if ( dataSet == "Cosmics" 
							&& subsystem == "PixelPhase1"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("CosmicPixelPhase1");
					} else if ( dataSet == "Cosmics"
							&& subsystem == "Strips"
							&& apvMode == "PEAK") {
						load_dataset("StripPeakCosmics");
					} else if ( dataSet == "Cosmics"
							&& subsystem == "Strips"
							&& apvMode == "DECO") {
						load_dataset("StripDecoCosmics");
					} else if ( dataSet == "Cosmics" 
							&& subsystem == "PixelPhase1"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("CosmicPixelPhase1");
					} else if ( dataSet == "Cosmics"
							&& subsystem == "Strips"
							&& apvMode == "PEAK") {
						load_dataset("StripPeakCosmics");
					} else if ( dataSet == "Cosmics"
							&& subsystem == "Strips"
							&& apvMode == "DECO") {
						load_dataset("StripDecoCosmics");
					} else if ( dataSet == "CosmicsCommissioning" 
							&& subsystem == "PixelPhase1"
							&& (apvMode == "" || apvMode == null)) {
						load_dataset("CosmicPixelPhase1Commissioning");
					} else if ( dataSet == "CosmicsCommissioning"
							&& subsystem == "Strips"
							&& apvMode == "PEAK") {
						load_dataset("StripPeakCosmicsCommissioning");
					} else if ( dataSet == "CosmicsCommissioning"
							&& subsystem == "Strips"
							&& apvMode == "DECO") {
						load_dataset("StripDecoCosmicsCommissioning");
					} else {
						$("#body").load("404page.html");
					}
				}
		});
});

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}