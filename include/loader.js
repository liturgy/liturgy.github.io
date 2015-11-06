$.routes({'/': function(){$('.wrap-main').load('sites/home.html',function(response ,status,
                                                         xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
        $(".wrap-aside").load('sites/' + params.folder + '/_aside_menu.html', function(response, status, xhr) {
            if(status == "error") {
                $(".wrap-aside").html("");
            }
        });
        colorize();
    },
    '/:name': function(params){
        $('.wrap-main').load('sites/' + params.name + '.html', function(response,
                                                                        status,
                                                                        xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
        $(".wrap-aside").load('sites/' + params.folder + '/_aside_menu.html', function(response, status, xhr) {
            if(status == "error") {
                $(".wrap-aside").html("");
            }
        });
        colorize();
    },
    '/:folder/:name': function(params){
        $('.wrap-main').load('sites/' + params.folder +
            '/' + params.name + '.html', function(response,
                                                  status,
                                                  xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
        $(".wrap-aside").load('sites/' + params.folder + '/_aside_menu.html', function(response, status, xhr) {
            if(status == "error") {
                $(".wrap-aside").html("");
            }
        });
        colorize();
    },
    '/:folder/:name/:anchor': function(params){
        $('.wrap-main').load('sites/' + params.folder +
            '/' + params.name + '.html', function(response,
                                                  status,
                                                  xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            } else {
                $(window).scrollTop($('#' + params.anchor).offset().top);
            }
        });
    }
});

function colorize() {
    $('.wrap-aside > ul a[href=' + window.location.hash + ']').addClass("current-page");
}
