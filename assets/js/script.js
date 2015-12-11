$('#nav').affix({
    offset: {     
      top: $('#nav').offset().top,
      bottom: ($('footer').outerHeight(true) + $('.application').outerHeight(true)) + 40
    }
});

/** Do some stuff when the page is completely loaded **/
$( document ).ready(function() {
    loadContent();
});

/** It loads all the contents one-by-one in the index.html **/
function loadContent(){
    loadPage("content/introduction.html", "#web-design");
    loadPage("content/get-started.html", "#web-development");
    loadPage("content/sale.html", "#sale");
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