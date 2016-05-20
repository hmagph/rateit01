angular.module('todoController', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope', '$http', 'Todos', function ($scope, $http, Todos) {
  $scope.formData = {};
  $scope.loading = true;
 
  // GET =====================================================================
  // when landing on the page, get all todos and show them
  // use the service to get all the todos
  Todos.get()
    .success(function (data) {
      $scope.todos = data;
      $scope.loading = false;
//      console.log("get todos = " + JSON.stringify($scope.todos));     
	   var newTodos = [];
	   var j =0;
	   for (var i=0; i< data.length; i++) {
		   if (data[i] != null) {  
			  if (data[i].type == "todo") {  
				 newTodos[j]=data[i];
				 j++;
			  }
		   }
	   }
	   
    });

	  
  // CREATE ==================================================================
  // when submitting the add form, send the text to the node API
  $scope.createTodo = function () {
	  
      var dataArray = $("#ratingform").serializeArray();	  

      var dataCollection = {};
      for (var i=0; i<dataArray.length; i++) {
      	 dataCollection[dataArray[i].name] = dataArray[i].value;
         //	console.log("dataCollection = " + dataArray );
      }

//	  console.log("todos = " + $scope.todos);
  
    // validate the formData to make sure that something is there
    // if form is empty, nothing will happen
    if (dataCollection != undefined) {
      $scope.loading = true;
      
 //     console.log("Todos = " + JSON.stringify(Todos) );
      
      // call the create function from our service (returns a promise object)
      Todos.create(dataCollection)

      // if successful creation, call our get function to get all the new todos
      .success(function (data) {
        $scope.loading = false;
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.todos = data; // assign our new list of todos
      });
    }
  };

  // DELETE ==================================================================
  // delete a todo after checking it
  $scope.deleteTodo = function (todo) {
    $scope.loading = true;

    Todos.delete(todo)
      // if successful creation, call our get function to get all the new todos
      .success(function (data) {
        $scope.loading = false;
        $scope.todos = data; // assign our new list of todos
      });
  };
	}]);
