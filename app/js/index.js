//CLIENT_ID - heroku
//var CLIENT_ID = '223087526287-k0h09nr6ah0ebbsdunaugel5bodnt3uh.apps.googleusercontent.com';
var CLIENT_ID = '158326088006-mm87jap1ulid7jq23dsp23hvgg7gf4mq.apps.googleusercontent.com'; // Aleksander
//var CLIENT_ID = '223087526287-j631u4mj7s6g7rptvplu4457i0igvojh.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

var fileId = null;

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
        function(){});
}

function saveFileOnGoogleDrive(fileName) {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        function (result) {
            handleAuthResult(result, fileName);
        });
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 * @param fileName name of the file
 */
function handleAuthResult(authResult, fileName) {
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        var fileContent = document.getElementById('mathExpression').value;
        var myBlob = new Blob([fileContent], {type : 'text/plain'});
        myBlob.name = fileName;
        myBlob.fileId = fileId;

        gapi.client.load('drive', 'v2', function() {
            insertFile(myBlob);
            alert("File successfully saved.");
        });
    } else {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    }
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 */
function insertFile(fileData) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': fileData.name+".txt",
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

        var requestPath = '/upload/drive/v2/files';
        if (fileData.fileId != null) {
            requestPath += "/" + fileData.fileId;
        }

        var request = gapi.client.request({
            'path': requestPath,
            'method': fileData.fileId ? "PUT" : "POST",
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});

        var callback = function(file) {
            fileId = file.id;
        };

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
                        $('#mathExpression').val("");
                        setLatexExpression(myXHR.response);

                    }
                }
            };
            myXHR.send();
        }
    });
}

//function executePrintFile() {
//    var fileId = $('#fileIdLoadFromGoogleDrive').val();
//    printFile(fileId)
//}

function retrieveFileFromGoogleDrive() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        retrieveAllFiles);
}

/**
 * Retrieve a list of File resources.
 *
 * @param {Function} callback Function to call when the request is complete.
 */
function retrieveAllFiles(authResult) {
    if (authResult && !authResult.error) {
        var request = gapi.client.request({
            'path': '/drive/v2/files?q=\'root\' in parents',
            'method': 'GET',
            'callback': function (result) {


                for (var i = 0; i < result.items.length; i++) {
                    result.items[i].key = i + 1;
                    result.items[i].id_abbr = result.items[i].id.substring(0, 10) + "...";
                }
                var tableCode = Mustache.render($('#template').html(), { items: result.items });

                $("#filesListDiv").append(tableCode);
            }
        });
    } else {
        $("#closeModalFiles").click();
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            retrieveAllFiles);
    }
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
