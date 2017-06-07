import { Router } from 'express';

let _ = require("lodash");
let jwt = require('jsonwebtoken');

let passport = require("passport");
let passportJWT = require("passport-jwt");

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

const users = [
  {
    id: 1,
    username: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    username: 'test',
    password: 'test'
  },
  {
    id: 3,
    username: 'duwab',
    password: 'secret'
  }
];




export default ({ config, db }) => {
  let routes = Router();

  const jwtOptions = {}
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = config.salt;

  const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, {id: jwt_payload.id})];
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  passport.use(strategy);

  routes.use(passport.initialize());

  routes.all('*', (req, res, next) => {
    console.log('auth');
    next();
  })

  routes.get('/login', (req, res) => {
    res.send({"message": "login get test working"});
  });

  routes.get("/secretDebug",
    function(req, res, next){
      console.log(req.get('Authorization'));
      next();
    }, function(req, res){
      res.json("debugging");
  });

  routes.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({"message": "This is a protected area"});
  });


  routes.post("/login", function(req, res) {
    if(req.body.username && req.body.password){
      var username = req.body.username.toLocaleLowerCase();
      var password = req.body.password;
    } else {
      return res.status(400).send({"message": "username and password are mandatory"});
    }
    // usually this would be a database call:
    var user = users[_.findIndex(users, {username: username})];
    if( ! user ){
      res.status(401).json({message:"no such user found"});
    }

    if(user.password === req.body.password) {
      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
      var payload = {id: user.id};
      var token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: "ok", token: token});
    } else {
      res.status(401).json({message:"passwords did not match"});
    }
  });

  return routes;
}
