
let wordsForHeading;
var arrowUp = [true,true,true];
let iteration = 0;
var colors = [];
var loaded =false;
var colorsNotFiltred = [];
var conditionsArray = [];
var NumOfProp;
var isModelRGB = 0;
var letterPosition = 0;
var rgbModel = ["R","G","B"];
var hslModel = ["H","S","L"];
var colModel = ["R","G","B"," "];
var allColModels = ["R","B","G","H","S","L"];
window.addEventListener('DOMContentLoaded', () => {
    GetColors();
    GetWords();
})
window.addEventListener("resize", loadColors);

const GetColors = async () => {
    let helparray =[];
    //let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    let uri = 'http://localhost:3000/colorsdata';
    const wait = await fetch(uri);
    const data = await wait.json();
    NumOfProp = NumOfProperties(data);
    if(NumOfProp!=0){
        for (let s = 0; s < JSON.parse(data[0].colors).length; s++) {
            let arrayHelp = [];
            for (let index = 0; index < NumOfProp; index++) {
                let hslText = JSON.parse(data[index].colors)[s];
                var itContains=false;
                var sameColPosition=0;
                    for (var x = 0; x < arrayHelp.length; x++) {
                        if (arrayHelp[x][0]==hslText) {
                            itContains=true;
                            sameColPosition=x;
                        }
                    }
                if (itContains) {
                    arrayHelp[sameColPosition][3] = arrayHelp[sameColPosition][3] + 1;
                }else{
                    // [hsl text, hsl numbers[], rgb numbers [], count]
                    let hslNum = [extractNumFromHsl(hslText,0),extractNumFromHsl(hslText,1),extractNumFromHsl(hslText,2)];
                    let rgbNum = HslToRgb((1/360)*hslNum[0],hslNum[1],hslNum[2]);
                    arrayHelp.push([hslText,hslNum,rgbNum,1]);
                }
        }
        colors.push(arrayHelp);
    }
    loaded = true;
    loadColors();
    colorsNotFiltred = JSON.parse(JSON.stringify(colors));
    }
    loadPageNum();
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
    if (loaded) {
        //nutno přidat pro resize přepočet
    var numOfDiv = document.getElementById("numOfDivs").value;
    var numColDiv = Math.ceil(colors[0].length/numOfDiv);
    var avgMargin = (document.getElementById("resultsDiv").clientHeight-(colors[0].length*40))/(numColDiv+1);
    if (avgMargin<5) {
        avgMargin = 5;
    }
    var divWidth = (document.getElementById("resultsDiv").clientWidth-(numOfDiv*5+5))/numOfDiv; // 5px margin
    var divHeight = (document.getElementById("resultsDiv").clientHeight-(numColDiv*5+5))/numColDiv;
    var numOfLast = (colors[0].length)%numOfDiv;
    if (numOfLast==0) {
        numOfLast=numOfDiv;
    }
    document.getElementById("resultsDiv").innerHTML = "";
    for (let index = 0; index < colors[0].length; index++) {
        var selColor = colors[iteration][index];
        var ColorDiv = document.createElement("div");
        ColorDiv.className = "colorDiv";
        ColorDiv.innerHTML = selColor[3];
        ColorDiv.style.backgroundColor = selColor[0];
        if (colModel[0]=="H") {
            ColorDiv.title = selColor[0];
        } else {
            ColorDiv.title = "rgb("+selColor[2][0]+", "+selColor[2][1]+", "+selColor[2][2]+")";
        }
        // margin setting
        if (numOfDiv==1) {
            var widthDiv1 = document.getElementById("resultsDiv").clientWidth - 10;
            ColorDiv.style.width = widthDiv1 + "px";
            if (index==0) {
                ColorDiv.style.marginTop = avgMargin + "px";
            }
            ColorDiv.style.marginBottom = avgMargin + "px";
        } else {
            ColorDiv.style.width = divWidth+"px";
            if (divHeight<40) {
                divHeight = 40;
            }
            ColorDiv.style.height = divHeight+"px";
        if ((index+1)%numOfDiv==0) {
            ColorDiv.style.marginRight = "0px";
        }
        if (index >= (colors[0].length-numOfLast)) {
            ColorDiv.style.marginBottom = "0px";
        }
        }
        document.getElementById("resultsDiv").appendChild(ColorDiv);    
    }
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
    loadPageNum();
}
function back() {
    if (0 == iteration) {
        iteration = (numOfWords - 1);
    } else {
        iteration--;
    }
    loadWords();
    loadColors();
    loadPageNum();
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
colors = JSON.parse(JSON.stringify(colorsNotFiltred));
loadColors();
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
        elm.style.backgroundImage = "url(/img/arrowDown.png)";
    }else{
        arrowUp[i] = true;
        elm.style.backgroundImage = "url(/img/arrowUp.png)";
    }
}
function extractNumFromHsl(element, numPosition){
positions = [element.indexOf("("), element.indexOf(","), element.indexOf("%"),element.indexOf(")")-2];
if (numPosition==0) {
    return Number(element.replace(/\s/g, "").substring(positions[0]+1,positions[1]));
} else if (numPosition==1) {
    return Number(element.replace(/\s/g, "").substring(positions[1]+1,positions[2]-1))/100;
} else {
    return Number(element.replace(/\s/g, "").substring(positions[2]+1,positions[3]-2))/100;
}
}
function HslToRgb(h,s,l){
    var g, r, b;
    if(s == 0){
        r = g = b = l;
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
 
function Sort(){
    var conditions = [document.getElementById("RGBButton1").value,document.getElementById("RGBButton2").value,document.getElementById("RGBButton3").value];
    var isRGB = 0;
    if (colModel[0]=="R") {
        isRGB=1;
    } else {
        isRGB=0;
    }
 for (let i = 2; i >= 0; i--) {
    if (conditions[i]==" ") {
        continue;
    } else if (conditions[i]==colModel[0]) {
        SortArray(colors,arrowUp[i],isRGB,0)
    } else if (conditions[i]==colModel[1]){
        SortArray(colors,arrowUp[i],isRGB,1)
    } else {
        SortArray(colors,arrowUp[i],isRGB,2)
    }
 }
 loadColors()
}
function SortArray(array,up,rgbOrHsl,position){//  ([],true,0/1,0/1/2)
    for (let n = 0; n < array.length; n++) {
        for (var i = 0; i < array[n].length - 1; i++) {
        for (var j = 0; j < array[n].length - i - 1; j++) {
            if(array[n][j][rgbOrHsl+1][position] < array[n][j+1][rgbOrHsl+1][position]){
                var tmp = array[n][j];
                array[n][j] = array[n][j+1];
                array[n][j+1] = tmp;
            }
        }
    }
    }
    if (up) {
        return array;
    }else{
        array.forEach(element => {
            element.reverse();
        });
    }
}
function loadPageNum(){
    document.getElementById("pageNum").innerHTML=(iteration+1)+"/"+colors.length;
}
function displayFiltr(){
    document.getElementById("filtrPage").style.display = "block";
}
function filtersOff(){
    document.getElementById("filtrPage").style.display = "none";
    document.getElementById("filtrDivs").innerHTML="";
    colors = JSON.parse(JSON.stringify(colorsNotFiltred));
    loadColors();
}
function addCondition(){
    createConditionDiv();
}
function createConditionDiv(){
    var arrayOfSymbols = ["=",">","<","<=",">="];
    var conDiv = document.createElement("div");
    var letterInput = document.createElement("input");
    var selectSymbol = document.createElement("select");
    var valOfCondition = document.createElement("input");
    var delCondition = document.createElement("input");
    letterInput.addEventListener("click",function() {
        circleColModels(letterInput)
      });
      delCondition.addEventListener("click",function() {
        deleteCondition(conDiv)
      });
    conDiv.className="conDiv";
    letterInput.className="letterInput";
    valOfCondition.className="valOfCondition";
    selectSymbol.className="selectSymbol";
    delCondition.className="delCondition";
    letterInput.setAttribute("type","button");
    delCondition.setAttribute("type","button");
    valOfCondition.setAttribute("type","text");
    letterInput.value = "R";
    delCondition.value="-";
    for (let index = 0; index < arrayOfSymbols.length; index++) {
        var option = document.createElement("option");
        option.innerHTML = arrayOfSymbols[index];
        selectSymbol.appendChild(option);
    }
    conDiv.append(letterInput,selectSymbol,valOfCondition,delCondition);
    document.getElementById("filtrDivs").appendChild(conDiv);
}
function deleteCondition(el){
    document.getElementById("filtrDivs").removeChild(el);
}
function circleColModels(el){
    for (let index = 0; index < allColModels.length; index++) {
        if (el.value == allColModels[index]) {
            if ((index+1)==allColModels.length) {
                el.value = allColModels[0].split();
                break;
            } else {
                el.value = allColModels[index+1].split();
                break;
            }
        }
    }
}
function filter(){
    conditionsArray =[];
    var condition = [];
    var divCollection = document.getElementById("filtrDivs").children;
    if (divCollection.length!=0) {
        if(checkIfNumbers(divCollection)){
            colors = JSON.parse(JSON.stringify(colorsNotFiltred));
            for (let i = 0; i < divCollection.length; i++) {
                for (let index = 0; index < (divCollection[i].children.length-1); index++) {
                    condition[index] = divCollection[i].children[index].value.replace(/\s/g, '');
                }
                conditionsArray.push(condition.concat());
            }
            document.getElementById("filtrPage").style.display = "none";
            filterColors();
            loadColors();
        }
    }else{
        filtersOff();
    }
    
}
function checkIfNumbers(divCollection){
    var onlyNum = true;
    for (let index = 0; index < divCollection.length; index++) {
        if(isNaN(divCollection[index].children[2].value)||(divCollection[index].children[2].value.replace(/\s/g, '')==""))
        {
            onlyNum = false;
            divCollection[index].children[2].value = "notNum";
        }
    }
    return onlyNum;
}

function filterColors(){
for (let index = 0; index < conditionsArray.length; index++) {
    getPositions(conditionsArray[index]);
    for (let i = 0; i < colors[iteration].length; i++) {
        if ((isModelRGB==0)&&(letterPosition!=0)) {
            var color = 100*colors[iteration][i][isModelRGB+1][letterPosition];
        } else{
            var color = colors[iteration][i][isModelRGB+1][letterPosition];
        }
        var condi = "" + color + conditionsArray[index][1] + Number(conditionsArray[index][2]);
        if (!eval(condi)) { //chyba
            colors[iteration].splice(i, 1);
            i--;
            continue;
        }
    }
   
}
}
function getPositions(condition){
    if (rgbModel.includes(condition[0])) {
        isModelRGB = 1;
        letterPosition = rgbModel.indexOf(condition[0]);
    } else {
        isModelRGB = 0;
        letterPosition = hslModel.indexOf(condition[0]);
    }
}