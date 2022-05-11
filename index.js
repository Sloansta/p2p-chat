const express = require('express');
const GUN = require('gun');
const app = express();
const PORT = 3030;
app.use(GUN.serve);

const server = app.listen(PORT, () => {
    console.log(`Example app listening at port ${PORT}`);
});

GUN({ web: server });