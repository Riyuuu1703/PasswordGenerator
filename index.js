const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.getElementById('upperCase');
const lowercaseCheck = document.getElementById('lowerCase');
const numbersCheck = document.getElementById('number');
const symbolsCheck = document.getElementById('symbol');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*(+){}|:;[]/?><,-"';

let password=" ";
let passwordLength= 10;
let checkCount=0;
//set strength color to grey
setIndicator("#ccc")
handleSlider();
//set password
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;
    const min = inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
    
}
function setIndicator(color){
    indicator.style.backgroundColor= color;
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;

    //shadow;
} 

function getRandomInteger(min, max){
  return Math.floor(Math.random()*(max-min)) + min;
    
}
function getRandomNumber(){
    return getRandomInteger(0,9)
}
function getLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function getUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function getSymbol(){
    const symbolArr= Array.from(symbols)
    const randNum = getRandomInteger(0, symbols.length);
    return symbolArr[randNum];
}
function calcStrength(){
   let hasUpper= false;
   let hasLower= false;
   let hasNum= false;
   let hasSym= false;
   if(uppercaseCheck.checked) hasUpper=true;
   if(lowercaseCheck.checked) hasLower=true;
   if(numbersCheck.checked) hasNum=true;
   if(symbolsCheck.checked) hasSym=true;
   if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
    setIndicator("#0f0")
   }else if((hasLower|| hasUpper)&&(hasSym||hasNum)&& passwordLength>=6){
    setIndicator("#ff0")
   }else{
    setIndicator("#f00");
   }

}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
       copyMsg.innerText = "failed";
    }
    //to make copymsg visible
   copyMsg.classList.add("active");
   setTimeout(()=>{
    copyMsg.classList.remove("active");
   },2000)
}
function handleCheckBoxChange(){
  checkCount=0;
  allcheckBox.forEach((checkbox)=>{
    if(checkbox.checked)
    checkCount++;
  })
  if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}
allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})
inputSlider.addEventListener('input',(e)=>{
    passwordLength= e.target.value;
    handleSlider()
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
     copyContent();
})
function shufflePassword(array){
    // fisher Yates method
    for(let i= array.length-1 ; i>0 ; i--){
        const j= Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el)=> (str += el));
    return str;
}
// ---generate password--
generateBtn.addEventListener('click',()=>{
  if(checkCount<=0)
   return;
   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }
   console.log("starting the journey")
   //let's start finding new password
   //remove old password
   password="";
//    if(uppercaseCheck.checked){
//     password+=getUpperCase();
//    }
//    if(lowercaseCheck.checked){
//     password+=getLowerCase();
//    }
//    if(numbersCheck.checked){
//     password+=getRandomNumber();
//    }
//    if(symbolsCheck.checked){
//     password+=getSymbol();
//   }
let funcArr = []
   if(uppercaseCheck.checked)
      funcArr.push(getUpperCase);

   if(lowercaseCheck.checked)
      funcArr.push(getLowerCase);

   if(numbersCheck.checked)
      funcArr.push(getRandomNumber);

   if(symbolsCheck.checked)
      funcArr.push(getSymbol);

      //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("Cumpulsory addition done");
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    //Display
    passwordDisplay.value= password;
    console.log("Password Display");
    //strength calculate
    calcStrength();
})