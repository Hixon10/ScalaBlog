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
        'url': '/admin/category',
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
        'url': '/admin/post',
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
        postsHtml += '<p class="blog-post-meta">' + posts[i].createdDate.month + ' ' + posts[i].createdDate.dayOfMonth + ', ' + posts[i].createdDate.year + '</p>';
        postsHtml += '<div>' + posts[i].content + '</div>';
        postsHtml += '</div>';
    }

    $("#contentContainer").html(postsHtml);
}

function insertAllCategories() {
    var categoriesHtml = "";

    for (var i = 0; i < categories.length; i++) {
        categoriesHtml += '<li><a data-category_title="' + categories[i].title + '" class="categoryLink" href="#">' + categories[i].title + '</a></li>';
    }

    $('#categoryList').html(categoriesHtml);
}

function searchPosts() {
    var query = $('#s').val();

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'GET',
        'url': '/post/search?query=' + query,
        'dataType': 'json',
        success: function(result) {
            insertPosts(result);
        }
    });
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

        for (var i = 0; i < categories.length; i++) {
            if (categories[i].title == categoryTitle) {
                insertPosts(categories[i].posts);
                break;
            }
        }
    });
});