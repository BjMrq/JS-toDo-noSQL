require('dotenv').config();
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
    methodeOverride = require("method-override");

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(methodeOverride("_method"));

//Schema setup
var todoSchema = new mongoose.Schema({
  thingtodo: String
});

var todo = mongoose.model("todo", todoSchema);

// Routes
// Index
app.get("/", function(req, res){
  res.redirect("/todo");
});

app.get("/todo", function(req, res){
  console.log("People here!");
  todo.find({},function(err, allTodos){
    if (err) {
      console.log("oupsy can't get the todos");
    } else {
      res.render("index", {todos: allTodos});
    }
  });
});

// Create
app.post("/addTodo", function(req, res){
  console.log("adding: " + req.body.newtodo + " to the todo list");
  var newtodo = req.body.newtodo;
  todo.create({
    thingtodo: newtodo
  }, function(err, todo){
    if (err){
      console.log("something went wrong");
    } else {
      console.log(todo + "created");
    }
  });
  res.redirect("/todo");
});

// Delete
app.delete("/todo/:id", function(req, res){
  todo.findByIdAndDelete(req.params.id, function(err){
    if (err){
      console.log("Bip Bip error");
    } else {
      res.redirect("/todo");
    }
  });
});

//API
app.get("/api/todo", function(req, res){
  todo.find()
  .then(function(todos){
    res.json(todos);
  })
  .catch(function(err){
    res.send(err);
  });
});

// 404
app.get("*", function (req, res){
  res.send("404 sorry we didn't find what you where looking for, go back!");
});

// Listen
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server has started on port 3000! Let's go!");
});
