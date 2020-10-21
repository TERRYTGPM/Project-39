var Doggo, happyDoggo;
var database;
var foodS, foodStock;
var dog, feedthedog, stockthefood;
var fedTime, lastFed, foodObj;

function preload()
{
  Doggo = loadImage("dogImg.png");
  happyDoggo = loadImage("dogImg1.png");
}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(800,200,150,150 );
  dog.addImage(Doggo);
  dog.scale = "0.3";

  foodObj = new Food();

  database = firebase.database();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  feedthedog = createButton("Feed");
  feedthedog.position(700, 95);
  feedthedog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(stockFood);
  
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed == 0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
  drawSprites();


}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x <= 0){
    x = 0;
  }else{
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function stockFood(){
  foodS++
database.ref('/').update({
  Food: foodS
})
}

function feedDog(){
  dog.addImage(happyDoggo);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}