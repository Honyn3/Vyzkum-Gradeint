let Gradients;
let GradientsOt;
let Questions;
let QuestionsOther;
let ScaleIndex = 0;
let scalesPlace = document.getElementById("scalesPlace");
let GradientID = document.getElementById("GradientID");
let ScaleList = document.getElementById("scaleLi");
let SortingTable = document.getElementById("SortingTable");
let Page = document.getElementById("page");
let AllScalePage = document.getElementById("AllScales");
let ScalePickTable = document.getElementById("ScalePickTable");
let SortArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let ViewMod = 0;
let GraphWidth;
let filterEmptyTickbox = document.getElementById("filterEmptyTickbox");
let graphButtons = document.getElementsByClassName("GraphButton");
let StarZeros = [];
let PrimeZeros = [];

window.addEventListener('DOMContentLoaded', () => {
    GetGradients();
    GetQuestions();

    GetGradientsOther();
    GetQuestionsOther();
})
function ScaleDown() {
    Page.style.display = "none";
    AllScalePage.style.display = "inherit";
    if (ScalePickTable.childElementCount == 0)
        FillScalePickTable();
}


function ScaleUp() {
    Page.style.display = "inherit";
    AllScalePage.style.display = "none";
}



GraphButton(0);
function GraphButton(index) {
    graphButtons[index].style.backgroundColor = "#A4243B";

    if (index == 0) {
        graphButtons[1].style.backgroundColor = "#222E50";
        graphButtons[2].style.backgroundColor = "#222E50";
    }
    else if (index == 1) {
        graphButtons[0].style.backgroundColor = "#222E50";
        graphButtons[2].style.backgroundColor = "#222E50";
    }
    else {
        graphButtons[1].style.backgroundColor = "#222E50";
        graphButtons[0].style.backgroundColor = "#222E50";
    }
}

const GetGradientsOther = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    const wait = await fetch(uri);
    const data = await wait.json();

    GradientsOt = data;
}

function ProcessOtherGradient(data){
    let helpArray = [];
    for (let i = 0; i < data.length; i++) {
        let PushArray = [];
        let commas = 0;
        let colorIndex = -1;
        let colorString = data[i].colors;
        if (colorString[2] == "r") {
            for (let j = 1; j < colorString.length - 1; j++) {
                if (colorString[j] == "r") {
                    colorIndex++;
                    commas = 0;
                    PushArray[colorIndex] = "rgb(";
                }
                else if (colorString[j] != "g" && colorString[j] != "b" && colorString[j] != "(" && colorString[j] != '"' && colorString[j] != ',') PushArray[colorIndex] += colorString[j];
                if (colorString[j] == "," && commas < 2) { commas++; PushArray[colorIndex] += colorString[j]; }


            }
        } else {
            for (let j = 1; j < colorString.length - 1; j++) {
                if (colorString[j] == "h") {
                    colorIndex++;
                    commas = 0;
                    PushArray[colorIndex] = "hsl(";
                }
                else if (colorString[j] != "s" && colorString[j] != "l" && colorString[j] != "(" && colorString[j] != '"' && colorString[j] != ',') PushArray[colorIndex] += colorString[j];
                if (colorString[j] == "," && commas < 2) { commas++; PushArray[colorIndex] += colorString[j]; }
            }
        }
        helpArray.push(PushArray);
    }
    return helpArray;

}

const GetGradients = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/data';
    const wait = await fetch(uri);
    const data = await wait.json();

    Gradients = data;
    Sort(0, 0, 0);
    Sort(1, 1, 1);
    Sort(2, 2, 2);

}

const GetQuestions = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/source/0';
    const wait = await fetch(uri);
    const data = await wait.json();


    Questions = data.data;
    GradientID.innerHTML = "1/" + Questions.length;

    WriteQuestions();
}

const GetQuestionsOther = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();

    QuestionsOther = data[0].data;
}

function WriteQuestions() {
    ScaleList.innerHTML = "";
    if ((ViewMod == 0 || ViewMod == 2) && Questions) {
        let Current = Questions[ScaleIndex];
        for (let i = 0; i < Current.length; i++) {
            ScaleList.innerHTML += "<li style='text-align:center'>" + Current[i] + "</li>";
        }
    }
}

function WriteResults() {
    scalesPlace.innerHTML = "";
    let badResults = 0;

    if (ViewMod == 0) {
        for (let index = 0; index < Gradients.length; index++) {
            if (filterEmptyTickbox.checked && JSON.parse(Gradients[index].colors)[ScaleIndex][1] == "null" && JSON.parse(Gradients[index].colors)[ScaleIndex][2] == "#A1A1A1" && JSON.parse(Gradients[index].colors)[ScaleIndex][0] == "#A1A1A1") {
                badResults++;
            } else {

                let div;
                if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] != "null") {
                    div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][1] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px; border: solid 1px gray;" title="id: ' + Gradients[index].id + '; ' + Gradients[index].timestamp_s + ' sek, prováděl: ' + (Gradients[index].collector == undefined ? "sám" : Gradients[index].collector) + '"></div>';
                } else
                    div = '<div style="background: linear-gradient(to right, ' + JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ' + JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ' 100%); width: 100%; height: 30px; margin: 5px; border: solid 1px gray;" title="id: ' + Gradients[index].id + '; ' + Gradients[index].timestamp_s + ' sek; prováděl: ' + (Gradients[index].collector == undefined ? "sám" : Gradients[index].collector) + '"></div>';

                scalesPlace.innerHTML += div;

            }
        }

        scalesPlace.style.display = "inherit";
        WriteQuestions();
    }
    else if (ViewMod == 1) {
        let div0 = '<div style="background: conic-gradient(';
        let div1 = '<div style="background: conic-gradient(';
        let div2 = '<div style="background: conic-gradient(';

        for (let index = 0; index < Gradients.length; index++) {

            if (filterEmptyTickbox.checked && JSON.parse(Gradients[index].colors)[ScaleIndex][1] == "null" && JSON.parse(Gradients[index].colors)[ScaleIndex][2] == "#A1A1A1" && JSON.parse(Gradients[index].colors)[ScaleIndex][0] == "#A1A1A1") {
                badResults++;
                if (index == Gradients.length - 1) {
                    div0 = div0.slice(0, div0.length - 2)
                    div1 = div1.slice(0, div1.length - 2)
                    div2 = div2.slice(0, div2.length - 2)
                };
            }
            else {

                if (index == Gradients.length - 1) {
                    div0 += JSON.parse(Gradients[index].colors)[ScaleIndex][0];
                    if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] != "null") {
                        div1 += JSON.parse(Gradients[index].colors)[ScaleIndex][1];
                    } else div1 += "#A1A1A1";
                    div2 += JSON.parse(Gradients[index].colors)[ScaleIndex][2];

                } else {
                    div0 += JSON.parse(Gradients[index].colors)[ScaleIndex][0] + ', ';
                    if (JSON.parse(Gradients[index].colors)[ScaleIndex][1] != "null") {
                        div1 += JSON.parse(Gradients[index].colors)[ScaleIndex][1] + ', ';
                    } else div1 += "#A1A1A1, ";
                    div2 += JSON.parse(Gradients[index].colors)[ScaleIndex][2] + ', ';
                }
            }
        }

        GraphWidth = document.body.offsetWidth / 5;

        div0 += '); width: ' + GraphWidth + 'px; height: ' + GraphWidth + 'px; margin: 5px;"></div>';
        div1 += '); width: ' + GraphWidth + 'px; height: ' + GraphWidth + 'px; margin: 5px;"></div>';
        div2 += '); width: ' + GraphWidth + 'px; height: ' + GraphWidth + 'px; margin: 5px;"></div>';

        scalesPlace.innerHTML += '<div style="text-align: center"> ' + Questions[ScaleIndex][0] + ' ' + div0 + '</div>';
        scalesPlace.innerHTML += '<div style="text-align: center"> ' + (Questions[ScaleIndex][(Questions[ScaleIndex].length - 1) / 2] != undefined ? Questions[ScaleIndex][(Questions[ScaleIndex].length - 1) / 2] : "Neutrální") + ' ' + div1 + '</div>';
        scalesPlace.innerHTML += '<div style="text-align: center"> ' + Questions[ScaleIndex][Questions[ScaleIndex].length - 1] + ' ' + div2 + '</div>';

        scalesPlace.style.display = "inline-flex";
        WriteQuestions();
    } else {
        let div = "<table>";
        let div1 = [];
        let div2 = [];
        let div3 = [];


        let dic1 = GetDic(0);
        let dic2 = GetDic(1);
        let dic3 = GetDic(2);

        let used1 = [];
        let used2 = [];
        let used3 = [];


        for (let i = 0; i < Gradients.length; i++) {

            if (filterEmptyTickbox.checked && JSON.parse(Gradients[i].colors)[ScaleIndex][1] == "null" && JSON.parse(Gradients[i].colors)[ScaleIndex][2] == "#A1A1A1" && JSON.parse(Gradients[i].colors)[ScaleIndex][0] == "#A1A1A1") {
                badResults++;
            }
            else {
                let col1 = JSON.parse(Gradients[i].colors)[ScaleIndex][0];

                if (!used1.includes(col1)) {
                    div1.push('<td style=" background-color: ' + (col1 == null ? "transparent" : col1) + '; text-align:center;width: 33%;" title="' + col1 + '" onclick="CopyColor(this)">' + dic1[col1].length)
                    used1.push(col1);
                } else {
                    // div1.push('<td style=" background-color: white;">')

                }

                let col2 = JSON.parse(Gradients[i].colors)[ScaleIndex][1];

                if (!used2.includes(col2)) {
                    div2.push('<td style=" background-color: ' + (col2 == null ? "transparent" : col2) + '; text-align:center;width: 33%;" title="' + col2 + '" onclick="CopyColor(this)">' + dic2[col2].length)
                    used2.push(col2);
                } else {
                    // div2.push('<td style=" background-color: white;">')

                }

                let col3 = JSON.parse(Gradients[i].colors)[ScaleIndex][2];

                if (!used3.includes(col3)) {
                    div3.push('<td style=" background-color: ' + (col3 == null ? "transparent" : col3) + '; text-align:center;width: 33%;" title="' + col3 + '" onclick="CopyColor(this)">' + dic3[col3].length)
                    used3.push(col3);
                } else {
                    // div3.push('<td style=" background-color: white;">')

                }
            }

        }

        for (let i = 0; i < Math.max(div1.length, div2.length, div3.length); i++) {
            div += "<tr>"
            if (div1[i] != undefined)
                div += div1[i];
            else div += '<td style=" background-color: white;">';
            if (div2[i] != undefined)
                div += div2[i];
            else div += '<td style=" background-color: white;">';
            if (div3[i] != undefined)
                div += div3[i];
            else div += '<td style=" background-color: white;">';
            div += "</tr>"
        }
        div += "</table>";

        scalesPlace.innerHTML = div;
        scalesPlace.style.display = "inherit";
        WriteQuestions();
    }

    document.getElementById("count").innerHTML = "Celkem " + Gradients.length + " výsledků, z toho " + badResults + " neplatných, ukazuje se " + (Gradients.length - badResults);
}

function CopyColor(element) {
    let toCopy = element.style.backgroundColor;
    // navigator.clipboard.writeText(toCopy);
}

function GetDic(position) {
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        Colors[i] = JSON.parse(Gradients[i].colors)[ScaleIndex][position];
    }

    let dic = {
    };

    for (let i = 0; i < Colors.length; i++) {

        // let name = String(i);
        // if(dic[name] != null){
        //     let values = dic[name];
        //     values++;
        //     dic[name] = values;
        // }else{
        //     dic[name] = 1;
        // }

        let element = String(Colors[i]);
        if (dic[element] != null) {
            let values = dic[element];
            values.push(i);
            dic[element] = values;
        }
        else dic[element] = [i];
    }
    return dic;
}

function ClearGradients() {
    scalesPlace.innerHTML = "";
}

function GradientIDChange() {
    GradientID.innerHTML = ScaleIndex + 1 + '/' + Questions.length;
}

function Previous() {
    if (ScaleIndex - 1 == -1) {
        ScaleIndex = Questions.length - 1;
    } else ScaleIndex--;

    SortButton(3, 1);

    GradientIDChange();
    ClearGradients();
    WriteResults();
    WriteQuestions();
}

function Next() {
    if (ScaleIndex + 1 == Questions.length) ScaleIndex = 0;
    else ScaleIndex++;

    SortButton(3, 1);
    GradientIDChange();
    ClearGradients();
    WriteResults();
    WriteQuestions();
}

function SortTableClicked() {
    if (SortingTable.style.left == "30px") SortingTable.style.left = "-250px";
    else SortingTable.style.left = "30px";
}

function SortTableHide() {
    SortingTable.style.left = "-195px";
}

function SortTableShow() {
    SortingTable.style.left = "30px";
    GraphWidth = document.body.offsetWidth / 5;

}

function SortButton(color, position) {
    for (let i = 0; i < SortArray.length; i++) {
        document.getElementById("btn" + i).style.backgroundImage = "none";
    }
    let id = "btn" + (Number(color) * 3 + Number(position));
    let idNum = (Number(color) * 3 + Number(position));
    let btn = document.getElementById(id);

    if (SortArray[idNum] == 0 || SortArray[idNum] == 2) {
        btn.style.backgroundImage = "url(/img/arrowDown.png)";
        SortArray[idNum] = 1;
    }
    else {
        btn.style.backgroundImage = "url(/img/arrowUp.png)";
        SortArray[idNum] = 2;
    }

    for (let i = 0; i < SortArray.length; i++) {
        if (idNum != i) SortArray[i] = 0;
    }

    if (color == 3) {
        SortHue(position, idNum);
    } else {
        // Sort(Math.abs(color - 2), position, idNum);
        // Sort(Math.abs(color - 1), position, idNum);
        Sort(0, position, idNum);
        Sort(1, position, idNum);
        Sort(2, position, idNum);

        Sort(color, position, idNum);
    }


}

function SortHue(position, idNum) {
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if (colorFromGradient[0] == "#") {
            Colors[i] = rgb2hsv(hexToRgb(colorFromGradient))[0];
        }
        else if (colorFromGradient[0] == "r") {
            let hsl = rgb2hsv(RGBToRgb(colorFromGradient));
            //Colors[i] = (hsl[2] == 0 ? -1 : (hsl[2] == 100 ? -2 : hsl[0]));
            Colors[i] = hsl[0] + hsl[1] / 10 + hsl[2] / 10;
        }
        else {
            Colors[i] = "1";
        }
    }


    // Presort(color, position);

    let cont = true;
    if (SortArray[idNum] == 1) {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length - 1; SortIndex++) {
                if (Colors[SortIndex] < Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex + 1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    } else {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length - 1; SortIndex++) {
                if (Colors[SortIndex] > Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex + 1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    }


    WriteResults();
}

function SortHueWithSpecifiedScale(scale, position, idNum) {
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[scale][position];

        if (colorFromGradient[0] == "#") {
            Colors[i] = rgb2hsv(hexToRgb(colorFromGradient))[0];
        }
        else if (colorFromGradient[0] == "r") {
            let hsl = rgb2hsv(RGBToRgb(colorFromGradient));
            //Colors[i] = (hsl[2] == 0 ? -1 : (hsl[2] == 100 ? -2 : hsl[0]));
            Colors[i] = hsl[0] + hsl[1] / 10 + hsl[2] / 10;
        }
        else {
            Colors[i] = "1";
        }
    }


    // Presort(color, position);

    let cont = true;
    if (SortArray[idNum] == 1) {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length - 1; SortIndex++) {
                if (Colors[SortIndex] < Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex + 1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    } else {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < Gradients.length - 1; SortIndex++) {
                if (Colors[SortIndex] > Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = Gradients[SortIndex];
                    Gradients[SortIndex] = Gradients[SortIndex + 1];
                    Gradients[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    }


    WriteResults();
}

function SortHueWithSpecifiedScaleOther(scale, idNum) {
    let Colors = [];
    for (let i = 0; i < GradientsOther.length; i++) {
        let colorFromGradient = GradientsOther[i][scale];
        if (colorFromGradient[0] == "#") {
            Colors[i] = rgb2hsv(hexToRgb(colorFromGradient))[0];
        }
        else if (colorFromGradient[0] == "r") {
            let hsl = rgb2hsv(RGBToRgb(colorFromGradient));
            //Colors[i] = (hsl[2] == 0 ? -1 : (hsl[2] == 100 ? -2 : hsl[0]));
            Colors[i] = hsl[0] + hsl[1] / 10 + hsl[2] / 10;
        } else if (colorFromGradient[0] == "h") {
            Colors[i] = Number(colorFromGradient[4]);
            if (colorFromGradient[5] != '.') {
                Colors[i] *= 10;
                Colors[i] += Number(colorFromGradient[5]);
                if (colorFromGradient[6] != '.') {
                    Colors[i] *= 10;
                    Colors[i] += Number(colorFromGradient[6]);
                }
            }
        }
        else {
            Colors[i] = "1";
        }
    }

    let cont = true;
    if (SortArray[idNum] == 1) {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < GradientsOther.length - 1; SortIndex++) {
                if (Colors[SortIndex] < Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = GradientsOther[SortIndex];
                    GradientsOther[SortIndex] = GradientsOther[SortIndex + 1];
                    GradientsOther[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    } else {
        while (cont) {
            cont = false;
            for (let SortIndex = 0; SortIndex < GradientsOther.length - 1; SortIndex++) {
                if (Colors[SortIndex] > Colors[SortIndex + 1]) {
                    let help = Colors[SortIndex];
                    Colors[SortIndex] = Colors[SortIndex + 1];
                    Colors[SortIndex + 1] = help;

                    help = GradientsOther[SortIndex];
                    GradientsOther[SortIndex] = GradientsOther[SortIndex + 1];
                    GradientsOther[SortIndex + 1] = help;
                    cont = true;
                }
            }
        }
    }
}

function SortElement(element, color, position) {
    if (element.length == 1) return element;

    let cont = true;
    if (color == 1) col = 2;
    else if (color == 2) col = 0;
    else col = 1;

    let Colors = [];
    for (let i = 0; i < element.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if (colorFromGradient == "null" || colorFromGradient == null) Colors[i] = 0;
        else if (colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[col];
        else Colors[i] = RGBToRgb(colorFromGradient)[col];

    }

    while (cont) {
        cont = false;
        for (let i = 0; i < element.length - 1; i++) {
            if (Colors[i] < Colors[i + 1]) {
                let help = Colors[i + 1];
                Colors[i + 1] = Colors[i];
                Colors[i] = help;

                help = element[i];
                element[i] = element[i + 1];
                element[i + 1] = help;
                cont = true;
            }

        }
    }

    if (col == 1) col = 2;
    else if (col == 2) col = 0;
    else col = 1;

    Colors = [];
    for (let i = 0; i < element.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if (colorFromGradient == "null" || colorFromGradient == null) Colors[i] = 0;
        else if (colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[col];
        else Colors[i] = RGBToRgb(colorFromGradient)[col];
    }

    cont = true;
    while (cont) {
        cont = false;
        for (let i = 0; i < element.length - 1; i++) {
            if (Colors[i] < Colors[i + 1]) {
                let help = Colors[i + 1];
                Colors[i + 1] = Colors[i];
                Colors[i] = help;

                help = element[i];
                element[i] = element[i + 1];
                element[i + 1] = help;
                cont = true;
            }

        }
    }
    return element;
}

function Sort(color, position, idNum) {
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if (colorFromGradient == "null" || colorFromGradient == null) Colors[i] = 0;
        else if (colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[color];
        else Colors[i] = RGBToRgb(colorFromGradient)[color];
    }

    let dic = {
    };

    for (let i = 0; i < Colors.length; i++) {

        let element = String(Colors[i]);
        if (dic[element] != null) {
            let values = dic[element];
            values.push(i);
            dic[element] = values;
        }
        else dic[element] = [i];
    }

    let NewGradients = [];
    let NewGradientsIndex = 0;

    for (let i = 0; i < 257; i++) {
        let num = String(i);

        let element = (dic[num]);
        if (element != undefined) {
            let sortedElement = SortElement(element, color, position);

            for (let j = 0; j < element.length; j++) {

                NewGradients[NewGradientsIndex] = Gradients[sortedElement[j]];
                NewGradientsIndex++;
            }
        }
    }

    if (SortArray[idNum] == 2) {
        for (let i = 0; i < NewGradients.length; i++) {
            Gradients[i] = NewGradients[i];
        }
    } else {
        for (let i = 0; i < NewGradients.length; i++) {
            Gradients[i] = NewGradients[NewGradients.length - i - 1];
        }
    }


    // let cont = true;
    // if (SortArray[idNum] == 1) {
    //     while (cont) {
    //         cont = false;
    //         for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
    //             if (Colors[SortIndex] < Colors[SortIndex + 1]) {
    //                 let help = Colors[SortIndex];
    //                 Colors[SortIndex] = Colors[SortIndex + 1];
    //                 Colors[SortIndex + 1] = help;

    //                 help = Gradients[SortIndex];
    //                 Gradients[SortIndex] = Gradients[SortIndex + 1];
    //                 Gradients[SortIndex + 1] = help;
    //                 cont = true;
    //             }
    //         }
    //     }
    // } else {
    //     while (cont) {
    //         cont = false;
    //         for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
    //             if (Colors[SortIndex] > Colors[SortIndex + 1]) {
    //                 let help = Colors[SortIndex];
    //                 Colors[SortIndex] = Colors[SortIndex + 1];
    //                 Colors[SortIndex + 1] = help;

    //                 help = Gradients[SortIndex];
    //                 Gradients[SortIndex] = Gradients[SortIndex + 1];
    //                 Gradients[SortIndex + 1] = help;
    //                 cont = true;
    //             }
    //         }
    //     }
    // }

    WriteResults();
}

function Presort(color, position) {

    color = Math.abs(color - 1);
    position = Math.abs(position - 1);
    let Colors = [];
    for (let i = 0; i < Gradients.length; i++) {
        let colorFromGradient = JSON.parse(Gradients[i].colors)[ScaleIndex][position];

        if (colorFromGradient[0] == "#") Colors[i] = hexToRgb(colorFromGradient)[color];
        else Colors[i] = RGBToRgb(colorFromGradient)[color];
    }
    let cont = true;

    while (cont) {
        cont = false;
        for (let SortIndex = 0; SortIndex < Gradients.length; SortIndex++) {
            if (Colors[SortIndex] < Colors[SortIndex + 1]) {
                let help = Colors[SortIndex];
                Colors[SortIndex] = Colors[SortIndex + 1];
                Colors[SortIndex + 1] = help;

                help = Gradients[SortIndex];
                Gradients[SortIndex] = Gradients[SortIndex + 1];
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
    if (color == "null") return [0, 0, 0];
    let col = ["", "", ""];
    let colorIndex = 0;
    for (let i = 3; i < color.length; i++) {
        if (color[i] == ',') colorIndex++;
        else if (color[i] != ' ' && color[i] != ')' && color[i] != '(' && color[i] != 'b') { col[colorIndex] += color[i]; }
    }

    col[0] = Number(col[0]);
    col[1] = Number(col[1]);
    col[2] = Number(col[2]);
    if (col[0] == "") col[0] = 0;
    return col;
}

function rgb2hsv(col) {
    r = col[0];
    g = col[1];
    b = col[2];

    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};

function GraphChange() {
    ViewMod = 1;
    WriteResults();
}

function ScaleChange() {
    ViewMod = 0;
    WriteResults();
}

function PercentChange() {
    ViewMod = 2;
    WriteResults();
}