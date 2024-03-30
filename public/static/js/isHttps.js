function check_https_protocol() {
	const urlInput = document.getElementById('url');
	const url = urlInput.value.trim();
	const protocol = new URL(url).protocol;	
	const isHttps = protocol === 'https:';
	const message = isHttps ? 'The link uses HTTPS protocol.' : 'The link does not use HTTPS protocol.';
	alert(message);
	// return false;
}

