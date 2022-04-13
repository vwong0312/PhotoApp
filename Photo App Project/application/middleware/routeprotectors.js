const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
const routeProtectors = {};

routeProtectors.userIsLoggedIn = function(req, res, next) {
    if(req.session.username){
        successPrint('User is logged in');
        next();
    }else{
        errorPrint('User is not logged in');
        req.flash('error', 'Must be logged in to create post');
        req.session.save( err => {
            res.redirect('/login');
          })
    }
}
module.exports = routeProtectors;