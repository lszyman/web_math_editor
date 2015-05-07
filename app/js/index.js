//CLIENT_ID - heroku
var CLIENT_ID = '223087526287-k0h09nr6ah0ebbsdunaugel5bodnt3uh.apps.googleusercontent.com';
//var CLIENT_ID = '158326088006-mm87jap1ulid7jq23dsp23hvgg7gf4mq.apps.googleusercontent.com'; // Aleksander
//var CLIENT_ID = '223087526287-j631u4mj7s6g7rptvplu4457i0igvojh.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authButton = document.getElementById('authorizeButton');
    var filePicker = document.getElementById('filePicker');
    authButton.style.display = 'none';
    filePicker.style.display = 'none';
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        filePicker.style.display = 'block';
        filePicker.onchange = uploadFile;
    } else {
        // No access token could be retrieved, show the button to start the authorization flow.
        authButton.style.display = 'block';
        authButton.onclick = function() {
            gapi.auth.authorize(
                {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                handleAuthResult);
        };
    }
}

/**
 * Start the file upload.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function uploadFile(evt) {
    gapi.client.load('drive', 'v2', function() {
        var file = evt.target.files[0];
        insertFile(file);
    });
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': fileData.name,
            'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        if (!callback) {
            callback = function(file) {
                console.log(file)
            };
        }
        request.execute(callback);
    }
}

/**
 * Print a file's content.
 *
 * @param {String} fileId ID of the file to print content for.
 */
function printFile(fileId) {
    var request = gapi.client.request({
        'path': '/drive/v2/files/' + fileId,
        'method': 'GET',
        callback: function ( theResponseJS, theResponseTXT ) {
            var myToken = gapi.auth.getToken();
            var myXHR   = new XMLHttpRequest();
            myXHR.open('GET', theResponseJS.downloadUrl, true );
            myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token);
            myXHR.onreadystatechange = function( theProgressEvent ) {
                if (myXHR.readyState == 4) {
                    //1=connection ok, 2=Request received, 3=running, 4=terminated
                    if ( myXHR.status == 200 ) {
                        console.log(myXHR.response);
                        $('#mathExpression').val(myXHR.response);
                    }
                }
            };
            myXHR.send();
        }
    });
}

function executePrintFile() {
    var fileId = $('#fileIdLoadFromGoogleDrive').val();
    printFile(fileId)
}


/**
 * Retrieve a list of File resources.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function retrieveAllFiles() {
    var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'callback': function(result) {


            var tableCode = "";
            for (var i = 0; i < result.items.length; i++) {
                var item = result.items[i];
                tableCode += "<tr><td>"  + i + "</td><td>" + item.title + "</td><td>" + item.id + "</td>" +
                "<td class='openFile' style='cursor:pointer' data-file='" + item.id + "'>" +
                "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span></td>" +
                "<td class='deleteFile' style='cursor:pointer' data-file='" + item.id + "'>" +
                "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span></td></tr>";
            }

            $("#filesList").css("display", "block");
            $("#filesList > tbody").html(tableCode);
        }
    });
}

function deleteFile(fileId) {
    var request = gapi.client.request({
        'path': '/drive/v2/files/' + fileId,
        'method': 'DELETE',
        'callback': function(result) {
            $("#refreshFilesListButton").click();
        }
    });
}
