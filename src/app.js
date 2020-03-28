const express = require("express")
const path = require("path")
const hbs = require("hbs")
const forecast = require("./utils/forecast")
const geocode = require("./utils/geocode")

//Define paths for express config
const publicDirectoryPath = path.join(__dirname,"../public")
const partialPath= path.join(__dirname,"../templates/partials")
const viewPath = path.join(__dirname,"../templates/views")

const app = express()


//Setup handelbars engine and views location
app.set("view engine","hbs"); 
app.set("views",viewPath)
hbs.registerPartials(partialPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));


app.get("",(req,res) => {
    res.render("index",{
        title:"Weather",
        name:"kaan"
    })
})

app.get("/about",(req,res) => {
    res.render("about",{
        title:"About",
        name:"efsun"
    })
})

app.get("/help",(req,res) => {
    res.render("help",{
        title:"Help",
        name:"eda"
    })
})

app.get("/weather",(req,res) => {
    if(!req.query.address){
        return res.send({
            error:"You must provide an address"
        })
    }
    
    geocode(req.query.address,(error,{latitude,longitude,location} = {})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forcastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forcastData,
                location,
                address:req.query.address
            })
        })
    })

})

app.get("/products",(req,res)=>{
    console.log(req.query.search)
    if(!req.query.search){
        return res.send({
            error:"You must provide a search term"
        })
    }
    res.send({
        products:[]
    })
})

app.get("/help/*",(req,res) => {
    res.render("errors",{
        title:"404",
        name:"Kaan",
        errorMessage:"Help article not found"
    })})

app.get("*",(req,res) => {
    res.render("errors",{
        title:"404",
        name:"Kaan",
        errorMessage:"Page not found"
    })
})

app.listen(3000,()=>{
    console.log("Server is up on 3000 port")
}) 