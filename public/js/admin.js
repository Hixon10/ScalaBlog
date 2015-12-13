"use strict";

var posts = [];
var categories = [];

function getLogin() {
    return Cookies.get('login');
}

function setLogin(login) {
    Cookies.set('login', login, { expires: 7 });
}

function getPassword() {
    return Cookies.get('password');
}

function setPassword(pas) {
    Cookies.set('password', pas, { expires: 7 });
}

function loginF() {
    var log  = $('#loginLogin').val();
    var pas = $('#passwordLogin').val();

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': '/account/login',
        'async': false,
        'data': JSON.stringify({'login': log, 'password': pas}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                alert(response.message);
                location.reload(true);
            }
        }
    });

    setLogin(log);
    setPassword(pas);

    $('#registerLink').addClass('hidden');
    $('#loginLink').addClass('hidden');

    $('#logoutLink').removeClass('hidden');
    $('#logoutLink').text('Привет, ' + getLogin() + '. Выйти.');

    $('#loginModal').modal('toggle');
}

function register() {
    var login = $('#login').val();
    var password = $('#password').val();

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': '/account/register',
        'async': false,
        'data': JSON.stringify({'login': login, 'password': password}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                alert(response.message);
            }
        }
    });

    location.reload(true);
}

function updatePost() {
    var title = $('#updatedPostTitle').val();
    var id = $("#updatePost").data('post_id');
    var content = $('#updatedPostContent').val();
    var categoryId = $("#updatedPostCategory").find('option:selected').val();


    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'PUT',
        'url': '/admin/post/' + getLogin() + '/' + getPassword() + '?categoryId=' + categoryId + '&postId=' + id,
        'async': false,
        'data': JSON.stringify({'title': title, 'content': content}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                response = response["errors"][0];
                var message = response["defaultMessage"];
                alert(message);
            }
        }
    });

    location.reload(true);
}

function deletePost(id) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'DELETE',
        'url': '/admin/post/' + getLogin() + '/' + getPassword() + '?postId=' + id,
        'async': false,
        'dataType': 'json',
        success: function(result) {

        }
    });

    location.reload(true);
}

function createPost() {
    var title = $('#postTitle').val();
    var content = $('#postContent').val();
    var id = $("#postCategory").find('option:selected').val();

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': '/admin/post/' + getLogin() + '/' + getPassword() + '?categoryId=' + id,
        'async': false,
        'data': JSON.stringify({'title': title, content: content}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                alert(response.message);
            }
        }
    });

    location.reload(true);
}

function updateCategory() {
    var title = $('#categoryNewTitle').val();
    var id = $("#updateCategory").data('category_id');

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'PUT',
        'url': '/admin/category/' + getLogin() + '/' + getPassword() + '?categoryId=' + id,
        'async': false,
        'data': JSON.stringify({'title': title}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                alert(response.message);
            }
        }
    });

    location.reload(true);
}

function createCategory() {
	var title = $('#categoryTitle').val();

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': '/admin/category/' + getLogin() + '/' + getPassword(),
        'async': false,
        'data': JSON.stringify({'title': title}),
        'dataType': 'json',
        success: function(result) {
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = jqXHR.responseText;

            if (response) {
                response = JSON.parse(response);
                alert(response.message);
            }
        }
    });

    location.reload(true);
}

function deleteCategory(id) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'DELETE',
        'url': '/admin/category/' + getLogin() + '/' + getPassword() + '?categoryId=' + id,
        'async': false,
        'dataType': 'json',
        success: function(result) {

        }
    });

    location.reload(true);
}

function initCategories() {
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

    var htmlCategories = "";
    var selectCategories = "";

    for (var i = 0; i < categories.length; i++) {

        if (i == 0) {
            selectCategories += '<option selected="selected" value="' + categories[i].id + '">' + categories[i].title + '</option>';
        } else {
            selectCategories += '<option value="' + categories[i].id + '">' + categories[i].title + '</option>';
        }

        htmlCategories += '<tr>';
        htmlCategories += '<td>' + categories[i].title + '</td>';
        htmlCategories += '<td>';
        htmlCategories += '<button data-category_id="' + categories[i].id + '" type="button" class="updateCategoryButton btn btn-default btn-xs">Редактировать</button>';
        htmlCategories += '</td>';
        htmlCategories += '<td>';
        htmlCategories += '<button data-category_id="' + categories[i].id + '" type="button" class="deleteCategoryButton btn btn-danger btn-xs">Удалить</button>';
        htmlCategories += '</td>';
        htmlCategories += '</tr>';
    }

    $('#categoriesTable > tbody:last-child').append(htmlCategories);
    $("#postCategory").html(selectCategories);
    $("#updatedPostCategory").html(selectCategories);
}

function initPosts() {
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

    var postsHtml = "";

    for (var i = 0; i < posts.length; i++) {
        postsHtml += '<tr>';
        postsHtml += '<td>' + posts[i].title + '</td>';
        postsHtml += '<td>' + posts[i].createdDate.month + ' ' + posts[i].createdDate.dayOfMonth + ', ' + posts[i].createdDate.year + '</td>';
        postsHtml += '<td>';
        postsHtml += '<button data-post_id="' + posts[i].id + '" type="button" class="updatePostButton btn btn-default btn-xs">Редактировать</button>';
        postsHtml += '</td>';
        postsHtml += '<td>';
        postsHtml += '<button data-post_id="' + posts[i].id + '" type="button" class="deletePostButton btn btn-danger btn-xs">Удалить</button>';
        postsHtml += '</td>';
        postsHtml += '</tr>';
    }

    $('#postsTable > tbody:last-child').append(postsHtml);
}

function init() {
    initCategories();
    initPosts();

    if (getLogin()) {
        $('#registerLink').addClass('hidden');
        $('#loginLink').addClass('hidden');

        $('#logoutLink').removeClass('hidden');
        $('#logoutLink').text('Привет, ' + getLogin() + '. Выйти.');
    }
}

function logout() {
    $('#registerLink').removeClass('hidden');
    $('#loginLink').removeClass('hidden');

    $('#logoutLink').addClass('hidden');
    setLogin("");
    setPassword("");
}

$(document).ready(function() {
    init();

    $('#logoutLink').click(function(){
        logout();
    });

    $('#loginButton').on('click', function () {
        loginF();
    });

    $("#loginLink").click(function(){
        $('#loginModal').modal('toggle');
    });

    $('#registerButton').on('click', function () {
        register();
    });

    $("#registerLink").click(function(){
        $('#registerModal').modal('toggle');
    });

    $("#updatePost").click(function(){
        updatePost();
    });

    $(".updatePostButton").click(function(){
        var $el = $(this);
        var id = $el.data('post_id');
        var title = "";
        var content = "";

        for (var i = 0; i < posts.length; i++) {
            if (posts[i].id == id) {
                title = posts[i].title;
                content = posts[i].content;
                break;
            }
        }

        $("#updatePost").data('post_id', id);
        $("#updatedPostTitle").val(title);
        $("#updatedPostContent").val(content);

        $('#updatePostModal').modal('toggle');
    });

    $('.deletePostButton').on('click', function () {
        var $el = $(this);
        var id = $el.data('post_id');
        deletePost(id);
    });

    $(".createPost").click(function(){
        createPost();
        $('#editPostModal').modal('toggle');
    });

    $("#saveCategory").click(function(){
        createCategory();
		$('#editCategoryModal').modal('toggle');
    });

    $("#updateCategory").click(function(){
        updateCategory();
    });

    $(".updateCategoryButton").click(function(){
        var $el = $(this);
        var id = $el.data('category_id');
        var title = "";

        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == id) {
                title = categories[i].title;
                break;
            }
        }

        $("#updateCategory").data('category_id', id);
        $("#categoryNewTitle").val(title);

        $('#updateCategoryModal').modal('toggle');
    });

    $('.deleteCategoryButton').on('click', function () {
		var $el = $(this);
		var id = $el.data('category_id');
		deleteCategory(id);
	});
});