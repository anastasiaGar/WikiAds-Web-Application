const express = require("express");
const path = require("path");
const app = express();
const port = 8083;
const { v4: uuidv4 } = require('uuid');
users = [
  {
    username: "Username1",
    password: "Password1",
    cart: [],
  },
  {
    username: "Username2",
    password: "Password2",
    cart: [],
  },
];
app.listen(port);

app.use(express.static("public"));

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }));

// parse application/json content from body
app.use(express.json());

// serve index.html as content root
app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname, "public"),
  };

  res.sendFile("./public/index.html", options, function (err) {
    console.log(err);
  });
});

app.post('/login', (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  let found = false;
  var i=0;
  while(i<users.length && !found){
      if(username===users[i].username){
          if(password === users[i].password){
              found = true;
          }
          else{
              i++;
          }
      }else{
          i++;
      }
  }
  if(found){
      const sessionId = uuidv4();
      
      res.json({"sessionId" : sessionId })
      users[i].sessionId = sessionId;
  }
  else{
      res.json(400)
  }
})

app.post("/favorites", (req, res) => {
  const { adId, title, description, cost, image, username, sessionId } =
    req.body;

  const user = users.find(
    (u) => u.username === username && u.sessionId === sessionId
  );
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Λαθος χρηστης",
    });
  }

  const isAlreadyFavorite = user.favorites.some((fav) => fav.adId === adId);
  if (isAlreadyFavorite) {
    return res.status(409).json({
      success: false,
      message: "Η αγγελία υπάρχει ήδη στα αγαπημένα.",
    });
  }

  user.favorites.push({ adId, title, description, cost, image });
});

app.get("/favorites", (req, res) => {
  const { username, sessionId } = req.query;

  const user = users.find(
    (u) => u.username === username && u.sessionId === sessionId
  );
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Λαθος χρηστη.",
    });
  }

  res.json({
    success: true,
    favorites: user.favorites,
  });
});
