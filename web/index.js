var $detail = $("#detail");
var $word = $("#word");

var $flag = $("#flag");
var $input = $("#input");
var $searchBtn = $("#searchBtn");
var $randomBtn = $("#randomBtn");
var $resetBtn = $("#resetBtn");

var $listContainer = $("#listContainer");
var $listDiv = $("#listDiv");
var simpleBar;

var $detail_temp = $(".detail_temp").clone();
$(".detail_temp").remove();
var $list_temp = $(".list_temp").clone();
$(".list_temp").remove();

var file_name = "csv/Korean Grammar Sentences by Evita.csv";
var start_from = 1;
var num = 20;
var vars;

var host = "http://3.136.211.6:8080/"
var flag_url = host + "img/";
var tts_url = host + "tts";
var lang = "ko";

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
    //return vars;
}

function tts(word){
	var url = tts_url + "?lang=" + lang + "&word=" + word;
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
	var item = data[idx];
	var word = item[1];
	tts(word);
	$word.html(word);
	$detail.children().remove();
	header.forEach(function(ele, h_idx){
		if(h_idx<=1){;//idx and word
		}else{
			var $entry = $detail_temp.clone();
			$entry.find(".key").html(header[h_idx] + ": ");
			$entry.find(".value").html(item[h_idx]);
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

function addListener(){
	$searchBtn.click(function(){
		var val = $input.val();
		search(val);
	});
	$resetBtn.click(function(){
		genList(sliceData);
		//doMansry()
	});
	$randomBtn.click(function(){
		var len = curData.length;
		var idx = Math.floor(Math.random() * len);
		var item = curData[idx]
		genDetail(item[0]); 
	});
	$listDiv.on("click", ".list_temp", function(){
		genDetail($(this).attr("data-idx"));
	});
}	

$(function(){
	getUrlVars();
	changeTitle();
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
