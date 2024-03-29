
let wordsForHeading;
var arrowUp = [true, true, true];
let iteration = 0;
var colors = [];
var loaded = false;
var colorsNotFiltred = [];
var conditionsArray = [];
var NumOfProp;
var isModelRGB = 0;
var letterPosition = 0;
var rgbModel = ["R", "G", "B"];
var hslModel = ["H", "S", "L"];
var colModel = ["R", "G", "B", " "];
var allColModels = ["R", "B", "G", "H", "S", "L"];
window.addEventListener('DOMContentLoaded', () => {
    GetColors();
    GetWords();
})
window.addEventListener("resize", loadColors);

const GetColors = async () => {
    let helparray = [];
    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    //let uri = 'http://localhost:3000/colorsdata';
    const wait = await fetch(uri);
    const data = await wait.json();
    NumOfProp = NumOfProperties(data);
    if (NumOfProp != 0) {
        for (let s = 0; s < JSON.parse(data[0].colors).length; s++) {
            let arrayHelp = [];
            for (let index = 0; index < NumOfProp; index++) {
                let hslText = JSON.parse(data[index].colors)[s];
                if(hslText[0] == "r") hslText = RGBToHSL(hslText);
                var itContains = false;
                var sameColPosition = 0;
                for (var x = 0; x < arrayHelp.length; x++) {
                    if (arrayHelp[x][0] == hslText) {
                        itContains = true;
                        sameColPosition = x;
                    }
                }
                if (itContains) {
                    arrayHelp[sameColPosition][3] = arrayHelp[sameColPosition][3] + 1;
                } else {
                    // [hsl text, hsl numbers[], rgb numbers [], count]
                    let hslNum = [extractNumFromHsl(hslText, 0), extractNumFromHsl(hslText, 1), extractNumFromHsl(hslText, 2)];
                    let rgbNum = HslToRgb((1 / 360) * hslNum[0], hslNum[1], hslNum[2]);
                    arrayHelp.push([hslText, hslNum, rgbNum, 1]);
                }
            }
            colors.push(arrayHelp);
        }
        loaded = true;
        loadColors();
        colorsNotFiltred = JSON.parse(JSON.stringify(colors));
    }
    loadPageNum();
    Sort();
}
function RGBToHSL(barva) {
    R = 0;
    G = 0;
    B = 0;
    let RGB = [R, G, B];
    let index = 0;
    for (let i = 4; i < barva.length-1; i++) {
        if(barva[i] == ",") index++;
        else if(barva[i] != " " && barva[i] != "("){
        RGB[index] = RGB[index]*10 + Number(barva[i]);
        }
    }
    R = RGB[0];
    G = RGB[1];
    B = RGB[2];

    var_R = (R / 255)
    var_G = (G / 255)
    var_B = (B / 255)

    var_Min = Math.min(var_R, var_G, var_B)    //Min. value of RGB
    var_Max = Math.max(var_R, var_G, var_B)    //Max. value of RGB
    del_Max = var_Max - var_Min             //Delta RGB value

    L = (var_Max + var_Min) / 2

    if (del_Max == 0)                     //This is a gray, no chroma...
    {
        H = 0
        S = 0
    }
    else                                    //Chromatic data...
    {
        if (L < 0.5) S = del_Max / (var_Max + var_Min)
        else S = del_Max / (2 - var_Max - var_Min)

        del_R = (((var_Max - var_R) / 6) + (del_Max / 2)) / del_Max
        del_G = (((var_Max - var_G) / 6) + (del_Max / 2)) / del_Max
        del_B = (((var_Max - var_B) / 6) + (del_Max / 2)) / del_Max

        if (var_R == var_Max) H = del_B - del_G
        else if (var_G == var_Max) H = (1 / 3) + del_R - del_B
        else if (var_B == var_Max) H = (2 / 3) + del_G - del_R

        if (H < 0) H += 1
        if (H > 1) H -= 1
    }
    return "hsl(" + H*360 + ", " + S*100 + "% , " + L * 100 + "%)"
}
const GetWords = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();
    wordsForHeading = data[0].data;
    numOfWords = wordsForHeading.length;
    loadWords();
}
function getScrollBarWidth() {
    let element = document.createElement("div");
    element.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
    document.body.appendChild(element);
    let scrollbarWidth = element.offsetWidth - element.clientWidth;
    element.remove();
    return scrollbarWidth;
}
function loadColors() {
    if (loaded) {
        //nutno přidat pro resize přepočet
        document.getElementById("resultsDiv").innerHTML = "";
        var numOfDiv = document.getElementById("numOfDivs").value;
        var numRowDiv = Math.ceil(colors[iteration].length / numOfDiv);
        var avgMargin = (document.getElementById("resultsDiv").clientHeight - (colors[iteration].length * 40)) / (numRowDiv + 1);
        if (avgMargin < 5) {
            avgMargin = 5;
        }
        var scrollbarWidth = getScrollBarWidth();
        var divHeight = (document.getElementById("resultsDiv").clientHeight - (numRowDiv * 5 + 5)) / numRowDiv;
        if (divHeight < 40) {
            divHeight = 40;
        }
        if (document.getElementById("resultsDiv").clientHeight <= ((divHeight * numRowDiv) + (numRowDiv * 5 + 5))) {
            //alert(document.getElementById("resultsDiv").clientHeight);
            //alert("no scrollbar yes overflow");
            var divWidth = (document.getElementById("resultsDiv").clientWidth - (numOfDiv * 5 + 5) - scrollbarWidth) / numOfDiv; // 5px margin
            var widthDiv1 = document.getElementById("resultsDiv").clientWidth - 10 - scrollbarWidth;
        } else {
            //alert(document.getElementById("resultsDiv").clientHeight);
            //alert("no scrollbar no overflow");
            var divWidth = (document.getElementById("resultsDiv").clientWidth - (numOfDiv * 5 + 5)) / numOfDiv; // 5px margin
            var widthDiv1 = document.getElementById("resultsDiv").clientWidth - 10;
        }
        var numOfLast = (colors[iteration].length) % numOfDiv;
        if (numOfLast == 0) {
            numOfLast = numOfDiv;
        }
        for (let index = 0; index < colors[iteration].length; index++) {
            var selColor = colors[iteration][index];
            var ColorDiv = document.createElement("div");
            ColorDiv.className = "colorDiv";
            ColorDiv.style.display = "flex";
            ColorDiv.innerHTML = "<span style='margin:auto;' >" + selColor[3] + "</span>";
            ColorDiv.style.backgroundColor = selColor[0];
            if ((index < numOfDiv) && (numOfDiv != 1)) {
                ColorDiv.style.marginTop = "5px";
            }
            if (colModel[0] == "H") {
                ColorDiv.title = selColor[0];
            } else {
                ColorDiv.title = "rgb(" + selColor[2][0] + ", " + selColor[2][1] + ", " + selColor[2][2] + ")";
            }
            // margin setting
            if (numOfDiv == 1) {
                ColorDiv.style.width = widthDiv1 + "px";
                if (index == 0) {
                    ColorDiv.style.marginTop = avgMargin + "px";
                }
                ColorDiv.style.marginBottom = avgMargin + "px";
            } else {
                ColorDiv.style.width = divWidth + "px";
                ColorDiv.style.height = divHeight + "px";
                if ((index + 1) % numOfDiv == 0) {
                    ColorDiv.style.marginRight = "0px";
                }
                if (index >= (colors[iteration].length - numOfLast)) {
                    ColorDiv.style.marginBottom = "0px";
                }
            }

            ColorDiv.style.cursor = "pointer";
            document.getElementById("resultsDiv").appendChild(ColorDiv);
        }
    }
    document.getElementById("numOfAnswers").innerHTML = "Počet barev: " + colors[iteration].length;
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
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function changeOfColorType() {
    if (document.getElementById("colorModel").value == "rgb") {
        colModel = ["R", "G", "B", " "];
        resetPreference();
    } else {
        colModel = ["H", "S", "L", " "];
        resetPreference();
    }
    colors = JSON.parse(JSON.stringify(colorsNotFiltred));
    loadColors();
}

function adjustColorModelArray(colMod, iter) {
    let arrayOfSelected = [document.getElementById("RGBButton1").value, document.getElementById("RGBButton2").value];
    let indexOfGetRidElement;
    let spliceArray = false;
    if (0 == iter) {
        document.getElementById("RGBButton2").value = " ";
        document.getElementById("RGBButton3").value = " ";
    } else if (1 == iter) {
        document.getElementById("RGBButton3").value = " ";
    }
    for (let s = 0; s < iter; s++) {
        spliceArray = false;
        for (let i = 0; i < colMod.length; i++) {
            if ((arrayOfSelected[s] == colMod[i]) && (colMod[i] != " ")) {
                indexOfGetRidElement = i;
                spliceArray = true;
            }
        }
        if (spliceArray) {
            colMod.splice(indexOfGetRidElement, 1);
        }
    }
    return colMod;
}
function resetPreference() {
    document.getElementById("RGBButton1").value = " ";
    document.getElementById("RGBButton2").value = " ";
    document.getElementById("RGBButton3").value = " ";
}

function ChangeSort(elm) {
    var newcolModel = colModel.slice();
    let iter = 0;
    if (document.getElementById("RGBButton2") == elm) {
        iter = 1;
    } else if (document.getElementById("RGBButton3") == elm) {
        iter = 2;
    }
    elm.value = returnSortLetter(adjustColorModelArray(newcolModel, iter), elm.value);
    if ((document.getElementById("RGBButton3") == elm) && ((document.getElementById("RGBButton2").value == " ") || (document.getElementById("RGBButton1").value == " "))) {
        elm.value = " ";
    } else if ((document.getElementById("RGBButton2") == elm) && (document.getElementById("RGBButton1").value == " ")) {
        elm.value = " ";
    }
}

function returnSortLetter(colMod, val) {
    for (let s = 0; s < colMod.length; s++) {
        if (colMod[s] == val) {
            if ((colMod.length - 1) == s) {
                val = colMod[0];
                return val;
            } else {
                val = colMod[s + 1];
                return val;
            }
        }

    }
}

function SortUpDown(elm) {
    if (elm == document.getElementById("UpDown1")) {
        SortUpDownHelp(0, elm);
    } else if (elm == document.getElementById("UpDown2")) {
        SortUpDownHelp(1, elm);
    } else {
        SortUpDownHelp(2, elm);
    }
}

function SortUpDownHelp(i, elm) {
    if (arrowUp[i]) {
        arrowUp[i] = false;
        elm.style.backgroundImage = "url(/img/arrowUp.png)";
    } else {
        arrowUp[i] = true;
        elm.style.backgroundImage = "url(/img/arrowDown.png)";
    }
}
function extractNumFromHsl(element, numPosition) {
    positions = [element.indexOf("("), element.indexOf(","), element.indexOf("%"), element.indexOf(")") - 2];
    if (numPosition == 0) {
        return Number(element.replace(/\s/g, "").substring(positions[0] + 1, positions[1]));
    } else if (numPosition == 1) {
        return Number(element.replace(/\s/g, "").substring(positions[1] + 1, positions[2] - 1)) / 100;
    } else {
        return Number(element.replace(/\s/g, "").substring(positions[2] + 1, positions[3] - 2)) / 100;
    }
}
function HslToRgb(h, s, l) {
    var g, r, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function Sort() {
    var conditions = [document.getElementById("RGBButton1").value, document.getElementById("RGBButton2").value, document.getElementById("RGBButton3").value];
    var isRGB = 0;
    if (colModel[0] == "R") {
        isRGB = 1;
    } else {
        isRGB = 0;
    }
    for (let i = 2; i >= 0; i--) {
        if (conditions[i] == " ") {
            continue;
        } else if (conditions[i] == colModel[0]) {
            SortArray(colors, arrowUp[i], isRGB, 0)
        } else if (conditions[i] == colModel[1]) {
            SortArray(colors, arrowUp[i], isRGB, 1)
        } else {
            SortArray(colors, arrowUp[i], isRGB, 2)
        }
    }
    loadColors()
}
function SortArray(array, up, rgbOrHsl, position) {//  ([],true,0/1,0/1/2)
    for (let n = 0; n < array.length; n++) {
        for (var i = 0; i < array[n].length - 1; i++) {
            for (var j = 0; j < array[n].length - i - 1; j++) {
                if (array[n][j][rgbOrHsl + 1][position] < array[n][j + 1][rgbOrHsl + 1][position]) {
                    var tmp = array[n][j];
                    array[n][j] = array[n][j + 1];
                    array[n][j + 1] = tmp;
                }
            }
        }
    }
    if (up) {
        return array;
    } else {
        array.forEach(element => {
            element.reverse();
        });
    }
}
function loadPageNum() {
    document.getElementById("pageNum").innerHTML = (iteration + 1) + "/" + colors.length;
}
function displayFiltr() {
    document.getElementById("filtrPage").style.display = "block";
    setDarkBackground();
}
function filtersOff() {
    setWhiteBackground();
    document.getElementById("filtrPage").style.display = "none";
    document.getElementById("filtrDivs").innerHTML = "";
    colors = JSON.parse(JSON.stringify(colorsNotFiltred));
    loadColors();
}
function addCondition() {
    if (!document.getElementById("filtrDivs").hasChildNodes()) {
        createConditionDiv();
    }
}
function createConditionDiv() {
    var arrayOfSymbols = ["==", ">", "<", "<=", ">="];
    var conDiv = document.createElement("div");
    var letterInput = document.createElement("input");
    var selectSymbol = document.createElement("select");
    var valOfCondition = document.createElement("input");
    var delCondition = document.createElement("input");
    letterInput.addEventListener("click", function () {
        circleColModels(letterInput)
    });
    delCondition.addEventListener("click", function () {
        deleteCondition(conDiv)
    });
    conDiv.className = "conDiv";
    letterInput.className = "letterInput";
    valOfCondition.className = "valOfCondition";
    selectSymbol.className = "selectSymbol";
    delCondition.className = "delCondition";
    letterInput.setAttribute("type", "button");
    delCondition.setAttribute("type", "button");
    valOfCondition.setAttribute("type", "text");
    letterInput.value = "R";
    delCondition.value = "-";
    for (let index = 0; index < arrayOfSymbols.length; index++) {
        var option = document.createElement("option");
        option.innerHTML = arrayOfSymbols[index];
        selectSymbol.appendChild(option);
    }
    conDiv.append(letterInput, selectSymbol, valOfCondition, delCondition);
    document.getElementById("filtrDivs").appendChild(conDiv);
}
function deleteCondition(el) {
    document.getElementById("filtrDivs").removeChild(el);
}
function circleColModels(el) {
    for (let index = 0; index < allColModels.length; index++) {
        if (el.value == allColModels[index]) {
            if ((index + 1) == allColModels.length) {
                el.value = allColModels[0].split();
                break;
            } else {
                el.value = allColModels[index + 1].split();
                break;
            }
        }
    }
}
function setDarkBackground() {
    document.body.backgroundImage = "none";
    var r = document.querySelector(':root');
    r.style.setProperty('--blurDiv', '6px');
    r.style.setProperty('--darkenDiv', '0.99');
}
function setWhiteBackground() {
    document.body.backgroundImage = "url(../img/palette.svg)";
    var r = document.querySelector(':root');
    r.style.setProperty('--blurDiv', '0px');
    r.style.setProperty('--darkenDiv', '1');
}
function filter() {
    conditionsArray = [];
    var condition = [];
    var divCollection = document.getElementById("filtrDivs").children;
    if (divCollection.length != 0) {
        if (checkIfNumbers(divCollection)) {
            colors = JSON.parse(JSON.stringify(colorsNotFiltred));
            for (let i = 0; i < divCollection.length; i++) {
                for (let index = 0; index < (divCollection[i].children.length - 1); index++) {
                    condition[index] = divCollection[i].children[index].value.replace(/\s/g, '');
                }
                conditionsArray.push(condition.concat());
            }
            document.getElementById("filtrPage").style.display = "none";
            setWhiteBackground();
            filterColors();
            loadColors();
        }
    } else {
        filtersOff();
    }

}
function checkIfNumbers(divCollection) {
    var onlyNum = true;
    for (let index = 0; index < divCollection.length; index++) {
        if (isNaN(divCollection[index].children[2].value) || (divCollection[index].children[2].value.replace(/\s/g, '') == "")) {
            onlyNum = false;
            divCollection[index].children[2].value = "notNum";
        }
    }
    return onlyNum;
}

function filterColors() {
    for (let index = 0; index < conditionsArray.length; index++) {
        getPositions(conditionsArray[index]);
        for (let i = 0; i < colors[iteration].length; i++) {
            if ((isModelRGB == 0) && (letterPosition != 0)) {
                var color = 100 * colors[iteration][i][isModelRGB + 1][letterPosition];
            } else {
                var color = colors[iteration][i][isModelRGB + 1][letterPosition];
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
function getPositions(condition) {
    if (rgbModel.includes(condition[0])) {
        isModelRGB = 1;
        letterPosition = rgbModel.indexOf(condition[0]);
    } else {
        isModelRGB = 0;
        letterPosition = hslModel.indexOf(condition[0]);
    }
}
