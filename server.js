const express = require('express');
const path = require('path');
const https = require('https');
const tls = require('tls');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 80;

// Set the static folder for your website's files
app.use(express.static(path.join(__dirname, 'public')));

//---------------- check ssl certificate validity --------------------

function validateSslCertificate(URL) {

	return new Promise((resolve, reject) => {
		https.get(URL, (res) => {
				const socket = res.socket;
		
			// Extract certificate information
			const certificate = socket.getPeerCertificate();
		
			// Check for certificate validity period
			const currentDate = new Date();
			const validFrom = new Date(certificate.validFrom);           
			const validTo = new Date(certificate.validTo);

			if (currentDate < validFrom || currentDate > validTo) {
				console.log(URL, "unsafe", res.statusCode); 
				resolve(false);
			} 
			else {
				console.log(URL, "safe", res.statusCode);
				resolve(true);
			}
		});
	})
}

// -------------------------- END OF fun()  --------------------------


// ---------------- fun() for Checking google safe browsing  -------------------

// Replace with your actual Google Safe Browsing API key
const apiKey = "AIzaSyCTB1NKJ4iXUbeTUyw0Czpl-qH_GxJelmk";

function checkUrlSafety(url) {
	const encodedUrl = encodeURIComponent(url);
  	const options = {
		hostname: 'safebrowsing.googleapis.com',
		port: 443,
		path: `/v4/threatMatches:find?key=${apiKey}&threatTypes=MALWARE,PHISHING&platformType=WINDOWS`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
    		},
  	};

  	return new Promise((resolve, reject) => {
		const request = https.request(options, (response) => {
			let data = '';
			response.on('data', (chunk) => {
        			data += chunk;
			});
        	response.on('end', () => {
        		try {
					const responseObject = JSON.parse(data);
          			if (responseObject.matches && responseObject.matches.length > 0) {
		  				console.log(url, "\tunsafe");
            			resolve({ safe: false, matches: responseObject.matches }); // URL is unsafe
          			} 
					else {
		  				console.log(url, "\tsafe");
            			resolve({ safe: true }); // URL is likely safe
          			}
        		} 
			 	catch (error) {
          			reject(error);
       			}
      		});
    		});

    	request.on('error', (error) => {
     		reject(error);
    	});

   	 request.write(JSON.stringify({ client: { clientId: 'your-application-name' }, threatInfo: { threatTypes: ['MALWARE', 'PHISHING'], platformTypes: ['WINDOWS'], url: url } }));
    	request.end();
  	});
}

// Example usage (assuming you have a route handler in your server.js)
app.use(bodyParser.json());
app.get('/google-safe', async (req, res) => {
 	 const url = req.query.url; // Get URL from query parameter
 	 if (!url) {
   	 	return res.status(400).send('Missing required parameter: url');
 	 }

  	try {
    		const response = await checkUrlSafety(url);
    		if (response.ok && response.safe) {
      			return res.status(200).send('URL appears to be safe.');
    		} else {
     			return res.status(400).send('URL may be unsafe. Matches found: ' + JSON.stringify(response.matches));
    		}
  	} catch (error) {
    		console.error(error);
    		return res.status(500).send('Error checking URL safety.');
  	}
});

//--------------------- END OF fun()  -------------------
//
//------------------------- checking issuer or CA --------------

//--------------------- END of fun() -------------------------

// Write all the GET request here
app.get('/ssl-validation', async (req, res) => {

	const url = req.query.url; // Get URL from query parameter
    if (!url) {
        return res.status(400).send('Missing required parameter: url');
    }

	const isValid = await validateSslCertificate(url);

	if(isValid) {
		return res.status(200).send("valid date!");
	}
	else {
		return res.status(503).send("invalid date!");
	}
});


app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`Visit http://127.0.0.1:${port}`);
	console.log(`Visit http://localhost:${port }\n`);
	console.log(`\t\t Link \t\t|\t HTTPS \t|\t Certificate \t|\t Google \t`);
});

