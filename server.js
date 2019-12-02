"use strict";

const express = require("express");

const app = express();
const port = 80;

//clients folder as root
app.use(express.static("clients"));

//provide access to node_modules folder from the client
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

//use index.html for traffic
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
    console.info("listening on %d", port)
})

