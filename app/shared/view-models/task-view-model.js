var config = require("../../shared/config");
var ObservableArray = require("data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

function indexOf(item) {
  var match = -1;
  this.forEach(function(loopItem, index) {
    if (loopItem.id === item.key) {
      match = index;
    }
  });
  return match;
}


function TaskListViewModel(items) {

    var viewModel = new ObservableArray(items);
    viewModel.indexOf = indexOf;

    viewModel.load = function() {

      var onChildEvent = function(result) {
        var matches = [];

        if (result.type === "ChildAdded") {
          if (result.value.UID === config.uid) {
            viewModel.push({
              description: result.value.Description,
              id: result.key
            });
          }
        } else if (result.type === "ChildRemoved") {
          matches.push(result);
          matches.forEach(function(match) {
            var index = viewModel.indexOf(match);
            viewModel.splice(index, 1);
          });
        }

      };

      return firebase.addChildEventListener(onChildEvent, "/Tasks").then(
        function() {
          console.log("firebase.addChildEventListener added");
        },
        function(error) {
          console.log("firebase.addChildEventListener error: " + error);
        }
      )
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.add = function(task) {
      return firebase.push( '/Tasks', {
        'Description': task,
        'UID': config.uid
      });
    };

    viewModel.delete = function(index) {
      console.log(index);
      var id = viewModel.getItem(index).id;
      return firebase.remove("/Tasks/"+id+"");
    };

    return viewModel;
}

module.exports = TaskListViewModel;
