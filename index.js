if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
  
  
const express = require('express')
const app = express()
const mongoose=require("mongoose")
const cors=require("cors")

const Todo = require('./models/todo')

const DATABASE_URL = 'mongodb+srv://Jana:todo@cluster0.zpqndab.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then( () => {
    console.log("Connection open")
}).catch(err => {
    console.log("OOPS !! ERROR")
})

app.use(express.json({extended:true}))
app.use(express.urlencoded({ extended: true }))


app.use(cors())

app.post('/add',async(req,res)=>{
    try{
        const todo = new Todo({...req.body})
        await todo.save()
        const todos= await Todo.find({})
        res.status(200).json(todos)
    }catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
})

app.get('/get',async(req,res)=>{
    try{
        const todos= await Todo.find({})
        res.status(200).json(todos)
    }catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
})

app.post('/edit/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const {title,description}=req.body
        console.log(id, title,description );
        const todo = await Todo.findOneAndUpdate(id,{...req.body})
        console.log(todo);
        await todo.save()
        const todos= await Todo.find({})
        res.status(200).json(todos)
    }catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
})

app.get('/delete/:id',async(req,res)=>{
    try{
        const {id}=req.params
        console.log(id);
        await Todo.deleteOne({_id:id})
        const todos= await Todo.find({})
        res.status(200).json(todos)
    }catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
})


app.get('/',(req,res)=>{
    res.send('Todo List')
})
const port = process.env.PORT || 4000
app.listen(port,()=> console.log("server is running"))