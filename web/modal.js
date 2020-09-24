var $navBtn = $("#navBtn");
var $content = $(".box");

var nav_on = false;
var nav_width = 250;

// Nav
var $navItems = $("#navItems"); 

$(".openNav").click(function(){
  if(nav_on)
    return;
  $("#mySidenav").css("width", nav_width);
  //$content.css("width", $content.width()-nav_width);
  $navBtn.css("display", "none"); 
  nav_on = true;
});

$(".closeNav").click(function(){
  if(!nav_on)
    return;
  //$content.css("width", $content.width($(window).width()));
  $("#mySidenav").css("width", "0");
  $navBtn.css("display", ""); 
  nav_on = false;
});

var dataUrl = "/data.json";
var indexUrl = "/index.html";

$(function(){
  $.ajax({
    url: dataUrl,
    dataType: "json",
    success:function(data){
      console.log(data);
      addNavItems(data);
    },
    error: function(){
      alert("Can't get Json data from '"+dataUrl+"'!");
    }
  });
});

function addNavItems(items){
    $navItems.children().remove();
    items.forEach(function(item){
        $navItems.append('<a class="navItem cut-text" href="#" data-url="'+item.url+'" data-lang="'+item.lang+'" data-length="'+item.length+'" >'+item.name+'</a>');
    }); 
}

$("body").on("click", ".navItem", function(){
    var url = buildUrl($(this).attr("data-url"),$(this).attr("data-lang"), $(this).attr("data-length"));
    openUrl(url);
});

var $startInput = $("#startInput");
var $numInput = $("#numInput");
var $jumpBtn = $("#jumpBtn");
var defaultStart = 1;
var defaultNum = 100;

$jumpBtn.click(function(){
  var start = getValue($startInput, defaultStart);
  var num = getValue($numInput, defaultNum);
  console.log(start);
  var url = buildUrl(file_name, lang, file_length, start=start, num=num);
  openUrl(url);
});

function buildUrl(file, lang, length, start=defaultStart, num=defaultNum){
  var url = indexUrl + "?file=" + file 
              + "&lang=" + lang 
              + "&length=" + length
              + "&start=" + start
              + "&num=" + num;
  return url;
}

function getValue($input, dflt){
  var value = parseInt($input.val());
  //console.log(value);
  if(!isNaN(value))
    return value;
  else{
    console.log("Wrong input! Using default value!");
    return dflt;
  }
}

function openUrl(url){
  console.log(url);
   window.open(url, "_self");
  //setTimeOut(()=>{ window.open(url, "_parent");}, 2000);
}

/*
$(window).on("resize", function(){
  var fullwidth = $("body")[0].offsetWidth;
  if(nav_on)
    $content.css("width", fullwidth-nav_width);
  else
    $content.css("width", fullwidth);
});*/

/*
$(function(){
  addNavItems(projs);
});

function addNavItems(projs){
    $navItems.children().remove();
    projs.forEach(function(proj){
        $navItems.append('<a class="navItem" href="#" data-id="'+proj.id+'">'+proj.name+'</a>');
    }); 
}

var indexUrl = "/index?projId=";

$("body").on("click", ".navItem", function(){
    var url = indexUrl + $(this).attr("data-id");
    openURL(url);
});

var newProjUrl = "/newProj?name=";
var deleteProjUrl = "/deleteProj?projId=";
var $newProjInput = $("#newProjInput");

$newProjBtn.click(function(){
    if($newProjInput.val()=="")
        dialogPop("Please Put in New Proj Name!");
    else{
        var name = $newProjInput.val();
        dialogPop("Are you sure to create new Proj '" +name+"'?",()=>{
            var url = newProjUrl + name;
            getData(url, (data)=>{addNavItems(data);$newProjInput.val("");})
        });
    }
});

$deleteProjBtn.click(function(){
    dialogPop("Are you sure to delete Proj with id '"+projId+"'?", ()=>{
        var url = deleteProjUrl + projId;
        getData(url, (data)=>{addNavItems(data);})
    });
});

*/
