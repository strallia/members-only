require("dotenv").config();
const express = require("express");

// ----- ROUTERS -----
const homeRouter = require('./routes/homeRoutes');
const formRouter = require('./routes/formRoutes');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/", homeRouter);
app.use("/form", formRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});


