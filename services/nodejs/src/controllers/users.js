const User = require('../../database/models').User;
// const UserRecommender = require('../../database/models').UserRecommender;

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    console.log('here');
    return User
      .findAll({
        include: [{
          model: User,
          as: 'Recommenders'
        },{
          model: User,
          as: 'Recommending'
        }],
      })
      .then(users => res.status(200).send(users))
      .catch(error => {
        console.log('error', error);
        res.status(400).send(error)
      });
  },
  recommend(req, res) {
    let userId = req.params.userId;
    let recommenderId = req.params.recommenderId;
    if(isNaN(userId)
        || isNaN(recommenderId)
        || userId===recommenderId)
      return res.status(400).send({message: "Invalid Parameters"});
    return User.findAll({
      where: {
        $or: [{id: userId}, {id: recommenderId}]
      }
    })
    .then(users => {
      let user, recommender;
      users.forEach(u => {
        console.log('u', u.id);
        if(u.id === parseInt(userId)) {
          user = u;
        } else {
          recommender = u;
        }
      });
      // console.log('users', users);
      if(!user || !recommender) {
        return res.status(404).send({"message": "Someone does not exist"});
      }
      // for(var key in user) {console.log('key', key)}
      return user.addRecommender(recommender)
        .then(user => res.status(200).send({"message": "ok"}));
    })
    .catch(error => {
      console.log('error', error);
      res.status(400).send(error)
    });
  },
  retrieve(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: User,
          as: 'recommenders',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: User,
          as: 'recommenders',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            username: req.body.username || user.username,
          })
          .then(() => res.status(200).send(user))  // Send back the updated user.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
