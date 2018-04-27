var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var frameModule = require("ui/frame");
var TaskListViewModel = require("../../shared/view-models/task-view-model");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();
var page;

var taskList = new TaskListViewModel([]);
var pageData = observableModule.fromObject({
    taskList: taskList,
    task: ""
});

exports.load = function(args) {
    page = args.object;
    var listView = page.getViewById("taskList");

    if (page.ios) {
        swipeDelete.enable(listView, function(index) {
            taskList.delete(index);
        });
    }

    page.bindingContext = pageData;

    taskList.empty();
    pageData.set("isLoading", true);
    taskList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("task").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("task").dismissSoftInput();
        taskList.add(pageData.get("task"))
            .catch(function(error) {
                console.log(error);
                dialogsModule.alert({
                    message: "Désolé, Une erreur est survenue.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("task", "");
    } else {
        dialogsModule.alert({
            message: "Veullez decrire la tâche",
            okButtonText: "OK"
        });
    }
};


exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = taskList.indexOf(item);
    taskList.delete(index);
};

exports.logout = function() {
  user.logout();
  frameModule.topmost().navigate("views/login/login");
};
