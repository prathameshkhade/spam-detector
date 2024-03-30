function validateSslCertificate(url) {
console.log(url)
const https = require('https');
const tls = require('tls');
  try {
    const socket = https.get(url).socket;
    const certificate = socket.getPeerCertificate();

    const currentDate = new Date();
    const validFrom = new Date(certificate.validFrom);
    const validTo = new Date(certificate.validTo);

    if (currentDate < validFrom || currentDate > validTo) {
      return false; // Certificate is not valid
    }

    // Perform additional checks if needed (e.g., certificate chain validation)
    // ...

    return true; // Certificate is valid
  } catch (error) {
    console.error(`Error during SSL check: ${error.message}`);
    return false; // Indicate error
  }
}

// Example usage
const url = 'https://www.kali.org';

const isValid = validateSslCertificate(url);

if (isValid) {
  console.log('SSL certificate is valid');
} else {
  console.error('SSL certificate is not valid or an error occurred');
}

