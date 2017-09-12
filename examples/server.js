const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    console.log(
      `🌎 Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`,
    );
  }
});
