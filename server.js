const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
var path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
    extended: true
}));

//--------------------------------------------------------------------------------


mongoose.connect("mongodb://localhost:27017/Likhitha", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('connection to database established')
}).catch(err => {
    console.log('db error ${err.message}');
    process.exit(-1)
});


const userSchema = {
    email: String,
    password: String
};
const User = new mongoose.model("User", userSchema);

const bookingSchema = {
    name:String,
    phoneno:String,
    email1: String,
    date: String,
    time: String,
    attende:String
};

const booking = new mongoose.model("booking", bookingSchema);

  var information = "";
  var usermail = "";
//----------------------------------------------------------------------------------------------
  
  app.get("/", function (req, res) {
    res.render("login", {
		information: information
	});
});

app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("./about");
});

app.get("/booking", function (req, res) {
    res.render("./booking");
});

app.get("/services", function (req, res) {
    res.render("./services");
});

app.get("/menu", function (req, res) {
    res.render("./menu");
});

app.get('/contactus', function(req, res) {
    res.render("./contactus");
  });
  app.get('/success', function(req, res) {
    res.render("./success");
  });
 
  
  app.get("/logout", function (req, res) {
      res.render("./logout");
  });
  
  app.get("/register", function (req, res) {
      res.render("./register");
  });
 
  
//--------------------------------------------------------------------------------------------

  app.post("/register", function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
  
      User.findOne({
          email: email
      }, function (err, founduser) {
          if (err) {
              res.redirect("error");
          } else {
              if (founduser) {
                information="user already registered";
                  res.redirect("/");
              } else {
                  const newUser = new User({
                      email: email,
                      password: password,
                  });
  
                  newUser.save(function (error) {
                      if (error) {
                          res.redirect("error");
                      } else {
                        information="registered sucessfully";
                          res.redirect("/");
                      }
                  })
  
              }
          }
      })
  });
  
  
  app.post("/login", function (req, res) {
      let email = req.body.email;
      let password = req.body.password;
  
      User.findOne({
          email: email
      }, function (err, founduser) {
          if (err) {
              res.redirect("error");
          } else {
              if (founduser) {
                  if (founduser.password == password) {
                      usermail = founduser.email;
                      res.redirect("/home");
                  } else {
                    information = "incorrect password";
                      res.redirect("/");
                  }
              } else {
                information="not yet registered";
                  res.redirect("/register");
              }
          }
      })
  });
  
  app.post("/booking", function (req, res) {
      let name = req.body.name;
      let email1 = req.body.email1;
      let date = req.body.date;
      let time = req.body.time;
      let attende = req.body.attende;
      let comment = req.body.comment;

      
  
      const newbooking = new booking({
          name: name,
          email1: usermail,
          date: date,
          time:time,
          attende:attende,
          comment:comment,
          
      });
  
      newbooking.save(function (err) {
          if (err) {
              console.log(err);
          } else {
              res.redirect("/success");
          }
      });
  });
   
//------------------------------------------------------------------------------------------
  app.listen(3001, function () {
      console.log("Server started on port 3001.");
  });
