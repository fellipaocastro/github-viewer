$( document ).ready(function() {    var pathname = window.location.pathname;    console.log( pathname );    $("#menu > li > a").on("click", function(){        $("#menu > li").removeClass('active');        $(this).parent().addClass('active');        return false;    });});