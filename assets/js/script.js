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

    if(!platform) platform = "ios";

    if(!version) version = "4.0.0";

    $('#radio-' + platform).parent('label').addClass('active').siblings('label').removeClass('active');

    $("#dropdown-version-title").html(version); 

    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh');
    });

    $("input[type=radio][name='options']").click(function(){
        $(this).parent('label').addClass('active').siblings('label').removeClass('active');
    }).on('change', function () {
        loadContent($(this).val(), $("#dropdown-version-title").text());
    });

    loadContent(platform, version);
});

/** It loads all the contents one-by-one in the index.html **/
function loadContent(platform, version){

    $.ajax("content/" + version + "/menu-options.json", {
        success: function(data) {
            $('ul#nav').empty();
            $("div#content").empty();

            for(var i in data){
                //console.log(data[i][0]);

                var innerHtmlMenu = "<li><a href='#" + data[i][0] + "'>" + data[i][1] + "</a>";
                $("div#content").append("<section id='" + data[i][0] + "'></section>");

                loadPage("./content/" + version + "/" + platform + "/" + data[i][0] + ".html", "#" + data[i][0]); 

                var sub = data[i][2];
                if (sub.length != 0) {
                    innerHtmlMenu += "<ul id=\"sub-nav\" class='nav'>";

                    for (j = 0; j < sub.length; j++) {
                        innerHtmlMenu += "<li><a href='#" + sub[j].toLowerCase() + "'><span class='fa fa-angle-double-right'></span>" + sub[j] + "</a></li>";
                    }                        
                }

                $("ul#nav").append(innerHtmlMenu);                        
            }
        },
        error: function() {
            //$('#notification-bar').text('An error occurred');
            alert("Error Json");
        }
    });

    var url =  returnURL() + "?platform=" + platform + "&version=" + version;
    //console.log(url);
    history.pushState("page", "caption", url);

    // if (platform === "android") {
    //     $("#radio-ios").parent().removeClass("active");
    //     $("#radio-android").parent().addClass("active");
    //     console.log("AAAA")
    // } else {
    //     $("#radio-ios").parent().addClass("active");
    //     $("#radio-android").parent().removeClass("active");
    //     console.log("BBBB")
    // }


    console.log("#radio-" + platform);


    //$("input[value=android]").attr('checked', 'checked').change(); 

    //$("#radio-android").change();

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
function getQueryVariable(variable){
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars[variable] ? vars[variable] : false;
}

/** Update the dropdown version title **/
$(".dropdown-menu").on('click', 'li a', function () {
    $('#dropdown-version-title').html($(this).html());
    loadContent($('input[name=options]:checked').val(), $("#dropdown-version-title").text());
});
$('ul#nav').empty();

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