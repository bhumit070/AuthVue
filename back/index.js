const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { check, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
const User = require("./user");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("db connceted"));

app.post(
  "/register",
  [
    check("name", "Please Enter Full Name").isLength({ min: 2 }),
    check("email", "Please Enter Valid Email").isEmail(),
    check("username", "Please Enter Valid Username").isLength({ min: 2 }),
    check("password", "Enter atleast 3 characters for Password").isLength({
      min: 3,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }
    const user = new User(req.body);
    user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          error: error,
        });
      }
      return res.status(200).json(user);
    });
  }
);

app.post(
  "/login",
  [
    check("username", "Please Enter Valid Username").isLength({ min: 2 }),
    check("password", "Enter atleast 3 characters for Password").isLength({
      min: 3,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        error: errors.array()[0].msg,
      });
    }
    const { username, password } = req.body;
    User.findOne({ username, password }, (error, user) => {
      if (error || !user || user === undefined || user === null) {
        return res.status(400).json({
          error: "No user found with given credentials",
        });
      }
      const token = jwt.sign({ _id: user._id }, "SECRET");
      res.cookie("token", token, { expire: new Date() + 9999 });
      const { _id, name, email, username } = user;
      return res.json({
        token,
        user: {
          _id,
          name,
          username,
          email,
        },
      });
    });
  }
);

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout SuccessFully",
  });
});
const isSignedIn = expressJwt({
  secret: "SECRET",
  userProperty: "auth",
});

app.get("/users", isSignedIn, (req, res) => {
  User.find((error, users) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(users);
    }
  });
});

app.delete("/remove/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, (error, user) => {
    if (error) {
      return res.status(400).json({
        error: "Can not delete User",
      });
    } else if (user.isLoggedIn) {
      return res.json({ error: "Loggedin User Can not be Deleted" });
    } else {
      User.findByIdAndRemove(id, (error, user) => {
        if (error) {
          return res.json({
            error: "Delete Operation Cannot be Completed",
          });
        } else {
          return res.json(user);
        }
      });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User signout successfully",
  });
});

app.listen(8000, () => console.log("running @ 8000"));
