module.exports = function (app, todoDb) {

	//Functions =============================================================
	
  function getTodos(res, from) {
	  
	  if (from == "file") {
		  var listOfTracks = require('../config.json');

//		  console.log("listOfTracks = " + JSON.stringify(listOfTracks) );
		  res.send(listOfTracks.map(function (row) {
              return row;
		  }));
	
	  } else {
		    
    todoDb.list({include_docs: true}, function (err, body) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
    	  
    	   var newBody = [];
    	   var j =0;
    	   for (var i=0; i< body.rows.length; i++) {
    		   if (body.rows[i] != null) {  
    			  if (body.rows[i].doc.type=="todo") {  
    		         newBody[j]=body.rows[i];
    		         j++;
    			  }
    		   }
    	   }

    		res.send(newBody.map(function (row) {
        	    if (row.doc.text) {
                   return row.doc;
        	    }
        }));
      }
    });
	  }
  }

  // api ---------------------------------------------------------------------
  // get all todos
  app.get('/api/todos', function (req, res) {
    getTodos(res, "file");
  });
  // ------------------------------------------------
  

  require ('stringify-object'); 
  
  // create feedback and send back all feedbacks after creation
  app.put('/api/todostest', function (req, res) {
     
      todoDb.insert({
        type: "testeventrating",
        rates: req.body,
        done: false
      }, function (err, todo) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          getTodos(res);
        }
      });
  });
  
  // create todo and send back all todos after creation
  app.put('/api/todos', function (req, res) {
           
    todoDb.insert({
      type: "eventrating",
      rates: req.body,
      done: false
    }, function (err, todo) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
        getTodos(res);
      }
    });
  });

  // delete a todo
  app.delete('/api/todos/:id', function (req, res) {
    todoDb.destroy(req.params.id, req.query.rev, function (err, body) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
        getTodos(res);
      }
    });
  });

};
