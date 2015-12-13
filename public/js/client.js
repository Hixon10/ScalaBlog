"use strict";


var posts = [];
var categories = [];

function init() {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'GET',
        'url': '/category',
        'async': false,
        'dataType': 'json',
        success: function(result) {
            categories = result;
        }
    });

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'GET',
        'url': '/post',
        'async': false,
        'dataType': 'json',
        success: function(result) {
            posts = result;
        }
    });
}

function insertPosts(posts) {
    var postsHtml = "";

    for (var i = 0; i < posts.length; i++) {
        postsHtml += '<div class="blog-post">';
        postsHtml += '<h2 class="blog-post-title">' + posts[i].title + '</h2>';
        postsHtml += '<div>' + posts[i].content + '</div>';
        postsHtml += '</div>';
    }

    $("#contentContainer").html(postsHtml);
}

function insertAllCategories() {
    var categoriesHtml = "";

    for (var i = 0; i < categories.length; i++) {
        categoriesHtml += '<li><a data-category_title="' + categories[i].title + '" class="categoryLink">' + categories[i].title + '</a></li>';
    }

    $('#categoryList').html(categoriesHtml);
}

function searchPosts() {
    var query = $('#s').val();

    var p = [];

    for (var i = 0; i < posts.length; i++) {
        if (posts[i].title.indexOf(query) > -1) {
            p.push(posts[i]);
        }
    }

    insertPosts(p);
}

$(document).ready(function() {
    init();
    insertPosts(posts);
    insertAllCategories();


    $("#homePageLink").click(function(){
        insertPosts(posts);
    });

    $("#searchButton").click(function(){
        searchPosts();
        return false;
    });

    $('body').on('click', 'a.categoryLink', function() {
        var $el = $(this);
        var categoryTitle = $el.data('category_title');
        var p = [];

        var categoryId = 0;
        for (var j = 0; j < categories.length; j++) {
            if (categories[j].title == categoryTitle) {
                categoryId = categories[j].id;
                break;
            }
        }

        for (var i = 0; i < posts.length; i++) {
            if (posts[i].categoryId == categoryId) {
                p.push(posts[i])
            }
        }

        insertPosts(p);
        return;
    });
});