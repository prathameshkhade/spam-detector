function check_https_protocol(urlInput) {
    const url = urlInput.trim();

	if (!url) {
		return false;
	}

	try {
        	const protocol = new URL(url).protocol;
	        const isHttps = protocol.toLowerCase() === 'https:'; // Check with lowercase
        	if (isHttps) {
			return true;
		}
		return false;
	} catch (error) {
		console.error(error);
	}
}

// Example for testing tge function
console.log(check_https_protocol("https://google.com"));

