/**
 * Created by sridharrajs.
 */



const router = require('express').Router();

const userController = require('../controllers/user-controller');
const APP_NAME = process.env.APP_NAME;

function index(req, res) {
  let title = APP_NAME;
  let msg = 'Hello world!';

  if (APP_NAME === '<Your app name>') {
    title = 'Hello world!';
    msg = 'Please set \'APP_NAME\' in env';
  }

  return res.render('index', {
    $APP_NAME$: title,
    msg: msg
  });
}

function verify(req, res) {

  const verificationHash = req.query.token;
  if (!verificationHash) {
    return res.render('incorrect', {
      $APP_NAME$: APP_NAME
    });
  }

  userController.getByVerificationHash(verificationHash).then(user => {
    if (!user) {
      return res.render('incorrect', {
        $APP_NAME$: APP_NAME
      });
    }

    if (user.verification_hash === verificationHash) {
      userController.verifyCustomEmailUser(user._id).then(() => {
        return res.render('verified', {
          $APP_NAME$: APP_NAME
        });
      });
    } else {
      return res.render('incorrect', {
        $APP_NAME$: APP_NAME
      });
    }

  }).catch(err => {
    console.log('err', err);
    return res.render('error');
  });
}

router.get('/', index);
router.get('/verify', verify);

module.exports = router;
