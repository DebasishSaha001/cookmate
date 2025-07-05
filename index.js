import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port= process.env.PORT || 3000;
let search="any";
const appId="eab55469";
const appKey="ae7518efbc86b24c603ca350575e447e";
let latestRecipes=[];
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",async(req,res)=>{
    var url=`https://api.edamam.com/api/recipes/v2?type=any&q=${search}&app_id=${appId}&app_key=${appKey}`;
    try{
        const response=await axios.get(url,{
        headers:{
            'Edamam-Account-User':1409625852626
        }
        });
        const recipe=response.data.hits;
        latestRecipes=recipe;
        res.render("index.ejs",{
            recipe:recipe
        });
    } catch(error){
        res.send(error);
    }
});

app.post("/submit",async(req,res)=>{
    let preSearch=req.body.search;
    search=preSearch.replaceAll(" ", "+");
    var url=`https://api.edamam.com/api/recipes/v2?type=any&q=${search}&app_id=${appId}&app_key=${appKey}`;
    let time="*";
    switch (req.body.time) {
        case "Under 15 min":
            time="15";
            break;
        case "15 to 30 min":
            time="16-30";
            break;
        case "More than 30 min":
            time="31+";
            break;
        default:
            break;
    }

    if(req.body.health){
        url=`${url}&health=${req.body.health}`;
    } if(req.body.cuisineType){
        url=`${url}&cuisineType=${req.body.cuisineType}`;
    } if(req.body.co2){
        url=`${url}&co2EmissionsClass=${req.body.co2}`;
    } if(time!=="*"){
        url=`${url}&time=${time}`;
    }

    try{
        const response= await axios.get(url,{
        headers:{
            'Edamam-Account-User':1409625852626
        }
        });
        const recipe=response.data.hits;
        latestRecipes = recipe;
        res.render("index.ejs",{
        recipe:recipe
        });

    } catch(error){
        res.send(error);

    }

    
});

app.get("/recipe/:id",(req,res)=>{
    const id=parseInt(req.params.id);
            
    if (!latestRecipes[id]) {
        return res.status(404).send("Recipe not found");
    }else{
    res.render("recipePage.ejs", {
        recipe: latestRecipes[id]
    });    
    }
});

app.listen(port,()=>{
    console.log("Server running on port: "+port);
});
