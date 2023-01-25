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
let chosenColor = "hsl(180, 50%, 50%)";
let wordIteration = 0;
const wordsForHeading = ["studený","špatný","aktivní","líný","nebezpečný","mrtvý","živý","ženský","mužský","štěstí","smůla","horký","horký","zdravý","dobrý","budoucnost","minulost","sladký","hořký","věřící","nevěřící","moderní","tradiční","nemocný","městský","vesnický","mladý","starý"];
let arrayOfColors = [];
let H, S = 100, L = 50;

nextWord();

function Click(el) {
    console.log(el.clientX - 406);
    console.log(el.clientY - 319);
    console.log(CanvasHeight + " " + CanvasWidth);

    document.getElementById("BrightnessSelect").style.background = "";
}

document.body.onmousemove = function Click(e) {
    if (SaturationMD) {
        let x = e.clientX - CanvasLeft;
        let y = e.clientY - CanvasTop;

        H = x / CanvasWidth * 360;
        S = Math.abs(100 - (y / CanvasHeight * 100));

        root.style.setProperty('--H', H);
        root.style.setProperty('--S', S + "%");

        let pickerX = Number(e.clientX) - ColorPickerWidth;
        let pickerY = Number(e.clientY) - ColorPickerWidth;

        if (e.clientX <= (CanvasLeft - ColorPickerWidth / 2 + 3)) pickerX = CanvasLeft - ColorPickerWidth;
        if (e.clientX >= (CanvasLeft + CanvasWidth + ColorPickerWidth / 2 - 3)) pickerX = CanvasLeft + CanvasWidth - ColorPickerWidth;

        if (e.clientY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - ColorPickerWidth;
        if (e.clientY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasTop + CanvasHeight - ColorPickerWidth;


        root.style.setProperty('--PickerX', pickerX + "px");
        root.style.setProperty('--PickerY', pickerY + "px");

        SetBackground();
    }
    if (BrightnessMD) {
        let y = e.clientY - CanvasTop;
        let pickerY = Number(e.clientY) - ColorPickerWidth;

        if (e.clientY <= (CanvasTop - ColorPickerWidth / 2 + 4)) pickerY = CanvasTop - ColorPickerWidth;
        if (e.clientY >= (CanvasTop + CanvasHeight + ColorPickerWidth / 2 - 3)) pickerY = CanvasTop + CanvasHeight - ColorPickerWidth;


        L = Math.abs(100 - (y / CanvasHeight * 100));
        root.style.setProperty('--BPickerY', pickerY + "px");
        
        SetBackground();
    }
}

function SetBackground() {
    document.body.style.backgroundColor = "hsl(" + H + ", " + S + "% , " + L + "%)";
    chosenColor = "hsl(" + H + ", " + S + "% , " + L + "%)";
}

var SaturationMD = false;
document.body.onmouseup = function () {
    BrightnessMD = false;
    SaturationMD = false;
}

document.getElementById("Saturation").onmousedown = function () {
    SaturationMD = true;
    BrightnessMD = false;
}
document.getElementById("Saturation").onmouseup = function () {
    SaturationMD = false;
}

var BrightnessMD = false;
BrightnessSelect.onmousedown = function () {
    BrightnessMD = true;
    SaturationMD = false;
}

BrightnessSelect.onmouseup = function () {
    BrightnessMD = false;
}

function ResetBoundries() {
    CanvasWidth = Canvas.offsetWidth;
    CanvasHeight = Canvas.offsetHeight;
    CanvasLeft = Canvas.getBoundingClientRect().left;
    CanvasTop = Canvas.getBoundingClientRect().top;
}
function nextWord(){
        if(wordIteration==0){
            document.getElementById("Subject").innerHTML = wordsForHeading[wordIteration];
            wordIteration++;
        } else {
            document.getElementById("Subject").innerHTML = wordsForHeading[wordIteration];
            if(wordIteration==1){
                arrayOfColors.push(chosenColor);
                const JSONColors = JSON.stringify(arrayOfColors);
                localStorage.setItem("JSONColor", JSONColors);
            }else{
                let oldColors = localStorage.getItem("JSONColor");
                arrayOfColors = JSON.parse(oldColors);
                arrayOfColors.push(chosenColor);
                let JSONColors = JSON.stringify(arrayOfColors);
                localStorage.setItem("JSONColor", JSONColors);
            }
            document.body.style.backgroundColor = "hsl(" + 0 + ", " + 0 + "% , " + 100 + "%)";
            if(!(wordIteration<wordsForHeading.length)){
                document.body.style.backgroundColor = "hsl(" + 200 + ", " + 58 + "% , " + 39 + "%)";
                const node = document.createElement("p");
                const textnode = document.createTextNode("Děkujeme za vyplnění.");
                node.appendChild(textnode);
                node.id = "endingMessage";
                document.body.innerHTML = "";
                document.body.appendChild(node);
                // code for sending data to server can be added here
            }
            wordIteration++;
        }
            
    }