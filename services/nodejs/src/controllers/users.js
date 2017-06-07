const User = require('../../database/models').User;
// const UserRecommender = require('../../database/models').UserRecommender;

module.exports = {
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        recommender_id: req.body.recommender_id || null,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    let orderBy, orderByRec;
    if(req.query._sort === "recommender_id") {
      orderBy = [[{model: User, as: 'recommender'}, 'username', req.query._order || 'ASC']];
    } else {
      orderBy = [[req.query._sort || 'id', req.query._order || 'ASC']];
    }
    console.log('orderBy', orderBy, orderByRec);

    return User
      .findAll({
        include: [{
          model: User,
          as: 'recommender',
          where: {
            username: {
              $iLike: `%${(req.query.recommendedBy || "").toLocaleLowerCase()}%`
            }
          },
          required: false
        }],
        where: {
          username: {
            $iLike: `%${(req.query.q || "").toLocaleLowerCase()}%`
          }
        },
        order: orderBy
      })
      .then(users => res
              .set('X-Total-Count', users.length)
              .set('Access-Control-Expose-Headers', 'X-Total-Count')
              .status(200)
              .send(users))
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
      .findById(req.params.userId)
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
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            recommender_id: req.body.recommender_id || null
          })
          .then(() => res.status(200).send(user))  // Send back the updated user.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    console.log('DESTROY', req.params.userId)
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
          .then(() => res.status(200).send({data:{}}))
          // .then(() => res.status(204).send({data:{}}))
          // admin on rest exige un contenu => dommage pour 204
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
