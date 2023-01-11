let Gradients;
let Questions;
let numOfGradients;
let ScaleIndex = 0;
let scalesPlace = document.getElementById("scalesPlace");
let GradientID = document.getElementById("GradientID");
let ScaleList = document.getElementById("scaleLi");
let SortingTable = document.getElementById("SortingTable");

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
    WriteResults();
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
    for (let index = 0; index < Gradients.length; index++) {
        console.log(JSON.parse(Gradients[index].colors)[ScaleIndex][0]);
        if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] == "null" && JSON.parse(Gradients[index].colors)[ScaleIndex][2] == "#A1A1A1" && JSON.parse(Gradients[index].colors)[ScaleIndex][0] == "#A1A1A1") {

        } else {
            let div;
            if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] != null)
                div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][1] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px;"></div>';
            div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px;"></div>';

            scalesPlace.innerHTML += div;
        }
    }
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
    console.log(id);
    let btn = document.getElementById(id);

    btn.style.backgroundImage = "url(/img/arrowDown.png)";
}