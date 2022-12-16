const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

const wikidatatRouter = require("./routes/wikidata");
app.use("/wikidata", wikidatatRouter);

app.listen(3001);
