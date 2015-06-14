"use strict";

$( document ).ready( function() {
    var GITHUB_API = 'https://api.github.com/',
        GITHUB_USERNAME = 'fellipecastro',
        PER_PAGE = 20;

    var hash = window.location.hash.split('#')[1],
        more = $( '#more' ),
        currentProject;

    $.getJSON( GITHUB_API + 'users/' + GITHUB_USERNAME + '/repos', function( repositories ) {
        repositories.sort( function( a, b ) {
            return parseInt( b.stargazers_count ) - parseInt( a.stargazers_count )
        });

        var items = [];
        
        $.each( repositories, function( key, repository ) {
            var item = '<li><a id="' + repository.name + '" href="#' + repository.name + '">' + repository.name + '</a></li>';

            items.push( item );
        });
        
        $( '#menu' ).html( items.join( '' ) );

        $( '#right_container' ).height( $( '#left_container' ).height() );

        if ( hash ) {
            $( '[id="' + hash + '"]' ).trigger( 'click' );
        }
    });

    var getCommits = function( repository, lastSha, action ) {
        more.hide();

        $.getJSON( GITHUB_API + 'repos/' + GITHUB_USERNAME + '/' + repository + '/commits?per_page=' + parseInt( PER_PAGE + 1 ) + '&last_sha=' + lastSha, function( commits ) {
            var items = [];

            $.each( commits, function( key, commit ) {
                var date = commit.commit.author.date;
                date = date.split( 'T' )[ 0 ];
                date = date.split( '-' );
                date = date[ 2 ] + '/' + date[ 1 ] + '/' + date[ 0 ];

                if ( key == PER_PAGE ) {
                    more.show();
                } else {
                    var item = '<div class="panel panel-default">\
                        <div class="panel-body">\
                            <div class="grey-box">';
                            if ( commit.author != null ){
                                item += '<img alt="" src="' + commit.author.avatar_url + '">';
                            }
                            item += '</div>\
                                <div class="commit-main">\
                                    <div class="commit-title">' + commit.commit.message + '</div>\
                                    <div class="commit-author">@' + commit.commit.author.name + '</div>\
                            </div>\
                            <div class="commit-date">' + date + '</div>\
                        </div>\
                    </div>';

                    items.push( item );
                    
                    if( key < PER_PAGE ) {
                        $( '#last_sha' ).html( commit.sha );
                    }
                }
            });

            if ( action == 'append' ) {
                $( '#commits' ).append( items.join( '' ) );
            } else if ( action == 'html' ) {
                $( '#commits' ).html( items.join( '' ) );
            }
        });
    }

    $( window ).hashchange( function() {
        hash = window.location.hash.split('#')[1],

        $( '#menu > li' ).removeClass( 'active' );

        $( '[id="' + hash + '"]' ).parent().addClass( 'active' );

        $.getJSON( GITHUB_API + 'repos/' + GITHUB_USERNAME + '/' + $( '[id="' + hash + '"]' ).text(), function( repository ) {
            currentProject = repository.name;

            $( '#stars' ).html( 'stars ' + repository.stargazers_count );

            $( '#forks' ).html( 'forks ' + repository.forks_count );

            $.getJSON( GITHUB_API + 'repos/' + GITHUB_USERNAME + '/' + currentProject + '/contributors', function( contributors ) {
                $( '#contribs' ).html( 'contribs ' + contributors.length );
            });

            getCommits( currentProject, '', 'html' );
        });

        $( '#repo_details' ).show();

        $( 'html, body' ).scrollTop( 0 );
    });

    more.on( 'click', function( e ) {
        getCommits( currentProject, $( '#last_sha' ).html(), 'append' );
        
        e.preventDefault();
    });
});
