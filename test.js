const express = require("express");
const app = express();
const morgan = require("morgan");


app.use(express.json()); // middleware to parse JSON bodies
app.use(morgan("dev")); // middleware for logging HTTP requests


app.get("/", (req, res) => {
    res.send("<p>Welcome</p>");
});


const port = 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});