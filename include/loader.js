var lastVisitedURL = {"folder": "home", "name": ""};

$.routes({
    "/": loadHome,
    "/home": loadHome,

    "/:folder/": function(param){
        $.ajax({
            type: "GET",
            url: "sites/"+param.folder+"/home.html",
            success: function(data){
                $("#content").html(data);
                loadAsideMenu(param);
            },
            error: function() {
                $("#content").load("404.html");
                colorize();
            },
            complete: function() {
                lastVisitedURL = param;
            }
        });
    },

    "/:folder/:file": function(param){
        $.ajax({
            type: "GET",
            url: "sites/"+param.folder+"/"+param.file+".html",
            success: function(data){
                $("#content").html(data);
                loadAsideMenu(param);
            },
            error: function() {
                $("#content").load("404.html");
                colorize();
            },
            complete: function() {
                lastVisitedURL = param;
            }
        });
    },

    "/:folder/:file/:anchor": function(param){
        if(lastVisitedURL.folder != param.folder ||
            lastVisitedURL.file != param.file) {
            $.ajax({
                type: "GET",
                url: "sites/"+param.folder+"/"+param.file+".html",
                success: function(data){
                    $("#content").html(data);
                    loadAsideMenu(param);
                },
                error: function() {
                    $("#content").load("404.html");
                    colorize();
                },
                complete: function() {
                    lastVisitedURL = param;
                }
            });
        }
        $(window).scrollTop($('#' + param.anchor).offset().top);
    }
});


function loadHome(){

    $.ajax({
        type: "GET",
        url: "sites/home/home.html",
        success: function(data){
            $("#content").html(data);
            loadAsideMenu({"folder": "/"});
        },
        error: function() {
            $("#content").load("404.html");
            colorize();
        },
        complete: function() {
            lastVisitedURL = {"folder": "/home/", "name": ""};
        }
    });
}

function loadAsideMenu(param) {
    if(param.folder != lastVisitedURL.folder) {
        $.ajax({
            method: "GET",
            url: function () {
                if (param.folder == "/") {
                    console.log("sites/home/aside_menu.html");
                    return "sites/home/aside_menu.html";
                }
                else {
                    console.log("sites/" + param.folder + "/aside_menu.html");
                    return "sites/" + param.folder + "/aside_menu.html";
                }
            }(),
            success: function (data) {
                $(".wrap-aside").html(data);
            },
            complete: function(){
                colorize();
            }
        });
    } else {
        colorize();
    }


}

function colorize() {
    removeColor();
    $('.wrap-aside > ul a[href=' + window.location.hash + ']').addClass("current-page");
}

function removeColor() {
    $('.wrap-aside > ul a').removeClass("current-page");
}