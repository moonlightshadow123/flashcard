var $detail = $("#detail");
var $word = $("#word");
var $idx = $("#idx");

var $flag = $("#flag");
var $input = $("#input");
var $searchBtn = $("#searchBtn");
var $randomBtn = $("#randomBtn");
var $resetBtn = $("#resetBtn");
var $nextBtn = $("#nextBtn");
var $prevBtn = $("#prevBtn");
var $voice = $(".voice");

var $listContainer = $("#listContainer");
var $detailContainer = $("#detailContainer");
var $listDiv = $("#listDiv");
var simpleBar;

var $detail_temp = $(".detail_temp").clone();
$(".detail_temp").remove();
var $list_temp = $(".list_temp").clone();
$(".list_temp").remove();

var file_name = "csv/Korean Grammar Sentences by Evita.csv";
var file_length = 0;
var start_from = 1;
var cur_idx = 0;
var voc_idx = 0;
var num = 20;
var vars;

var host = "http://3.136.211.6:8080/"
//var host = "http://localhost:8080/"
var flag_url = host + "img/";
var tts_url = host + "tts";
var lang = "ko";
var rm_list = ["<b>", "</b>", "?"];

var msry;
var header;
var sliceData;
var curData;
var data;

function changeTitle(){
	document.title = file_name.split("/")[file_name.split("/").length-1];
	var flagurl = flag_url + lang + ".png";
	$flag.attr("src", flagurl);
	// Change icon
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    //link.type = 'image/x-icon';
    //link.rel = 'shortcut icon';
    link.href = flagurl;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function getUrlVars() {
    vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    if("file" in vars){
    	file_name = vars["file"];
    }
    if("start" in vars){
    	start_from = parseInt(vars["start"]);
    }
    if("num" in vars){
    	num = parseInt(vars["num"]);
    }
    if("lang" in vars){
    	lang = vars["lang"];
    }
    if("length" in vars){
    	file_length = parseInt(vars["length"]);
    	$("#fileLength").html(file_length.toString());
    }
    //return vars;
}

function rm_str(word){
	rm_list.forEach(function(ele, idx){
		word = word.replace(ele, "");
	});
	return word;
}

function tts(word){
	var url = tts_url + "?lang=" + lang + "&word=" +rm_str(word);
	console.log(url);
	$.getJSON(url, function(data){
		url = data["url"];
		var a = new Audio(url);
    	a.play();
	});
}

function addData(results){
	header = results.data[0];
	data = results.data;
	sliceData = results.data.slice(start_from, start_from+num);
	console.log("Finished:", header, data);
}

function doMansry(){
	msry = $listDiv.masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 220
    });
}

function doSimpbar(){
	simpleBar = new SimpleBar($listContainer[0]);
	simpleBar.recalculate();
}

function genList(thedata){
	//$listDiv.children().remove();
	curData = thedata;
	if(msry!=null) msry.masonry("remove", $listDiv.children());
	$listDiv.children().remove();
	thedata.forEach(function(row, idx){
		var $list_item = $list_temp.clone();
		$list_item.find(".idx").html(row[0] + ". ");
		$list_item.find(".word").html(row[1]);
		$list_item.attr("data-idx", row[0]);
		$listDiv.append($list_item);
		//msry.masonry("addItems", $list_item);
	});
	if(msry!=null) {msry.masonry("addItems", $listDiv.children());msry.masonry();}
}

function genDetail(idx){
	cur_idx = idx;
	voc_idx = 0;
	var item = data[idx];
	var word = item[1];
	tts(word);
	$idx.html(idx);
	$word.html(word);
	$detail.children().remove();
	header.forEach(function(ele, h_idx){
		if(h_idx<=1){;//idx and word
		}else{
			var $entry = $detail_temp.clone();
			$entry.find(".key").html(header[h_idx] + ": ");
			$entry.find(".value").html(item[h_idx]);
			if(header[h_idx].includes("[voc]")){
				$entry.find(".voice").css("display", "");
			}
			$detail.append($entry);
		}
	});	
}

function search(string){
	var res = [];
	if(string.trim() == ""){ 
		return;
	}else{
	data.forEach(function(item, idx){
		if(idx<=0){;
		}else{
			for(var ele of item){
				if(ele.includes(string)){
					res.push(item);
					break;
				}
			}
		}
	});
	}
	genList(res);
	//doMansry();
	//doSimpbar();
}

function getNextIdx(){
	var $ele = $("div[data-idx=" + cur_idx.toString() + "]").next();
	if(!$ele.length){ // if there's no  cur_idx div.
		$ele = $("div[data-idx]").first();
	}
	return $ele.attr("data-idx");
}

function getPrevIdx(){
	var $ele = $("div[data-idx=" + cur_idx.toString() + "]").prev();
	if(!$ele.length){ // if there's no  cur_idx div.
		$ele = $("div[data-idx]").first();
	}
	return $ele.attr("data-idx");
}

function nextClick(){
	console.log("next");
	var idx = getNextIdx();
	//var item = curData[idx];
	genDetail(idx);
}

function prevClick(){
	console.log("prev");
	var idx = getPrevIdx();
	//var item = curData[idx];
	genDetail(idx);
}

function randomClick(){
	var len = curData.length;
	var idx = Math.floor(Math.random() * len);
	var item = curData[idx]
	genDetail(item[0]); 
}

function searchClick(){
	var val = $input.val();
	search(val);
	$input.val("");
	$input.blur();
}

function resetClick(){
	genList(sliceData);
}

function voiceClick($ele){
	if($ele.length == 0){ return;}
	var word = $ele.prev().text();
	tts(word);
}

function addListener(){
	$searchBtn.click(function(){
		searchClick();
	});

	$resetBtn.click(function(){
		resetClick();
	});

	$randomBtn.click(function(){
		randomClick()
	});

	$prevBtn.click(function(){
		prevClick();
	});

	$nextBtn.click(function(){
		nextClick();
	});

	$listDiv.on("click", ".list_temp", function(){
		genDetail($(this).attr("data-idx"));
	});
	$detailContainer.on("click", ".voice", function(){
		voiceClick($(this));
	});
}	

function keyBind(){
	$(document).keyup(function(e){
		if($input.is(":focus")){
			if(e.keyCode == "13"){ // enter
				searchClick();
			}else if(e.keyCode == "27"){ // escape
				$input.blur();
			}
			//return;			
		}else{
			if(e.keyCode == "39"){// right
				nextClick();
			}else if(e.keyCode == "37"){// left
				prevClick();
			}else if(e.keyCode == "38"){// up
				voiceClick($word.next());
			}else if(e.keyCode == "40"){ // down
				voiceClick($detail.find(".voice:visible:eq("+voc_idx.toString()+")"));
				voc_idx += 1;
			}else if(e.keyCode == "13"){ // enter
				randomClick();
			}else if(e.keyCode == "27"){ // escape
				$input.focus();
			}else if(e.keyCode == "17"){ // ctrl
				resetClick();
			}
		}
	});
}

$(function(){
	getUrlVars();
	changeTitle();
	keyBind();
	$.get(file_name, function(content){
		Papa.parse(content, {
			complete: function(results) {
				addData(results);
				genList(sliceData);
				doMansry();
				doSimpbar();
				addListener();
			}
		});
	});

    /*
    grid.on( 'layoutComplete', function(){
    	alert("hello");
    });*/
    //$listContainer.height(300);
	
    //$listDiv.css("height", "200px");
});
