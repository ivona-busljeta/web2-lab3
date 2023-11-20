const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/game.html'));
});

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

if (externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}