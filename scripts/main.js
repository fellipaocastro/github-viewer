$(document).ready(function(){    var git_url = "https://api.github.com/";    $.getJSON(git_url + 'users/globocom/repos', function(data){        data.sort(function(a,b){return parseInt(b.stargazers_count) - parseFloat(a.stargazers_count)});        var items = [];                $.each(data, function(key, val){            items.push("<li><a id='" + val.name + "' href='#" + val.name + "'>" + val.name + "</a></li>");        });                $('#menu').html(items.join(""));                $("#menu").on("click", 'li > a', function(){            $("#menu > li").removeClass('active');            $(this).parent().addClass('active');            $.getJSON(git_url + 'repos/globocom/' + $(this).text(), function(data){                $('#stars').html('stars ' + data.stargazers_count);                $('#forks').html('forks ' + data.forks_count);                $.getJSON(git_url + 'repos/globocom/' + data.name + '/contributors', function(data){                    $('#contribs').html('contribs ' + data.length);                });                var last_sha;                function get_commits(repo, last_sha='', per_page=20){                    $('#mais').hide();                    $.getJSON(git_url + 'repos/globocom/' + repo + '/commits?per_page=' + parseInt(per_page + 1) + '&last_sha=' + last_sha, function(data){                        var items = [];                        $.each(data, function(key, val){                            var date = val.commit.author.date;                            date = date.split('T')[0];                            date = date.split('-');                            date = date[2] + '/' + date[1] + '/' + date[0];                            if(key == per_page){                                $('#mais').show();                            } else{                                commit = "<div class='panel panel-default'>\                                    <div class='panel-body'>\                                        <div class='grey-box'>";                                        if(val.author != null){                                            commit += "<img src='" + val.author.avatar_url + "' />";                                        }                                        commit += "</div>\                                            <div class='commit-main'>\                                                <div class='commit-title'>" + val.commit.message + "</div>\                                                <div class='commit-author'>@" + val.commit.author.name + "</div>\                                        </div>\                                        <div class='commit-date'>" + date + "</div>\                                    </div>\                                </div>";                                items.push(commit);                                                                if(key < per_page){                                    $('#last_sha').html(val.sha);                                }                            }                        });                        $('#commits').append(items.join(""));                    });                }                get_commits(data.name);                                $("#mais").on("click", function(e){                    get_commits(data.name, $('#last_sha').html());                                        e.preventDefault();                });            });            $('#repo_details').show();        });        var hash = window.location.hash;        if(hash){            $(hash).trigger('click');        }    });});