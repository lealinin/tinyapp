const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
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

// new url database with objects
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// email lookup helper function
function getUserByEmail(email) {
  // console.log('inside getUserByEmail - email:', email);
  for (const userID in users) {
    // console.log('userID:', userID);
    const user = users[userID];
    if (user.email === email) {
      // console.log('found existing user with email:', email, 'and its id is:', userID);
      return user;
    }
  }
}

// email and password match
function authenticateUser(email, password) {
  for (let user in users) {
    if (users[user].email === email && users[user].password === password){
      return users[user];
    }
  }
}

function compareUserID (id, database) {
  let obj = {};
  for (let key in database) {
    if (database[key].userID === id) {
      obj[key] = {};
      obj[key].longURL = database[key].longURL;
    }
  }
  return obj;
}

app.use(bodyParser.urlencoded({extended: true}));

//////////// GET ROUTES /////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const user = users[req.cookies.user_id];
  if (!req.cookies.user_id) {
   return res.redirect("/login");
  }

  let urls = compareUserID(req.cookies.user_id,urlDatabase);
  console.log(urls);
  console.log(urlDatabase)

  let templateVars = {
    user,
    urls,
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // console.log('userID from cookie:', req.cookies.user_id);
  const user = users[req.cookies.user_id];
  // if user is logged out redirect to login page
  if (user) {
    let templateVars = {
      user,
      urls: urlDatabase,
      user_id: req.cookies["user_id"]
    }
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// get route for new login page
app.get("/login", (req, res) => {
  // console.log('userID from cookie:', req.cookies.user_id);
  const user = users[req.cookies.user_id];
  let templateVars = {
    user: user,
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  }
  res.render("login", templateVars);
});

//////////// POST ROUTES ////////////////

// route to create a new url in urldatabase
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(); 
  
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.cookies.user_id;
  res.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (req, res) => {

  const user = users[req.cookies.user_id];
  const shortURL = req.params.shortURL;
  const ownerId = urlDatabase[shortURL].userID;
  const loggedinId = req.cookies.user_id

  if (loggedinId !== ownerId) {
   res.send('You do not have the access!');
   return;
  }
  
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get("/urls/:shortURL/showedit", (req, res) => {
  const user = users[req.cookies.user_id];
  let templateVars = { 
    user: user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: req.cookies["user_id"]
  }
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  // console.log("shortURL", req.params.shortURL);
  // console.log("req.body.longURL", req.body.longURL);
  const shortURL = req.params.shortURL;
  const ownerId = urlDatabase[shortURL].userID;
  const loggedinId = req.cookies.user_id

  if (loggedinId !== ownerId) {
   res.send('You do not have the access!');
   return;
  };

  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  // console.log("UserID for register", users[req.cookies.user_id]);
  const user = users[req.cookies.user_id];
  let templateVars = {
    user: user
  }
  res.render("register", templateVars);
});

// post route that handles different register scenarios
app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('No email or password');
  } else {
    let oldUser = getUserByEmail(req.body.email);
    if (oldUser) {
      res.status(400).send('Email already taken. You cant register with the same email');
    } else {
      let objId = generateRandomString();
      let userDetails = {
        id: objId,
        email: req.body.email,
        password: req.body.password
      };
      users[objId] = userDetails;
      res.cookie('user_id', objId);
      res.redirect('/urls');
    }
  }
});

// post route that handles different login scenarios
app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(403).send('box empty');
  } else {
    //check whether the username and password exists in the database
    let user = authenticateUser(req.body.email, req.body.password);
    if(user){
      res.cookie('user_id', user.id);
      res.redirect('/urls');
    } else{
      res.send("Either username and password is not right");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});