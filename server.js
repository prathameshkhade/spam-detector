const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Set the static folder for your website's files
app.use(express.static(path.join(__dirname, 'public')));

// check ssl certificate validity
function validateSslCertificate(req, res) {

	const https = require('https');
	const tls = require('tls');
 	
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


// Write all the GET request here
app.get('/call-fun1', );
app.get('/call-fun2', validateSslCertificate);



app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`Visit http://127.0.0.1:${port}`);
	console.log(`Visit http://localhost:${port}`);
});

