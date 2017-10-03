var $chirpButton = $('#chirp-submit');
var $chirpField = $('#chirp-input-box');
var $chirpList = $('#chirp-field');
var $userSelector = $('#dropdown');

$chirpField.on('input', function() {
    var isEmpty = $chirpField.val().length === 0;
    $chirpButton.prop('disabled', isEmpty);
});
$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        userid: $userSelector.val()
    };
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps',
    }).then(function(chirps) {
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++) {
            addChirpDiv(chirps[i]);
        }
    }, function(err) {
        console.log(err);
    });
}
getChirps();

function addChirpDiv(chirp) {
    var $chirpDiv = $('<div class="chirp-div"></div>');
    var $message = $('<p></p>');
    var $user = $('<h4></h4>');
    var $timestamp = $('<h5></h5>');
    var $delButton = $('<button class="delete-button"><span class="glyphicon glyphicon-trash"></span></button>');
    $delButton.click(function() {
        deleteChirp(chirp.id);
    });

    $message.text(chirp.message);
    $user.text(chirp.userName);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $message.appendTo($chirpDiv);
    $user.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $delButton.appendTo($chirpDiv);

    $chirpDiv.appendTo($chirpList);
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function() {
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function populateUsers() {
    $.ajax({
        method: 'GET',
        url: '/api/users'
    }).then(function(users) {
        for (var i = 0; i < users.length; i++) {
            var $userOption = $('<option value="' + users[i].id + '">' + users[i].name + '</option>');
            $userSelector.append($userOption);
        }
    }, function(err) {
        console.log(err);
    });
}
populateUsers();