const express = require('express');
const path = require('path');
const app = express();
const { incrementView, getViewCount } = require('./counter.js');

app.use(express.static(path.join(__dirname)));

app.post('/api/views', (req, res) => {
    const count = incrementView(req);
    res.json({ count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
