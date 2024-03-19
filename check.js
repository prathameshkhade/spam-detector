

function checkGoogleSafeBrowser() {
    const url = document.getElementById('url').value;
    const API_KEY = "AIzaSyCTB1NKJ4iXUbeTUyw0Czpl-qH_GxJelmk";
    fetch(`https://safebrowsing.googleapis.com/v4/threatning_siteskey=${API_KEY}&url=${url}`)
    .then(Response => Response.json())
    .then(data => {
        if(data.threatType && data.threatTypes.length > 0) {
            console.log('unsafe url');
            alert("unsafe")
            console.log('Threats:');
            data.threatTypes.array.forEach(element => {
                console.log(`~ ${element}`);
            });
        }
        else {
            console.log('safe');
            alert('safe')
        }
    })
    .catch(error => console.error("Error:", error));
}

function checkPhishTank() {
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
}


async function checkHttpsCertificate(url) {
    // fetch the certificate
    try {
        const res = await fetch(url);
        const cert = await res.getCertificate();
    }
    catch (error) {
        console.error('Error fetching certificate:', error);
        return false; // indicates failure
    }

    // code for validation check
    if(res.protocol !== 'https:') {
        console.log(`not using HTTPS`);
        return false;
    }

    if(!cert) {
        console.error('Not a valid certificate');
        return false;
    }

    // Check for a trusted certificate authority
    const trustedCAs = ['DigiCert', 'Let\'s Encrypt', 'GlobalSign', 'GoDaddy'];
    const issuer = certificate.issuer;
    if (!trustedCAs.includes(issuer)) {
    console.warn('Certificate issuer not recognized as a trusted CA:', issuer);
    }

    // Check for an EV certificate (optional)
    const isEV = certificate.extendedKeyUsage && certificate.extendedKeyUsage.includes('1.3.6.1.5.5.7.3.2');
    console.log('Website uses an EV certificate:', isEV);
}
function Term(){
    document.write("This is my project and i am fucking owner of it")
}
