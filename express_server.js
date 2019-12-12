const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;

app.set("view engine", "ejs");

// generate a random short url
function generateRandomString() {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 6; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(); // create encoded short url
  urlDatabase[shortURL] = req.body.longURL; // add short url to database
  res.redirect('/urls');
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// route handler for urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// app.get("/urls/:shortURL", (req, res) => {
//   let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
//   res.render("urls_show", templateVars);
// });

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL/showedit", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  console.log("shortURL", req.params.shortURL);
  console.log("req.body.longURL", req.body.longURL);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  // res.send();
});

// app.post("/urls", (req, res) => {
//   let shortURL = generateRandomString(); // create encoded short url
//   urlDatabase[shortURL] = req.body.longURL; // add short url to database
//   res.redirect('/urls');
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

