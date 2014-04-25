$(document).ready(function(){    var git_url = "https://api.github.com/";    $.getJSON(git_url + 'users/globocom/repos', function(data){        data.sort(function(a,b){return parseInt(b.stargazers_count) - parseFloat(a.stargazers_count)});        var items = [];                $.each(data, function(key, val){            items.push("<li><a href='#" + val.name + "'>" + val.name + "</a></li>");        });                $('#menu').append(items.join(""));                $('#right_container').height($('#left_container').height());                $("#menu").on("click", 'li > a', function(){            // TRANSFORMAR ISSO EM FUNCAO            $("#menu > li").removeClass('active');            $(this).parent().addClass('active');            $.getJSON(git_url + 'repos/globocom/' + $(this).text(), function(data){                $('#stars').html('stars ' + data.stargazers_count);                $('#forks').html('forks ' + data.forks_count);                $.getJSON(git_url + 'repos/globocom/' + data.name + '/contributors', function(data){                    $('#contribs').html('contribs ' + data.length);                });                // $('#contribs').html('contribs ' + data.contribs_count);            });            $('#repo_details').show();        });        var hash = window.location.hash;        if(hash){            // USAR FUNCAO            $("#menu > li").removeClass('active');                        $("#menu > li > a[href='"+hash+"']").parent().addClass('active');        }    });});