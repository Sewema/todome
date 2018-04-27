var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.load = function(args) {
    var page = args.object;
    page.bindingContext = user;
};

exports.login = function() {
  var topmost = frameModule.topmost();
  topmost.navigate("views/login/login");
};

exports.register = function() {
  console.log(user.email);
  user.register()
     .then(function() {
         dialogsModule
             .alert("Votre compte a été créé avec succès.")
             .then(function() {
                 frameModule.topmost().navigate("views/login/login");
             });
     }).catch(function(error) {
         console.log(error);
         dialogsModule
             .alert({
                 message: "Malheureusement, nous n'avons pas pu créer votre compte.",
                 okButtonText: "Reessayer"
             });
     });
}
