let score=0;
let amountPerClick=1;
let combo=0;
let multiplier=1;
let isComboLocked=false;

let slicesEaten=0;
let pizzasEaten=0;
let isCooldown=false;

const pizzaImage=document.getElementById("pizza")
const targetImage=document.getElementById("target")
const scoreDisplay=document.getElementById("score")
const comboDisplay=document.getElementById("combo")
const multiplierDisplay=document.getElementById("multiplier")
const lockCombo=document.getElementById("lockCombo");
const popupStack = document.getElementById("popup-Stack")
const preloadPizza=[];
//stop pizza delays&lag
for(let x=1; x<=8; x++) {

    preloadPizza[x]=new Image();
    preloadPizza[x].src=`images/pizza/pizza${x}.png`;
}
//move target
function moveTarget(){
const pizzaWidth=pizzaImage.clientWidth>0?pizzaImage.clientWidth: 300;
const pizzaHeight=pizzaImage.clientHeight>0?pizzaImage.clientHeight: 300;

const targetWidth=targetImage.clientWidth>0?targetImage.clientWidth:40;
const targetHeight=targetImage.clientHeight>0?targetImage.clientHeight:40;

const maxX = pizzaWidth - targetWidth;
const maxY = pizzaHeight - targetHeight;
const randomX = Math.random() * maxX;
const randomY = Math.random() * maxY;
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

});




pizzaImage.addEventListener("click", function(e) {
if(isCooldown){
    return;
}

if(!isComboLocked) {
    combo=0;
multiplier=1;
}
const isCrit=Math.random()<0.05;
const critMultiplier =isCrit ?10:1;
const pizzaRectangle=pizzaStuff.getBoundingClientRect();
slicesEaten+=1;
let gain=amountPerClick*multiplier*critMultiplier;
let slicesRemaining =8-slicesEaten;
pizzaImage.src=`images/pizza/pizza${slicesRemaining}.png`

if(slicesEaten>=8){
gain*=4;
pizzasEaten+=1;
slicesEaten=0;
isCooldown=true;
const topX=pizzaRectangle.left+70;
const topY=pizzaRectangle.top-30;
spawnFloatingText("✨PIZZA FORMED!✨",topX,topY,true);



setTimeout(()=>{

    pizzaImage.src ="images/pizza/pizza8.png";
    isCooldown=false;
},400);
screenShake();
}
if(isCrit){
const topX=pizzaRectangle.left+pizzaRectangle.width/2-140;
const topY =pizzaRectangle.top+30;


spawnPopupStack("+"+gain.toFixed(1), "crit");
screenShake();
}else{
  spawnPopupStack("+" + gain.toFixed(1));

}
score+=gain;
updateUI();
});
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





function spawnFloatingText(text, x,y, isSpecial=false, customStyle=""){
const popup=document.createElement("div");
popup.className = "popup-text" + (isSpecial ? " crit" : "") +(customStyle?" "+customStyle:"");
popup.textContent=text;
popup.style.left=x+"px"
popup.style.top=y+"px"
document.body.appendChild(popup);
setTimeout(()=>{
popup.remove();
},1000);
}



targetImage.addEventListener("click", function(e) {
e.stopPropagation();
if(!isComboLocked){
    combo+=1;
multiplier=1+Math.log(1+combo*0.1);

const gain=(amountPerClick*multiplier*3)
score+=gain;

const pizzaRectangle=pizzaStuff.getBoundingClientRect();
spawnFloatingText("+"+gain.toFixed(1), e.pageX,e.pageY,false);
const bottomX=pizzaRectangle.left+(pizzaRectangle.width/2)-40;
const bottomY =pizzaRectangle.bottom +15;

spawnFloatingText("Combo x" + combo, bottomX, bottomY, false, "stationary-combo");
moveTarget();
updateUI();
}
});

function updateUI(){
scoreDisplay.textContent=score.toFixed(1);
comboDisplay.textContent=combo;
multiplierDisplay.textContent=multiplier.toFixed(2);



}
window.onload=function(){
moveTarget();
}