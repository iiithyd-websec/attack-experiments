
var corsLib = {
makeCORSRequest: function(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Safari/Firefox.
                xhr.withCredentials = true;
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // Browser doesn't support CORS
        xhr = null;
    }
    return xhr;
},
get: function (getUrl) {
    var url = getUrl;
    var xhr = this.makeCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    xhr.onload = function () {
        var text = xhr.responseText;
                //console.log('CORS request URL: \n' + url + '\n\nCORS Response: \n' + text);
    };

    xhr.onerror = function (err) {
        //console.log(err);
    };

    xhr.send();
},
post: function (postUrl, params) {
        var url = postUrl;
        //var params = 'name=' + txtName;

        var xhr = this.makeCORSRequest('POST', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        xhr.onload = function () {
            var text = xhr.responseText;
            //console.log('CORS request URL: \n' + url + '\n\nCORS Response: \n' + text);
        };

        xhr.onerror = function () {
            //console.log('Woops, there was an error making the request.');
        };
        
        xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
        xhr.send(params);
    }
}
