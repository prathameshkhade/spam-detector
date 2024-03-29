const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set the static folder for your website's files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`Visit http://127.0.0.1:${port}`);
	console.log(`Visit http://localhost:${port}`);
});

