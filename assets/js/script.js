$('#nav').affix({
    offset: {     
        top: $('#nav').offset().top,
        bottom: ($('footer').outerHeight(true) + $('.application').outerHeight(true)) + 40
    }
});


/** Do some stuff when the page is completely loaded **/
$(document).ready(function() {
    var platform = getQueryVariable("platform");
    var version = getQueryVariable("version");
    
    if(platform === false)
        platform = "ios";
    
    if(version === false){
        version = "4.0.0";
    }
    
    $("#dropdown-version-title").html(version); 
    
    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh');
    });
    
    loadContent(platform, version);
    
    // Paralax
    var scene = document.getElementById('scene');
    var parallax = new Parallax(scene);
});

/** It loads all the contents one-by-one in the index.html **/
function loadContent(platform, version){
    loadMenu(version);
    
    //loadPage("content/" + version + "/floating-menu.html", "#nav");
    
    loadPage("content/" + version + "/" + platform + "/introduction.html", "#introduction");    
    loadPage("content/" + version + "/" + platform + "/download-page.html", "#download");    
    loadPage("content/" + version + "/" + platform + "/getting-started.html", "#getting-started");
    loadPage("content/" + version + "/" + platform + "/transactions.html", "#transactions");
    
    //$('input[value=android]').closest('.btn').button('toggle');    
    
    var url =  returnURL() + "?platform=" + platform + "&version=" + version;
    //console.log(url);
    history.pushState("page", "caption", url);
}

function returnURL(){     
    return $(location).attr('href').replace(/\?*platform=([A-Za-z]+)&version=([0-9\.]+)/g,"");
}

/**
    It loads an html page inside a div targeted by teh div id, and re-aply the code highlight,
    just in case there are some code snipper in the loaded page.
**/
function loadPage(page, target){
    $(target).load(page, function(){
        $('pre code').each(function(i, block) { 
            hljs.highlightBlock(block);
        });
    });
}

/** Get a value from a URL **/
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

/** Update the dropdown version title **/
$(".dropdown-menu").on('click', 'li a', function () {
    $('#dropdown-version-title').html($(this).html());
    loadContent($('input[name=options]:checked').val(), $("#dropdown-version-title").text());
});
$('ul#nav').empty();
$("#radio-group input").on('change', function () {
    loadContent($('input[name=options]:checked').val(), $("#dropdown-version-title").text());
});



/** Zip file **/
function zip(){
    var zip = new JSZip();

    var deferred = $.Deferred(),
        deferreds = [];

    $("#download_form").find(":checked").each(function () {
        var $this = $(this);
        var url = $this.data("url");
        var filename = url.replace(/.*\//g, "");
        deferreds.push(deferredAddZip(url, filename, zip));
    });

    $.when.apply($, deferreds).done(function () {

        var content = zip.generate({type:"blob"});
        // see FileSaver.js
        saveAs(content, "example.zip");
    });
}

function deferredAddZip(url, filename, zip) {    
    var deferred = $.Deferred();
    JSZipUtils.getBinaryContent(url, function (err, data) {
        if(err) {
            deferred.reject(err);
        } else {
            zip.file(filename, data, {binary:true});
            deferred.resolve(data);
        }
    });
    return deferred;
}

function loadMenu(version){
    //event.preventDefault();
    
    //$("#content").append("<li><a href='#" + data[i][0] + "'>" + data[i][1] + "</a></li>");

    $.ajax("http://127.0.0.1:47414/content/" + version + "/menu-options.json", {
            success: function(data) {
                $('ul#nav').empty();

                for(var i in data){
                    console.log(data[i][0]);
                    
                    var innerHtml = "<li><a href='#" + data[i][0] + "'>" + data[i][1] + "</a>";                    
                    
                    var sub = data[i][2];
                    if (sub.length != 0) {
                        innerHtml += "<ul id=\"sub-nav\" class='nav'>";
                        
                        for (j = 0; j < sub.length; j++) {
                            innerHtml += "<li><a href='#" + sub[j].toLowerCase() + "'><span class='fa fa-angle-double-right'></span>" + sub[j] + "</a></li>";
                        }                        
                    }
                    
                    $("ul#nav").append(innerHtml);                        
                }
            },
            error: function() {
                //$('#notification-bar').text('An error occurred');
                alert("Error Json");
            }
    });
    
}