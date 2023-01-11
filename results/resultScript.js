let Gradients;
let Questions;
let numOfGradients;
let ScaleIndex = 0;
let scalesPlace = document.getElementById("scalesPlace");
let GradientID = document.getElementById("GradientID");
let ScaleList = document.getElementById("scaleLi");
let SortingTable = document.getElementById("SortingTable");
let SortArray = [0,0,0,0,0,0,0,0,0];

window.addEventListener('DOMContentLoaded', () => {
    GetGradients();
    GetQuestions();
})

const GetGradients = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/data';
    const wait = await fetch(uri);
    const data = await wait.json();

    Gradients = data;

    numOfGradients = JSON.parse(Gradients[0].colors).length;
    GradientID.innerHTML = "1/" + numOfGradients;
    Sort(0, 0, 0);
    Sort(1, 1, 1);
    Sort(2, 2, 2);

}

const GetQuestions = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/source';
    const wait = await fetch(uri);
    const data = await wait.json();

    Questions = JSON.parse(data);
    WriteQuestions();
}

function WriteQuestions() {
    ScaleList.innerHTML = "";
    let Current = Questions[ScaleIndex];
    for (let i = 0; i < Current.length; i++) {
        ScaleList.innerHTML += "<li style='text-align:center;width:" + 100 / Questions.length + "%'>" + Current[i] + "</li>";
    }
}

function WriteResults() {
    scalesPlace.innerHTML = "";
    let badResults = 0;
    for (let index = 0; index < Gradients.length; index++) {
        console.log("barvy: " + JSON.parse(Gradients[index].colors)[ScaleIndex][1] + ", " + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ", " + JSON.parse(Gradients[index].colors)[ScaleIndex][2])
        if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] == "null" && JSON.parse(Gradients[index].colors)[ScaleIndex][2] == "#A1A1A1" && JSON.parse(Gradients[index].colors)[ScaleIndex][0] == "#A1A1A1") {
            badResults++;
        } else {
            let div;
            if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] != "null"){
                div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][1] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px;"></div>';
            }else
            div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px;"></div>';

            scalesPlace.innerHTML += div;
        }
    }
    document.getElementById("count").innerHTML = "Celkem " + Gradients.length + " výsledků, z toho " + badResults + " neplatných, ukazuje se " + (Gradients.length - badResults);

}

function ClearGradients() {
    scalesPlace.innerHTML = "";
}

function GradientIDChange() {
    GradientID.innerHTML = ScaleIndex + 1 + '/' + numOfGradients;
}

function Previous() {
    if (ScaleIndex - 1 == -1) {
        ScaleIndex = numOfGradients - 1;
    } else ScaleIndex--;

    GradientIDChange();
    ClearGradients();
    WriteResults();
    WriteQuestions();
}

function Next() {
    if (ScaleIndex + 1 == numOfGradients) ScaleIndex = 0;
    else ScaleIndex++;

    GradientIDChange();
    ClearGradients();
    WriteResults();
    WriteQuestions();
}

function SortTableClicked() {
    if (SortingTable.style.left == "0px") SortingTable.style.left = "-200px";
    else SortingTable.style.left = "0px";
}

function SortTableHide() {
    SortingTable.style.left = "-200px";
}

function SortButton(color, position) {
    for (let i = 0; i < 9; i++) {
        document.getElementById("btn" + i).style.backgroundImage = "none";
    }
    let id = "btn" + (Number(color) * 3 + Number(position));
    let idNum = (Number(color) * 3 + Number(position));
    let btn = document.getElementById(id);

    if(SortArray[idNum] == 0 || SortArray[idNum] == 2){
        btn.style.backgroundImage = "url(/img/arrowDown.png)";
        SortArray[idNum] = 1;
    }
    else {
        btn.style.backgroundImage = "url(/img/arrowUp.png)";
    SortArray[idNum] = 2;
    }

    for (let i = 0; i < 9; i++) {
        if(idNum != i) SortArray[i] = 0;
    }
    
    Sort(color, position, idNum);
}

function Sort(color, position, idNum){
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if(colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[color];
        else Colors[i] = RGBToRgb(colorFromGradient)[color];
    }

    // Presort(color, position);

    let cont = true;
    if(SortArray[idNum] == 1){
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
                if(Colors[SortIndex] < Colors[SortIndex+1]){
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex +1];
                    Colors[SortIndex +1] = help;
        
                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex+1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    }else{
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
                if(Colors[SortIndex] > Colors[SortIndex+1]){
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex +1];
                    Colors[SortIndex +1] = help;
        
                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex+1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    }
    
    WriteResults();
}

function Presort(color, position){

    color = Math.abs(color-1);
    position = Math.abs(position -1);
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if(colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[color];
        else Colors[i] = RGBToRgb(colorFromGradient)[color];
    }
    let cont = true;

    while (cont) {
        cont = false;
        for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
            if(Colors[SortIndex] < Colors[SortIndex+1]){
                let help = Colors[SortIndex];
                Colors[SortIndex] = Colors[SortIndex +1];
                Colors[SortIndex +1] = help;
    
                help = Gradients[SortIndex];
                Gradients[SortIndex] = Gradients[SortIndex+1];
                Gradients[SortIndex + 1] = help;
                cont = true;
            }
        }
    }
}

function hexToRgb(hex) {
    var r = Number(ConvertHexToNum(hex[1])) * 16 + Number(ConvertHexToNum(hex[2]));
    var g = Number(ConvertHexToNum(hex[3])) * 16 + Number(ConvertHexToNum(hex[4]));
    var b = Number(ConvertHexToNum(hex[5])) * 16 + Number(ConvertHexToNum(hex[6]));
    color = [r, g, b];
    return color;
}
function ConvertHexToNum(hex) {
    if (hex == 'A') return 10;
    if (hex == 'B') return 11;
    if (hex == 'C') return 12;
    if (hex == 'D') return 13;
    if (hex == 'E') return 14;
    if (hex == 'F') return 15;
    return hex;
}
function RGBToRgb(color) {
    let col = ["", "", ""];
    let colorIndex = 0;
    for (let i = 3; i < color.length; i++) {
        if (color[i] == ',') colorIndex++;
        else if (color[i] != ' ' && color[i] != ')' && color[i] != '(') { col[colorIndex] += color[i]; }
    }

    col[0] = Number(col[0]);
    col[1] = Number(col[1]);
    col[2] = Number(col[2]);
    return col;
}