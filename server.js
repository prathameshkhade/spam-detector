const express = require('express');
const path = require('path');
const https = require('https');
const tls = require('tls');

const app = express();
const port = process.env.PORT || 80;

// Set the static folder for your website's files
app.use(express.static(path.join(__dirname, 'public')));

//---------------- check ssl certificate validity --------------------

function validateSslCertificate(req, res) {

	const url = req.query.url;
	console.log(url);

	if(!url) {
		return res.status(400).send("Missing required paramaeter: url");
	}

	https.get(url, (res) => {
        	const socket = res.socket;
	
	      	// Extract certificate information
		const certificate = socket.getPeerCertificate();
	
	      	// Check for certificate validity period
	      	const currentDate = new Date();
		const validFrom = new Date(certificate.validFrom);           
		const validTo = new Date(certificate.validTo);

	      	if (currentDate < validFrom || currentDate > validTo) {
			console.log("noopee!"); 
			// return false;
		} 
		else {
	        	console.log("yesss!");
			//return true;
		}
			//.on('error', (error) => {                                      
		//	    reject(new Error(`Error during SSL check: ${error.message}`));
	});
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
		  				console.log("unsafe");
						//res.status(200).send("safe to browse!");
            					resolve({ safe: false, matches: responseObject.matches }); // URL is unsafe
          				} else {
		  				console.log("safe");
						//res.status(200).send("unsafe to browse!");
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
app.get('/check-url', async (req, res) => {
 	 const url = req.query.url; // Get URL from query parameter
 	 if (!url) {
   	 	return res.status(400).send('Missing required parameter: url');
 	 }

  	try {
    		const response = await checkUrlSafety(url);
    		if (response.safe) {
      			res.send('URL appears to be safe.');
    		} else {
     			 res.status(400).send('URL may be unsafe. Matches found: ' + JSON.stringify(response.matches));
    		}
  	} catch (error) {
    		console.error(error);
    		res.status(500).send('Error checking URL safety.');
  	}
});

//--------------------- END OF fun()  ------------------- 

// Write all the GET request here
app.get('/call-fun1', );
app.get('/call-fun2', validateSslCertificate);
// app.get('/call-fun3', checkUrlSafety);


app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`Visit http://127.0.0.1:${port}`);
	console.log(`Visit http://localhost:${port}`);
});

