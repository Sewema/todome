var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");
var observableModule = require("data/observable");

function User() {

    // Declaration de l'observable
    var viewModel = new observableModule.fromObject({
        email: "",
        password: ""
    });

    // Fonction d'initialisation de Firebase
    viewModel.init = function(){
      firebase.init({
          url: config.apiUrl
      }).then(
        function (instance) {
          console.log("firebase.init done");
        },
        function (error) {
          console.log("firebase.init error: " + error);
        }
      );
    };

    // Fonction de connection
    viewModel.login = function() {
      return firebase.login({
        type: firebase.LoginType.PASSWORD,
        email: viewModel.get("email"),
        password: viewModel.get("password")
      }).then(
        function (response) {
            config.uid = response.uid
            return response;
        });
    };

    // Fonction d'inscription d'un utilisateur
    viewModel.register = function() {
      return firebase.createUser({
        email: viewModel.get("email"),
        password: viewModel.get("password")
      }).then(
          function (response) {
            console.log(response);
            return response;
          }
      );
    };

    // Fonction de déconnexion d'un utilisateur
    viewModel.logout = function() {
      firebase.logout();
    };

    return viewModel;
}

module.exports = User;
