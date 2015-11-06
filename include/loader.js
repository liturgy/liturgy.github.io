$.routes({'/': function(){$('.wrap-main').load('sites/home.html',function(response ,status,
                                                         xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
    $.ajax({
        url: 'sites/' + params.folder +
        '/_aside_menu.html',
        success: function(result){
            $('.wrap-aside' ).html(result);
            colorize();
        },
        error: function(xhr, status, error) {
            $.ajax({
                url: 'aside_menu.html',
                success: function(result){
                    $('.wrap-aside' ).html(result);
                    colorize();
                },
                async: false
            });
        },
        async: false
    });
    },
    '/:name': function(params){
        $('.wrap-main').load('sites/' + params.name + '.html', function(response,
                                                                        status,
                                                                        xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
        $.ajax({
            url: 'sites/' + params.folder +
            '/_aside_menu.html',
            success: function(result){
                $('.wrap-aside' ).html(result);
                colorize();
            },
            error: function(xhr, status, error) {
                $.ajax({
                    url: 'aside_menu.html',
                    success: function(result){
                        $('.wrap-aside' ).html(result);
                        colorize();
                    },
                    async: false
                });
            },
            async: false
        });
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
        $.ajax({
            url: 'sites/' + params.folder +
            '/_aside_menu.html',
            success: function(result){
                $('.wrap-aside' ).html(result);
                colorize();
            },
            error: function(xhr, status, error) {
                $.ajax({
                    url: 'aside_menu.html',
                    success: function(result){
                        $('.wrap-aside' ).html(result);
                        colorize();
                    },
                    async: false
                });
            },
            async: false
        });
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