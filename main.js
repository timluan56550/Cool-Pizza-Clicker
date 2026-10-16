
let score=0;
let amountPerClick=5;
let combo=0;
let multiplier=1;
let isComboLocked=false;
let critChance=0;
let slicesEaten=0;
let pizzasEaten=0;
let isCooldown=false;
let trackNumber=0;
let backgroundMusic=new Audio();
let bonusPizza=4;
backgroundMusic.volume=0.07;

const pizzaImage=document.getElementById("pizza")
const targetImage=document.getElementById("target")
const scoreDisplay=document.getElementById("score")
const comboDisplay=document.getElementById("combo")
const multiplierDisplay=document.getElementById("multiplier")
const lockCombo=document.getElementById("lockCombo");
const popupStack = document.getElementById("popup-Stack")
// upgrade stuff
const info=document.getElementById("upgrade-info")
const closedNotepad=document.getElementById("notepad-closed")
const closeButtonNotepad=document.getElementById("closeNotepadButton")
const openNotepadContainer=document.getElementById("notepad-open-container")
const preloadPizza=[]
//innerHtml is useful- do variableName.innerHtml="" remember to put "<span>, <b>, etc in quotations if it doesnt work"
//block-make new line
//inline block places on same line(doesnt break line)
//list below is for upgrade may add more later if i need to but i think this is all i need use. use arrow function for required and effect
//
// id:
// title:
// info:
// price:
// maxCount:
// currentCount:
// growth:
// required:
// effect:
let upgradeList=[
    {
id: 'extraPizzas',
title: 'Extra Pizzas',
info: 'Increase CpC by 1',
price: 50,
maxCount: 3,
currentCount: 0,
growth: 1.8,
required: ()=> score>=0,
effect: ()=> amountPerClick+=1
},
{
id: 'unlockCombos',
title: 'Combos',
info:'Click the target button to stack combos',
price: 100,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[0].currentCount>=2,
effect: ()=>{
    document.getElementById("target").style.display='block';
      document.getElementById("comboText").style.display='inline-block';

    moveTarget();
}
},
{
id: 'lockCombos',
title: 'Combo Lock',
info:'Be able to freeze your combos to not lose them',
price: 250,
maxCount: 1,
currentCount: 0,
growth: 1,
required: ()=>upgradeList[1].currentCount>=1,
effect: ()=>{
    document.getElementById("lockCombo").style.display='inline-block';
}
},
{
id: 'critChance',
title: 'Crispy Crits',
info:'adds a 2% chance for every click to give you 10x Pizzas',
price: 500,
maxCount: 5,
currentCount: 0,
growth: 1.2,
required: ()=>upgradeList[0].currentCount>=3,
effect: ()=>{
    critChance=0.02;
}

},
{
id: 'bonusFinishPizza',
title: 'Bigger Bonus',
info:'Increases the reward for finishing a pizza by 2x per upgrade!',
price: 300,
maxCount: 3,
currentCount: 0,
growth: 1.3,
required: ()=>upgradeList[0].currentCount>=3,
effect: ()=>{
    bonusPizza*=2;
}

},
// {
// id: 'bonusFinishPizza',
// title: 'Bigger Bonus',
// info:'Increases the reward for finishing a pizza by 2x per upgrade!',
// price: 300,
// maxCount: 3,
// currentCount: 0,
// growth: 1.3,
// required: ()=>upgradeList[0].currentCount>=3,
// effect: ()=>{
//     bonusPizza*=2;
// }

// },





// end of upgrade list
]

//this actualy turns th list into a lsit of upgrade when you open the nnotepad
function openUpgrade(){
const grid=document.getElementById("upgrade-grid");
if(!grid) return;
//clear everything so stuff dont duplicate
grid.innerHTML=""

upgradeList.forEach(upgrade=>{
//if you have unlcoekd the upgrade, checker
if(!upgrade.required())return;
const maxed=upgrade.currentCount>=upgrade.maxCount;
//be able to customize the box 
const upgradeButton=document.createElement("div");
//start to use more `${} isntead of + this check if maxed is true or not and will give an output of maxed or nothing
upgradeButton.className=`upgrade-button ${maxed ? 'maxed' : ''}`;
// make html and css for each item in the list without having to do it manually shows the title, price, etc
upgradeButton.innerHTML=  
"<b>"+upgrade.title+"</b>"+
"<span> Cost: "+ upgrade.price + "</span>" +
"<span> Level: "+ upgrade.currentCount + "/" + upgrade.maxCount+ "</span>" +
"</div>"

//when you click the upgrade
upgradeButton.addEventListener("click", ()=>{
if(maxed)
    return;
if(score>= upgrade.price){
//remove pizzas based on price
score-=upgrade.price;
//increase the count
upgrade.currentCount+=1;
//increase price
upgrade.price=Math.floor(upgrade.price*upgrade.growth);
//does the effect
upgrade.effect();
//update the ui;
updateUI();
//refreshed teh panel 
openUpgrade();

}else{
    //temporary debug
    console.log("Not enough pizzas!")
}


})
//hover over teh upgrade
upgradeButton.addEventListener("mouseenter",()=>{
if(!info)return;
info.style.display="block";
//allows you to see inside basically
info.innerHTML=
"<span>" + upgrade.info + "</span>"
 })
//not hovering over
upgradeButton.addEventListener("mouseleave", ()=>{
if(!info) return;
info.style.display="none";


});
//adds teh button to the html/grid
grid.appendChild(upgradeButton);
});
}

//music
const playlist=[
      {title:"Midnight Mellow", src:"audio/midnight-mellow.mp3"},

    {title:"After Hours Session", src:"audio/after-hours-session.mp3"},
  {title: "Velvet Echoes", src:"audio/velvet-echoes.mp3"}
];
//playing teh song
function playSong(a){
trackNumber=a;
//finds the song in the playlist
backgroundMusic.src=playlist[trackNumber].src;

}
//playes the next track
backgroundMusic.addEventListener('ended',()=>{
    //adds 1 the track number and fidn the remainder of tracknumber/total. if it 0 it knows its at the end and loops back
trackNumber=(trackNumber+1)%playlist.length;
playSong(trackNumber);

})
//need to click to start the music
document.addEventListener('click', ()=>{
if(backgroundMusic.paused && backgroundMusic.src===""){
    playSong(0);
}
},{once:true});



// open/close the notepad
closedNotepad.addEventListener('click',()=>{
closedNotepad.style.display='none';
openNotepadContainer.style.display='block';
closeButtonNotepad.style.display='block';
openUpgrade();
});

closeButtonNotepad.addEventListener('click',()=>{
openNotepadContainer.style.display='none';
closeButtonNotepad.style.display='none';
closedNotepad.style.display='block';
});
//stop pizza delays&lag
for(let x=0; x<=8; x++) {

    preloadPizza[x]=new Image();
    preloadPizza[x].src=`images/pizza/pizza${x}.png`;
}
//move target
function moveTarget(){
//finds the pizza size
    const pizzaWidth=pizzaImage.clientWidth>0?pizzaImage.clientWidth: 300;
const pizzaHeight=pizzaImage.clientHeight>0?pizzaImage.clientHeight: 300;
//finds the target size
const targetWidth=targetImage.clientWidth>0?targetImage.clientWidth:40;
const targetHeight=targetImage.clientHeight>0?targetImage.clientHeight:40;
//finds the maximun areait can move
const maxX = pizzaWidth - targetWidth;
const maxY = pizzaHeight - targetHeight;
//finds a random positotn
const randomX = Math.random() * maxX;
const randomY = Math.random() * maxY;
//moves there
targetImage.style.top=randomY+"px";
targetImage.style.left=randomX+"px";


}
//satisfying screen shake
function screenShake(){
const container= document.getElementById("pizzaStuff");
container.classList.remove("shake");
void container.offsetWidth;
container.classList.add("shake");
 setTimeout(()=>{
container.classList.remove("shake");

 },150 );
}

//combo lock
lockCombo.addEventListener("click",function(){
isComboLocked=!isComboLocked;
if (isComboLocked){
    lockCombo.src="images/locked.png";
} else {
    lockCombo.src="images/unlock.png";
}

})


//clicking the pizza
pizzaImage.addEventListener("click", function(e) {

if(isCooldown){
    return;
}
//check if it reset
if(!isComboLocked) {
    combo=0;
multiplier=1;
}
//crit
const isCrit=Math.random()<critChance;
const critMultiplier =isCrit ?10:1;
slicesEaten+=1;
let gain=amountPerClick*multiplier*critMultiplier;
let slicesRemaining =8-slicesEaten;
pizzaImage.src=`images/pizza/pizza${slicesRemaining}.png`
//8 slices
if(slicesEaten>=8){
gain*= bonusPizza/amountPerClick;
pizzasEaten+=1;
slicesEaten=0;
isCooldown=true;
spawnFloatingText("✨PIZZA FORMED!✨",0,-30,true,"centered");


//cooldown for regen
setTimeout(()=>{

    pizzaImage.src ="images/pizza/pizza8.png";
    isCooldown=false;
},400);
screenShake();
}
if(isCrit){

spawnPopupStack("+"+gain.toFixed(1), "crit");
screenShake();
}else{
  spawnPopupStack("+" + gain.toFixed(1));

}
score+=gain;
updateUI();
});

//popuptext on the right side
function spawnPopupStack(text, type="normal"){
    const popup=document.createElement("div");
    if(type==="crit"){
            popup.className="stackedPopup crit";

    }else{
    popup.className="stackedPopup";
    }
    
    popupStack.appendChild(popup)
    popup.textContent=text;
    setTimeout(() => {
        popup.remove();
    }, 1000);
}



//popup text

function spawnFloatingText(text, x,y, isSpecial=false, customStyle=""){
const popup=document.createElement("div");
popup.className = "popup-text" + (isSpecial ? " crit" : "") +(customStyle?" "+customStyle:"");
popup.textContent=text;

if(customStyle.includes("centered")||(customStyle.includes("stationary-combo"))){
    popup.style.top=y+"px"

}else{
popup.style.left=x+"px"
popup.style.top=y+"px"
}
document.getElementById("pizzaStuff").appendChild(popup);
setTimeout(()=>{
popup.remove();
},1000);
}


//the target
targetImage.addEventListener("click", function(e) {
e.stopPropagation();
if(!isComboLocked){
    combo+=1;
multiplier=1+Math.log(1+combo*0.1);

const gain=(amountPerClick*multiplier*3)
score+=gain;
const localX=targetImage.offsetLeft+e.offsetX;
const localY=targetImage.offsetTop+e.offsetY;

spawnPopupStack("+"+gain.toFixed(1));
const bottomY =pizzaImage.clientHeight+10;

spawnFloatingText("Combo x" + combo, 0, bottomY, false, "stationary-combo");
moveTarget();
updateUI();
}
})
//updates the ui like pizza score and other stuff
function updateUI(){
scoreDisplay.textContent=score.toFixed(1);
comboDisplay.textContent=combo;
multiplierDisplay.textContent=multiplier.toFixed(2);



}
