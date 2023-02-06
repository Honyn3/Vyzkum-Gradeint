let wordsForHeading;
let iteration = 0;
var colors;
window.addEventListener('DOMContentLoaded', () => {
    GetColors();
    GetWords();
})
const GetColors = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/colorsdata';
    const wait = await fetch(uri);
    const data = await wait.json();

    colors = JSON.parse(data[0].colors);
    loadColors();
    loadWords();
}

const GetWords = async () => {
    let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
    const wait = await fetch(uri);
    const data = await wait.json();
    wordsForHeading = data[0].data;
    WriteQuestions();
}
function loadColors() {
    //add for loop
    var ColorDiv = document.createElement("div");
    ColorDiv.className = "colorDiv";
    ColorDiv.style.backgroundColor = colors[iteration];
    document.getElementById("resultsDiv").innerHTML = "";
    document.getElementById("resultsDiv").appendChild(ColorDiv);
}
function loadWords() {
    document.getElementById("word").innerHTML = wordsForHeading[iteration];
}
function next() {
    if ((colors.length - 1) == iteration) {
        iteration = 0;
    } else {
        iteration++;
    }
    loadWords();
    loadColors();
}
function back() {
    if (0 == iteration) {
        iteration = (colors.length - 1);
    } else {
        iteration--;
    }
    loadWords();
    loadColors();
}
