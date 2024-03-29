
/* let Canvas = document.getElementsByClassName("ColorSelect")[0]; */
var root = document.querySelector(':root');
/* let CanvasWidth = Canvas.offsetWidth;
let CanvasHeight = Canvas.offsetHeight; */
/* let CanvasLeft = Canvas.getBoundingClientRect().left;
let CanvasTop = Canvas.getBoundingClientRect().top; */
/* let ColorPicker = document.getElementById("ColorPicker"); */
/* let ColorPickerWidth = ColorPicker.offsetWidth / 2;
let ColorPickerHeight = ColorPicker.offsetHeight; */
let BrightnessSelect = document.getElementById("BrightnessSelect");
let BrightnessPicker = document.getElementById("BrightnessPicker");
let ColorBackground = document.getElementById("ColorBackground");
let Main = document.getElementById("Main");
let Copy = document.getElementById("Copy");

let ColorBackgroundLeft = ColorBackground.getBoundingClientRect().left;
let chosenColor = "hsl(180, 50%, 50%)";
let wordIteration = 0;
let wordsForHeading;
var wordsForHeadingRn = [];
let arrayOfColors = [];
var arrayColAndHeadings = [];
var arrayOfNumOrder = [];
let H = 0, S = 100, L = 50;
let R = 255, G = 255, B = 255;
let Counter = document.getElementById("Counter");
let CCounter = document.getElementById("CCounter");
let username = "sám";
let timestamp = 0;
/* root.style.setProperty('--BrightPickerLeft', document.getElementById("BrightnessPicker").offsetLeft + "px"); */
let touchStartY, touchEndY;
let ableToMove = true;

function Barvy(btn) {
    let barva = window.getComputedStyle(btn).backgroundColor;
    GetRGB(barva);
    SetBackground();
}

Main.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchEndY = e.touches[0].clientY;
});

Main.addEventListener('touchmove', function (e) {
    touchEndY = e.touches[0].clientY;
    if(ableToMove)
    TouchMove();
});

Main.addEventListener('touchend', function (e) {
    if(ableToMove)
    TouchCalc();
    touchStartY = 0;
    touchEndY = 0;
});

function TouchMove() {
    let moveY = touchStartY - touchEndY;
    Copy.style.transitionDuration = "0.1s";

    Copy.style.paddingTop = 200 - moveY / 2 + "%";

}
function TouchCalc() {
    if (touchStartY - touchEndY > 130) TikTokNext();
    else {
        Copy.style.transitionDuration = "1.1s";
        Copy.style.paddingTop = "200%";
    }
}

function TikTokNext() {
    ableToMove = false;
    Copy.style.transitionDuration = "1.1s";
    Copy.style.paddingTop = "0";
    R = 255;
    G = 255;
    B = 255;
    ColorBackground.style.transitionDuration = "1000ms";
    SetBackground();

    setTimeout(() => {

        nextWord();
        Copy.style.transitionDuration = "0s";
        Copy.style.paddingTop = "200%";

        setTimeout(() => {
            Copy.style.transitionDuration = "1.1s";
            ColorBackground.style.transitionDuration = "0.2s";
            ableToMove = true;
        }, 100);
    }, 1100);
}

function GetRGB(barva) {
    R = 0;
    G = 0;
    B = 0;
    let RGB = [R, G, B];
    let index = 0;
    for (let i = 4; i < barva.length - 1; i++) {
        if (barva[i] == ",") index++;
        else if (barva[i] != " " && barva[i] != "(") {
            RGB[index] = RGB[index] * 10 + Number(barva[i]);
        }
    }
    R = RGB[0];
    G = RGB[1];
    B = RGB[2];
}

window.addEventListener('DOMContentLoaded', () => {
    GetQuestions();
    setInterval(TimeIncrement, 500);
})

document.addEventListener('keypress', (event) => {
    if (event.key == "1") ShowLogin();
})

function TimeIncrement() {
    timestamp += 500;
}

function ShowLogin() {

    if (login.style.display == "none" || login.style.display == "") login.style.display = "inherit";
    else login.style.display = "none";
}

function CreateLogin() {
    let loginBtn = document.createElement("input")
    loginBtn.type = "button"
    loginBtn.value = "OK";
    loginBtn.id = "tutorialbutton";
    login.appendChild(loginBtn);
    loginBtn.addEventListener('click', () => {
        username = document.getElementById("loginText").value;
        if (username == "") {
            username = "sám";
            alert("Prázdné jméno -> uloží se výchozí hodnota");
        } else alert("Na dotazník dohlíží: " + username);
        login.style.display = "none";
    });
}

CreateLogin();

const GetQuestions = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();

    wordsForHeading = data[0].data;
    getRnArrayOrder(wordsForHeading);
    assignRnHeadingsArray();
    fillColAndHeadingArray();
    nextWord();
}
function assignRnHeadingsArray() {
    arrayOfNumOrder.forEach(element => {
        wordsForHeadingRn.push(wordsForHeading[element]);
    });
}
function getRnArrayOrder(wordsHeading) {
    for (let index = 0; index < wordsHeading.length; index++) {
        var rnNumber;
        do {
            rnNumber = getRnInteger(wordsHeading.length);
        } while (arrayOfNumOrder.includes(rnNumber));
        arrayOfNumOrder.push(rnNumber);
    }
}
function getRnInteger(max) {
    var min = 0;
    return Math.floor(Math.random() * (max - min)) + min;
}
function fillColAndHeadingArray() {
    for (let index = 0; index < wordsForHeadingRn.length; index++) {
        arrayColAndHeadings.push([wordsForHeadingRn[index], "hsl(180, 50%, 50%)"]);
    }
}
function Click(el) {
    console.log(el.clientX - 406);
    console.log(el.clientY - 319);
    console.log(CanvasHeight + " " + CanvasWidth);

    document.getElementById("BrightnessSelect").style.background = "";
}

function SaturaionClick(e) {
    let x = e.clientX - CanvasLeft;
    let y = e.clientY - CanvasTop;

    H = x / CanvasWidth * 360;
    S = 100 - (y / CanvasHeight * 100);

    if (H > 360) H = 360;
    if (H < 0) H = 0;
    if (S > 100) S = 100;
    if (S < 0) S = 0;

    root.style.setProperty('--H', H);
    root.style.setProperty('--S', S + "%");

    let pickerX = Number(e.clientX) - ColorPickerWidth - ColorBackgroundLeft;
    let pickerY = Number(e.clientY) - ColorPickerWidth;

    if (e.clientX <= (CanvasLeft - ColorPickerWidth / 2 + 3)) pickerX = CanvasLeft - ColorPickerWidth - ColorBackgroundLeft;
    if (e.clientX >= (CanvasLeft + CanvasWidth + ColorPickerWidth / 2 - 3)) pickerX = CanvasLeft + CanvasWidth - ColorPickerWidth - ColorBackgroundLeft;

    if (e.clientY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - ColorPickerWidth;
    if (e.clientY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasTop + CanvasHeight - ColorPickerWidth;

    root.style.setProperty('--PickerX', pickerX + "px");
    root.style.setProperty('--PickerY', pickerY + "px");

    SetBackground();
}

/* document.body.onmousemove = function Click(e) {
    if(document.body.offsetWidth > 1050){
        if (SaturationMD) {
            SaturaionClick(e);
        }
        if (BrightnessMD) {
            BrightnessClick(e);
        }
    }
    
} */

function BrightnessClick(e) {
    let y = e.clientY - CanvasTop;
    let pickerY = Number(e.clientY) - CanvasTop - BrightnessPicker.offsetHeight / 2;

    if (e.clientY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - CanvasTop - BrightnessPicker.offsetHeight / 2;
    if (e.clientY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasHeight - BrightnessPicker.offsetHeight / 2;

    L = 100 - (y / CanvasHeight * 100);
    if (L > 100) L = 100;
    if (L < 0) L = 0;
    root.style.setProperty('--BPickerY', pickerY + "px");

    SetBackground();
}

function SetBackground() {
    ColorBackground.style.backgroundColor = "rgb(" + R + ", " + G + ", " + B + ")";
    chosenColor = "rgb(" + R + ", " + G + ", " + B + ")";

    let Subject = document.getElementById("Subject");
    if ((R + G + B) / 3 > 128) Subject.style.color = "black";
    else Subject.style.color = "White";

    if (document.body.getBoundingClientRect().width < 1050) {
        if ((R + G + B) / 3 > 128) document.getElementById("Counter").style.color = "black";
        else document.getElementById("Counter").style.color = "White";
    } else document.getElementById("Counter").style.color = "White";
}

var SaturationMD = false;
/* document.body.onmouseup = function () {
    BrightnessMD = false;
    SaturationMD = false;
}

document.getElementById("Saturation").onmousedown = function (e) {
    SaturationMD = true;
    BrightnessMD = false;
    SaturaionClick(e);
}
document.getElementById("Saturation").ontouchmove = function (e) {
    SaturationMD = true;
    BrightnessMD = false;
    SaturaionTap(e);
}
document.getElementById("Saturation").onmouseup = function () {
    SaturationMD = false;
}
document.getElementById("Saturation").ontouchcancel = function () {
    SaturationMD = false;
} */

var BrightnessMD = false;
/* BrightnessSelect.ontouchmove = function (e) {
    BrightnessMD = true;
    SaturationMD = false;
    BrightnessTap(e);
}
BrightnessSelect.onmousedown = function (e) {
    BrightnessMD = true;
    SaturationMD = false;
    BrightnessClick(e);
}

BrightnessSelect.onmouseup = function () {
    BrightnessMD = false;
}
BrightnessSelect.ontouchcancel = function () {
    BrightnessMD = false;
} */

function ResetBoundries() {
    CanvasWidth = Canvas.offsetWidth;
    CanvasHeight = Canvas.offsetHeight;
    CanvasLeft = Canvas.getBoundingClientRect().left;
    CanvasTop = Canvas.getBoundingClientRect().top;
    root.style.setProperty('--BrightPickerLeft', document.getElementById("BrightnessPicker").offsetLeft + "px");
    root.style.setProperty('--PickerX', '50%');
    root.style.setProperty('--PickerY', '50%');

    ColorBackgroundLeft = ColorBackground.getBoundingClientRect().left;
}
function nextWord() {


    SaturationMD = false;
    BrightnessMD = false;
    if (wordIteration == 0) {
        document.getElementById("Subject").innerHTML = arrayColAndHeadings[wordIteration][0];
        document.getElementById("CSubject").innerHTML = arrayColAndHeadings[wordIteration + 1][0];

        wordIteration++;
    } else {
        if (wordIteration == 1) {
            arrayColAndHeadings[wordIteration - 1][1] = chosenColor;
            const JSONColors = JSON.stringify(arrayColAndHeadings);
            localStorage.setItem("JSONColor", JSONColors);
        } else {
            let oldColors = localStorage.getItem("JSONColor");
            arrayColAndHeadings = JSON.parse(oldColors);
            arrayColAndHeadings[wordIteration - 1][1] = chosenColor;
            let JSONColors = JSON.stringify(arrayColAndHeadings);
            localStorage.setItem("JSONColor", JSONColors);
        }
        // ColorBackground.style.backgroundColor = "hsl(" + 0 + ", " + 0 + "% , " + 100 + "%)";
        if (!(wordIteration < wordsForHeading.length)) {
            ColorBackground.style.backgroundColor = "hsl(" + 200 + ", " + 58 + "% , " + 39 + "%)";
            const node = document.createElement("p");
            const textnode = document.createTextNode("Děkujeme za vyplnění.");
            node.appendChild(textnode);
            node.id = "endingMessage";
            document.body.innerHTML = "";
            document.body.appendChild(node);
            setColArrayInRightOrder();
            // code for sending data to server can be added here
            Save(JSON.stringify(setColArrayInRightOrder()));
        } else {
            document.getElementById("Subject").innerHTML = arrayColAndHeadings[wordIteration][0];
            if (wordIteration + 1 < arrayColAndHeadings.length)
                document.getElementById("CSubject").innerHTML = arrayColAndHeadings[wordIteration + 1][0];
            else {
                document.getElementById("CColorBackground").style.backgroundColor = "hsl(" + 200 + ", " + 58 + "% , " + 0 + "%)";
                const node = document.createElement("p");
                const textnode = document.createTextNode("Děkujeme za vyplnění.");
                node.appendChild(textnode);
                node.id = "endingMessage";
                document.getElementById("CColorBackground").innerHTML = "";
                Copy.appendChild(node);
                Counter.innerHTML = "";
            }
        }
        wordIteration++;
    }
    Counter.innerHTML = wordIteration + "/" + wordsForHeading.length;
    /* CCounter.innerHTML = wordIteration + 1 + "/" + wordsForHeading.length; */

}
function setColArrayInRightOrder() {
    arrayOfColors = [];
    wordsForHeading.forEach(el => {
        for (let index = 0; index < arrayColAndHeadings.length; index++) {
            if (el == arrayColAndHeadings[index][0]) {
                arrayOfColors.push(arrayColAndHeadings[index][1]);
                break;
            }
        }
    });
    return arrayOfColors;
}

const Save = async (data) => {
    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    //let uri = 'http://localhost:3000/colorsdata';
    let saveData = {
        colors: data,
        timestamp_s: timestamp / 1000,
        collector: username
    };

    await fetch(uri, {
        method: 'POST',
        body: JSON.stringify(saveData),
        headers: { 'Content-Type': 'application/json' }
    });
    //window.location.replace('index.html'); na konci dotazníku načte znova stránku
}

function SaturaionTap(e) {
    let x = e.targetTouches[0].pageX - CanvasLeft;
    let y = e.targetTouches[0].pageY - CanvasTop;

    H = x / CanvasWidth * 360;
    S = 100 - (y / CanvasHeight * 100);

    if (H > 360) H = 360;
    if (H < 0) H = 0;
    if (S > 100) S = 100;
    if (S < 0) S = 0;

    root.style.setProperty('--H', H);
    root.style.setProperty('--S', S + "%");

    let pickerX = Number(e.targetTouches[0].pageX) - ColorPickerWidth - ColorBackgroundLeft;
    let pickerY = Number(e.targetTouches[0].pageY) - ColorPickerWidth;

    if (e.targetTouches[0].pageX <= (CanvasLeft - ColorPickerWidth / 2 + 3)) pickerX = CanvasLeft - ColorPickerWidth - ColorBackgroundLeft;
    if (e.targetTouches[0].pageX >= (CanvasLeft + CanvasWidth + ColorPickerWidth / 2 - 3)) pickerX = CanvasLeft + CanvasWidth - ColorPickerWidth - ColorBackgroundLeft;

    if (e.targetTouches[0].pageY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - ColorPickerWidth;
    if (e.targetTouches[0].pageY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasTop + CanvasHeight - ColorPickerWidth;

    root.style.setProperty('--PickerX', pickerX + "px");
    root.style.setProperty('--PickerY', pickerY + "px");

    SetBackground();
}

function BrightnessTap(e) {
    let y = e.targetTouches[0].pageY - CanvasTop;
    let pickerY = Number(e.targetTouches[0].pageY) - CanvasTop - BrightnessPicker.offsetHeight / 2;

    if (e.targetTouches[0].pageY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - CanvasTop - BrightnessPicker.offsetHeight / 2;
    if (e.targetTouches[0].pageY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasHeight - BrightnessPicker.offsetHeight / 2;

    L = 100 - (y / CanvasHeight * 100);
    if (L > 100) L = 100;
    if (L < 0) L = 0;
    root.style.setProperty('--BPickerY', pickerY + "px");
    SetBackground();
}