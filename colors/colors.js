let Canvas = document.getElementsByClassName("ColorSelect")[0];
var root = document.querySelector(':root');
let CanvasWidth = Canvas.offsetWidth;
let CanvasHeight = Canvas.offsetHeight;
let CanvasLeft = Canvas.getBoundingClientRect().left;
let CanvasTop = Canvas.getBoundingClientRect().top;
let ColorPicker = document.getElementById("ColorPicker");
let ColorPickerWidth = ColorPicker.offsetWidth / 2;
let ColorPickerHeight = ColorPicker.offsetHeight;
let BrightnessSelect = document.getElementById("BrightnessSelect");
let BrightnessPicker = document.getElementById("BrightnessPicker");
let ColorBackground = document.getElementById("ColorBackground");
let ColorBackgroundLeft = ColorBackground.getBoundingClientRect().left;
let chosenColor = "hsl(180, 50%, 50%)";
let wordIteration = 0;
let wordsForHeading;
let arrayOfColors = [];
let H, S = 100, L = 50;
let Counter = document.getElementById("Counter");
root.style.setProperty('--BrightPickerLeft', document.getElementById("BrightnessPicker").offsetLeft + "px");

window.addEventListener('DOMContentLoaded', () => {
    GetQuestions();
})

const GetQuestions = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();

    wordsForHeading = data[0].data;
    console.log(wordsForHeading);
    nextWord();
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
    S = Math.abs(100 - (y / CanvasHeight * 100));

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

document.body.onmousemove = function Click(e) {
    if (SaturationMD) {
        SaturaionClick(e);
    }
    if (BrightnessMD) {
        BrightnessClick(e);
    }
}

function BrightnessClick(e) {
    let y = e.clientY - CanvasTop;
    let pickerY = Number(e.clientY) - CanvasTop - BrightnessPicker.offsetHeight / 2;

    if (e.clientY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - CanvasTop - BrightnessPicker.offsetHeight / 2;
    if (e.clientY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasHeight - BrightnessPicker.offsetHeight / 2;

    L = Math.abs(100 - (y / CanvasHeight * 100));
    root.style.setProperty('--BPickerY', pickerY + "px");

    SetBackground();
}

function SetBackground() {
    ColorBackground.style.backgroundColor = "hsl(" + H + ", " + S + "% , " + L + "%)";
    chosenColor = "hsl(" + H + ", " + S + "% , " + L + "%)";

    if ((L > 60 && H > 180) || (L > 40 && H <= 180)) document.getElementById("Subject").style.color = "black";
    else document.getElementById("Subject").style.color = "White";

    if (document.body.getBoundingClientRect().width < 1050) {
        if ((L > 60 && H > 180) || (L > 40 && H <= 180)) document.getElementById("Counter").style.color = "black";
        else document.getElementById("Counter").style.color = "White";
    } else document.getElementById("Counter").style.color = "White";
}

var SaturationMD = false;
document.body.onmouseup = function () {
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
}

var BrightnessMD = false;
BrightnessSelect.ontouchstart = function (e) {
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
}

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
    if (wordIteration == 0) {
        document.getElementById("Subject").innerHTML = wordsForHeading[wordIteration];
        wordIteration++;
    } else {
        document.getElementById("Subject").innerHTML = wordsForHeading[wordIteration];
        if (wordIteration == 1) {
            arrayOfColors.push(chosenColor);
            const JSONColors = JSON.stringify(arrayOfColors);
            localStorage.setItem("JSONColor", JSONColors);
        } else {
            let oldColors = localStorage.getItem("JSONColor");
            arrayOfColors = JSON.parse(oldColors);
            arrayOfColors.push(chosenColor);
            let JSONColors = JSON.stringify(arrayOfColors);
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
            // code for sending data to server can be added here
            Save(localStorage.getItem("JSONColor"));
        }
        wordIteration++;
    }
    Counter.innerHTML = wordIteration + "/" + wordsForHeading.length;
}

const Save = async (data) => {
    //let uri = 'http://localhost:3000/data';

    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    let saveData = {
        colors: data,
        id: 0
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
    S = Math.abs(100 - (y / CanvasHeight * 100));

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

    L = Math.abs(100 - (y / CanvasHeight * 100));
    root.style.setProperty('--BPickerY', pickerY + "px");

    SetBackground();
}