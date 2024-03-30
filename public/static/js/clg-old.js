function checkGoogleSafeBrowser() {
    const url = document.getElementById('url').value;
    alert(url)
    const API_KEY = "AIzaSyCTB1NKJ4iXUbeTUyw0Czpl-qH_GxJelmk";
    fetch(`https://safebrowsing.googleapis.com/v4/threatning_siteskey=${API_KEY}&url=${url}`)
        .then(Response => Response.json())
        .then(data => {
            if (data.threatType && data.threatTypes.length > 0) {
                console.log('unsafe url');
                alert("unsafe")
                console.log('Threats:');
                data.threatTypes.array.forEach(element => {
                    console.log(`~ ${element}`);
                });
            } else {
                console.log('safe');
                alert('safe')
            }
        })
        .catch(error => console.error("Error:", error));
}

/*function checkPhishTank() {
    const API_KEY = "";
    fetch(`https://checkurl.phishtank.com/checkurlapikey=${API_KEY}&url=${url}`)
        .then(Response => Response.json())
        .then(data => {
            if(data.result === 'valid') {
                console.log('safe');
            }
            else {
                console.log('unsafe');
            }
        })
        .catch(err => console.error('Error: ', err));
}*/

function checkHttpsProtocol() {
    const url = document.getElementById('url').value;
    alert(url)
    const protocol = new URL(url).protocol;
    if (protocol === 'https:') {
        console.log('URL is using HTTPS protocol');
        alert('URL is using HTTPS protocol');
    } else {
        console.log('URL is not using HTTPS protocol');
        alert('URL is not using HTTPS protocol');
    }
}

// not working
function checkSSLCertificate() {
    const domain = document.getElementById('url').value;
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', `${domain}`, true);
    xhr.timeout = 4000; // Set a timeout of 4 seconds
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let serverName = xhr.getResponseHeader('X-SSL-Server-Name');
                let issuer = xhr.getResponseHeader('X-SSL-Issuer');
                let validFrom = new Date(serverName.slice(1, -1).split(',')[1].slice(13));
                let validTo = new Date(serverName.slice(1, -1).split(',')[2].slice(11));
                let now = new Date();

                if (now > validFrom && now < validTo) {
                    alert("SSL certificate is valid");
                } else {
                    alert("SSL certificate is NOT valid");
                }
            } else {
                alert("Error: Could not retrieve SSL certificate information");
            }
        }
    }
    xhr.ontimeout = function() {
        alert("Error: Request timed out");
    }
    xhr.send();
    return false;
}

function checkValidCACertificate() {
    const domain = document.getElementById('url').value;
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', `${domain}`, true);
    xhr.timeout = 4000; // Set a timeout of 4 seconds
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let issuer = xhr.getResponseHeader('X-SSL-Issuer');
                if (issuer.includes('CA')) {
                    alert("SSL certificate is issued by a valid CA");
                } else {
                    alert("SSL certificate is NOT issued by a valid CA");
                }
            } else {
                alert("Error: Could not retrieve SSL certificate information");
            }
        }
    }
    xhr.ontimeout = function() {
        alert("Error: Request timed out");
    }
    xhr.send();
    return false;
}

document.getElementById('checkButton').addEventListener('click', function() {
    // checkGoogleSafeBrowser();
    checkHttpsProtocol();
    // checkSSLCertificate();
    checkValidCACertificate();
});