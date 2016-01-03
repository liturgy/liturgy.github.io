var lastURL = null;
$.routes({'/': function(){$('.wrap-main').load('sites/home.html',function(response ,status,
                                                         xhr) {
            if(status == "error") {
                $('.wrap-main').load("404.html");
            }
        });
    $.ajax({
        url: 'sites/' + params.folder +
        '/aside_menu.html',
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
	lastURL = params;
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
            '/aside_menu.html',
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
		lastURL = params;
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
            '/aside_menu.html',
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
		lastURL = params;
    },
    '/:folder/:name/:anchor': function(params){ anchor(params); }
});

function anchor(params) {
	console.log(params);
	/*
	if(lastURL.folder == params.folder && lastURL.name == params.name) {
		console.log("$(window).scrollTop($('#' + params.anchor).offset().top)");
	} else {
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
	console.log("Something wrong")
	}
	*/
	console.log("Kliknięto!");
	lastURL = params;
}

function colorize() {
    $('.wrap-aside > ul a[href=' + window.location.hash + ']').addClass("current-page");
}