
let wordsForHeading;
arrowUp = [true,true,true];
let iteration = 0;
var colors = [];
var colorsRGB = [];
var NumOfProp;
var colModel = ["R","G","B"," "];
window.addEventListener('DOMContentLoaded', () => {
    GetColors();
    GetWords();
})

const GetColors = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    const wait = await fetch(uri);
    const data = await wait.json();
    NumOfProp = NumOfProperties(data);
    for (let index = 0; index < NumOfProp; index++) {
        colors.push(JSON.parse(data[index].colors));
    }
    loadColors();
    HSLArrayToRGB();
}

const GetWords = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();
    wordsForHeading = data[0].data;
    numOfWords = wordsForHeading.length;
    loadWords();
}

function loadColors() {
    document.getElementById("resultsDiv").innerHTML = "";
    for (let index = 0; index < NumOfProp; index++) {
        var ColorDiv = document.createElement("div");
        ColorDiv.className = "colorDiv";
        ColorDiv.style.backgroundColor = colors[index][iteration];
        ColorDiv.title = colors[index][iteration];
        document.getElementById("resultsDiv").appendChild(ColorDiv);    
    }
}

function loadWords() {
    document.getElementById("word").innerHTML = wordsForHeading[iteration];
}

function next() {
    if ((numOfWords - 1) == iteration) {
        iteration = 0;
    } else {
        iteration++;
    }
    loadWords();
    loadColors();
}
function back() {
    if (0 == iteration) {
        iteration = (numOfWords - 1);
    } else {
        iteration--;
    }
    loadWords();
    loadColors();
}

function NumOfProperties(obj) {
    var count = 0;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function changeOfColorType(){
if (document.getElementById("colorModel").value=="rgb") {
    colModel = ["R","G","B"," "];
    resetPreference();
}else{
    colModel = ["H","S","L"," "];
    resetPreference();
}
}

function adjustColorModelArray (colMod, iter){
    let arrayOfSelected = [document.getElementById("RGBButton1").value,document.getElementById("RGBButton2").value];
    let indexOfGetRidElement;
    let spliceArray = false;
    if (0==iter) {
        document.getElementById("RGBButton2").value=" ";
        document.getElementById("RGBButton3").value=" ";
    } else if (1==iter) {
        document.getElementById("RGBButton3").value=" ";
    }
    for (let s = 0; s < iter; s++) {
        spliceArray = false;
        for (let i = 0; i < colMod.length; i++) {
            if ((arrayOfSelected[s] == colMod[i])&&(colMod[i]!=" ")) {
                indexOfGetRidElement = i;
                spliceArray=true;
            }
        }
        if (spliceArray) {
            colMod.splice(indexOfGetRidElement,1);
        }
    }
    return colMod;
}
function resetPreference(){
    document.getElementById("RGBButton1").value = " ";
    document.getElementById("RGBButton2").value = " ";
    document.getElementById("RGBButton3").value = " ";
}

function ChangeSort(elm){
var newcolModel = colModel.slice();
let iter = 0;
if (document.getElementById("RGBButton2")==elm) {
    iter = 1;
} else if (document.getElementById("RGBButton3")==elm) {
    iter = 2;
}
elm.value = returnSortLetter(adjustColorModelArray(newcolModel,iter),elm.value);
if ((document.getElementById("RGBButton3")==elm)&&((document.getElementById("RGBButton2").value == " ")||(document.getElementById("RGBButton1").value == " "))) {
    elm.value = " ";
}else if ((document.getElementById("RGBButton2")==elm)&&(document.getElementById("RGBButton1").value == " ")) {
    elm.value = " ";
}
}

function returnSortLetter(colMod, val){
for (let s = 0; s < colMod.length; s++) {
    if (colMod[s]==val) {
        if((colMod.length-1) == s){
            val = colMod[0];
            return val;
        } else{
            val = colMod[s+1];
            return val;
        }
    }
    
}
}

function SortUpDown(elm){
if (elm == document.getElementById("UpDown1")) {
    SortUpDownHelp(0,elm);
}else if(elm == document.getElementById("UpDown2")){
    SortUpDownHelp(1,elm);
}else{
    SortUpDownHelp(2,elm);
}
}

function SortUpDownHelp(i,elm){
    if (arrowUp[i]) {
        arrowUp[i] = false;
        elm.style.backgroundImage = "url(/img/arrowUp.png)";
    }else{
        arrowUp[i] = true;
        elm.style.backgroundImage = "url(/img/arrowDown.png)";
    }
}