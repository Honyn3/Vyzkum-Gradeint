let colorPicker = document.getElementById("colorDiv");
let slider = document.getElementById("slider");
let rightButton = document.getElementById("colorButtonRight");
let leftButton = document.getElementById("colorButtonLeft");
let gradient = document.getElementById("gradient");
let middleButton = document.getElementById("colorButtonMiddle");
let stranka = document.getElementById("stranka");
let page = document.getElementById("stranka");
let bodyContent = document.getElementById("bodyContent");
var store = document.querySelector(':root')
let scaleList = document.getElementById("scaleLi");
let login = document.getElementById("login");

let username = "sám";
let btnIndex = 0;
let colorWidthHalf = 105;
let tutorialBool = false;

let LeftColor = "#A1A1A1";
let RightColor = "#A1A1A1";
let MiddleColor = "null";
let checked;
let backgroundClick = false;
let timestamp = 0;
let RandomOrderArray = [];
let RandomCount = 0;

//#region login

document.addEventListener('keypress', (event) => {
    if (event.key == "1") ShowLogin();
})

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

//#endregion

//#region Setup


function GenerateRandomValues(){
    while(RandomOrderArray.length < Questions.length){
        let ranNum = Math.floor(Math.random() * Questions.length);
        if(!RandomOrderArray.includes(ranNum)) RandomOrderArray.push(ranNum);
    }
    console.log(RandomOrderArray);
}

if (false) { // pokud chci aby vyplnili jen 1x pak dát localStorage.getItem("pouzil") místo false
    document.getElementById("buttonstart").style.display = "none";
    document.getElementById("konec").style.display = "block";
    document.getElementById("konec").innerHTML = "Průzkum jste již vyplnil(a), moc děkujeme.";
}

const GetQuestions = async () => {
    //let uri = 'http://localhost:3000/source';
    let uri = 'http://klara.fit.vutbr.cz:3000/source/0';
    const wait = await fetch(uri);
    const data = await wait.json();

    Questions = data.data;
    numOfQuestions = Questions.length;

    if (!localStorage.getItem("odpovedi") || localStorage.getItem("odpovedi") == null || localStorage.getItem("odpovedi") == "[]" || localStorage.getItem("odpovedi").length != Questions.length) {
        for (let i = 0; i < numOfQuestions; i++) { // vytvori JSON se samými šedými barvami
            odpovedi[i] = barvy;
        }
        localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
    }
GenerateRandomValues();

}

function ResetGradient() {
    gradient.style.background = "linear-gradient(to right, #A1A1A1, #A1A1A1 100%)";
    leftButton.style.backgroundColor = "#A1A1A1";
    middleButton.style.backgroundColor = "#00000000";
    rightButton.style.backgroundColor = "#A1A1A1";
}

function TimeIncrement() {
    timestamp += 500;
}

//#endregion

//#region colorChange

function hideColor() {
    ChangeActive();
}
function ColorDivPress() {
    backgroundClick = true;
}
function LeftButtonPressed() {
    // colorPicker.style.marginLeft = leftButton.getBoundingClientRect().x - colorWidthHalf + "px";
    colorPicker.style.marginLeft = (leftButton.getBoundingClientRect().x - colorWidthHalf - stranka.offsetLeft) + "px";
    btnIndex = 0;
    colorPicker.style.display = "inherit";
    backgroundClick = true;
    ChangeActive();
    document.getElementById("button0").innerHTML = "Výchozí barva";
}
function MiddleButtonPressed() {
    colorPicker.style.marginLeft = (middleButton.getBoundingClientRect().x - colorWidthHalf - stranka.offsetLeft) + "px";
    // middleButton.style.backgroundColor = odpovedi[numOfPages - 1][1];
    btnIndex = 1;
    colorPicker.style.display = "inherit";
    backgroundClick = true;

    ChangeActive();
    document.getElementById("button0").innerHTML = "Žádná barva";
}
function RightButtonPressed() {
    colorPicker.style.marginLeft = (rightButton.getBoundingClientRect().x - colorWidthHalf - stranka.offsetLeft) + "px";

    btnIndex = 2;
    colorPicker.style.display = "inherit";
    backgroundClick = true;

    ChangeActive();
    document.getElementById("button0").innerHTML = "Výchozí barva";
}
function backgroundClicked() {
    if (!backgroundClick) {
        colorPicker.style.display = "none";
        btnIndex = -1;
        ChangeActive();
    }

    backgroundClick = false;
}
function backgroundClickedtutorial() {
    colorPicker.style.display = "none";
    btnIndex = -1;
    ChangeActive();
    backgroundClick = false;
}
function MoveToButtonIndex() {
    if (tutorialBool) return;
    if (btnIndex == 0)
        LeftButtonPressed();
    else if (btnIndex == 1)
        MiddleButtonPressed();
    else if (btnIndex == 2)
        RightButtonPressed();
}
function ChangeActive() {
    switch (btnIndex) {
        case 0:
            leftButton.style.borderWidth = '4px';
            rightButton.style.borderWidth = '2px';
            middleButton.style.borderWidth = '2px';

            leftButton.style.borderRadius = '10px';
            rightButton.style.borderRadius = '1000px';
            middleButton.style.borderRadius = '1000px';

            break;
        case 1:
            leftButton.style.borderWidth = '2px';
            rightButton.style.borderWidth = '2px';
            middleButton.style.borderWidth = '4px';

            leftButton.style.borderRadius = '1000px';
            rightButton.style.borderRadius = '1000px';
            middleButton.style.borderRadius = '10px';
            break;
        case 2:
            leftButton.style.borderWidth = '2px';
            rightButton.style.borderWidth = '4px';
            middleButton.style.borderWidth = '2px';

            leftButton.style.borderRadius = '1000px';
            rightButton.style.borderRadius = '10px';
            middleButton.style.borderRadius = '1000px';
            break;
        case -1:
            leftButton.style.borderWidth = '2px';
            rightButton.style.borderWidth = '2px';
            middleButton.style.borderWidth = '2px';

            leftButton.style.borderRadius = '1000px';
            rightButton.style.borderRadius = '1000px';
            middleButton.style.borderRadius = '1000px';
            break;
    }
}
function Barvy(button) {
    console.log("0: " + LeftColor + " " + MiddleColor + " " + RightColor);

    let barva = window.getComputedStyle(button).backgroundColor;
    backgroundClick = true;
    setTransitionDelay1();
    bodyContent.style.backgroundColor = barva.replace(')', ', 0.1)');

    switch (btnIndex) {
        case 0:
            LeftColor = barva;
            leftButton.style.backgroundColor = barva;
            break;
        case 1:
            if (button.innerHTML == "Žádná barva") {
                MiddleColor = "null";
                middleButton.style.backgroundColor = "#00000000";
                backgroundClick = true;

                MoveGradient();
            }
            else {
                MiddleColor = barva;
                middleButton.style.backgroundColor = barva;

                checked = true;
            }

            break;
        case 2:
            RightColor = barva;
            rightButton.style.backgroundColor = barva;
            break;

    }
    console.log(LeftColor + " " + MiddleColor + " " + RightColor);
    AdjustColorToBackground();

    MoveGradient();
    delay(50).then(() => setTransitionDelay2());
    delay(800).then(() => bodyContent.style.backgroundColor = "rgba(0,0,0,0.0)");
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function setTransitionDelay1() {
    store.style.setProperty('--transition-delay', '50ms');
}
function setTransitionDelay2() {
    store.style.setProperty('--transition-delay', '1600ms');
}
function MoveGradient() {
    if (MiddleColor != "null") {
        let col = "linear-gradient(to right, " + LeftColor + " , " + MiddleColor + " , " + RightColor + " )";
        gradient.style.background = col;
    }
    else {
        let col = "linear-gradient(to right, " + LeftColor + ", " + RightColor + " 100%)";
        gradient.style.background = col;
    }
}
function GradientAdjust(x) {
    y = 0.8 * (x - 50) + 50;
    return y;
}

//#endregion

let numOfPages = 1;
let Questions;
let numOfQuestions;
let odpovedi = [];
let barvy = ["#A1A1A1", "null", "#A1A1A1"]; // zapisuje pouze 3 barvy
window.addEventListener('DOMContentLoaded', () => GetQuestions())



function start() {
    tutorialBool = false;
    odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
    if (odpovedi.length == Questions.length) {
        if (odpovedi[RandomOrderArray[numOfPages-1]][1] == "null") {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[RandomOrderArray[numOfPages-1]][0] + ", " + odpovedi[RandomOrderArray[numOfPages-1]][2] + " 100%)";
            checked = false;
        }
        else {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[RandomOrderArray[numOfPages-1]][0] + "," + odpovedi[RandomOrderArray[numOfPages-1]][1] + "," + odpovedi[RandomOrderArray[numOfPages-1]][2] + " 100%)";
            checked = true;
        }
        LeftColor = odpovedi[RandomOrderArray[numOfPages-1]][0];
        MiddleColor = odpovedi[RandomOrderArray[numOfPages-1]][1];
        RightColor = odpovedi[RandomOrderArray[numOfPages-1]][2];
        leftButton.style.backgroundColor = odpovedi[RandomOrderArray[numOfPages-1]][0];
        if (odpovedi[RandomOrderArray[numOfPages-1]][1] != "null") {
            middleButton.style.background = odpovedi[RandomOrderArray[numOfPages-1]][1];
        } else {
            middleButton.style.background = "#A1A1A100";
        }
        rightButton.style.backgroundColor = odpovedi[RandomOrderArray[numOfPages-1]][2];
    }
    document.getElementById("buttonstart").style.display = "none";
    document.getElementById("stranka").style.display = "block";

    document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
    for (let i = 0; i < Questions[RandomOrderArray[numOfPages-1]].length; i++) {
        document.getElementById("scaleLi").innerHTML += "<li style='text-align:center; width:" + 100 / Questions[RandomOrderArray[numOfPages-1]].length + "%"+(Questions[RandomOrderArray[numOfPages-1]][i].length > 15 ? "; font-size:14px;" : "")+"'>" + Questions[RandomOrderArray[numOfPages-1]][i] + "</li>";
    }
console.log(Questions[RandomOrderArray[numOfPages-1]]);

    document.getElementById("cislostranky").innerHTML = numOfPages + "/" + numOfQuestions;
    AdjustColorToBackground();
    let timeInc = 500;
    setInterval(TimeIncrement, timeInc);
}



function dalsi() {
    if (tutorialBool) {
        ForceEndOfAnim();
        document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';
        tutorialBool = false;
        document.getElementById("dalsi").style.marginTop = '';

    } else {
        odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
        if (odpovedi.length == Questions.length) {
            odpovedi[RandomOrderArray[numOfPages-1]][0] = LeftColor;
            odpovedi[RandomOrderArray[numOfPages-1]][1] = MiddleColor;
            odpovedi[RandomOrderArray[numOfPages-1]][2] = RightColor;
            localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
        }

        if (numOfQuestions == numOfPages)// zápis do online databáze v případě, že jsme na poslední stránce
        {
            document.getElementById("stranka").style.display = "none";
            document.getElementById("konec").style.display = "block";
            Save(localStorage.getItem("odpovedi"), timestamp, username); //uloží data do db
            localStorage.setItem("pouzil", "ano");
        } else {
            if (numOfQuestions != numOfPages) {
                LeftColor = odpovedi[RandomOrderArray[numOfPages]][0];
                MiddleColor = odpovedi[RandomOrderArray[numOfPages]][1];
                RightColor = odpovedi[RandomOrderArray[numOfPages]][2];
                if (odpovedi[RandomOrderArray[numOfPages]][1] == "null") {
                    gradient.style.background = "linear-gradient(to right, " + odpovedi[RandomOrderArray[numOfPages]][0] + ", " + odpovedi[RandomOrderArray[numOfPages]][2] + " 100%)";
                    checked = false;
                }
                else {
                    gradient.style.background = "linear-gradient(to right, " + odpovedi[RandomOrderArray[numOfPages]][0] + "," + odpovedi[RandomOrderArray[numOfPages]][1] + "," + odpovedi[RandomOrderArray[numOfPages]][2] + " 100%)";
                    checked = true;
                }
                leftButton.style.backgroundColor = odpovedi[RandomOrderArray[numOfPages]][0];
                if (odpovedi[RandomOrderArray[numOfPages]][1] == "null") {
                    middleButton.style.backgroundColor = "#00000000";

                } else
                    middleButton.style.backgroundColor = odpovedi[RandomOrderArray[numOfPages]][1];
                rightButton.style.backgroundColor = odpovedi[RandomOrderArray[numOfPages]][2];
            } else ResetGradient();
            document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
            for (let i = 0; i < Questions[RandomOrderArray[numOfPages]].length; i++) {
                document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;"+(Questions[RandomOrderArray[numOfPages]][i].length > 15 ? "font-size:14px;" : "")+"width:" + 100 / Questions[RandomOrderArray[numOfPages]].length + "%'>" + Questions[RandomOrderArray[numOfPages]][i] + "</li>";

                // if(Questions[numOfPages-1][i].length < 7)
                // document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / Questions[numOfPages].length + "%'>" + Questions[numOfPages][i] + "</li>";
                // else{
                //     document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / Questions[numOfPages - 1].length + "%;font-size:16px'>" + Questions[numOfPages - 1][i] + "</li>";
                //     }
                //Zmenseni pisma, pokud slovo obsahuje vic jak 7 pismen
            }

            numOfPages = numOfPages + 1;
            document.getElementById("cislostranky").innerHTML = numOfPages + "/" + numOfQuestions;
            if (numOfQuestions == numOfPages) {

                document.getElementById("dalsi").innerHTML = "Ukončit dotazník";
                document.getElementById("dalsi").style.width = "250px";
            } else {
                document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';
                document.getElementById("dalsi").style.width = "130px";

            }

            AdjustColorToBackground();


        }
    }
}
function zpatky() {
    if ((numOfPages - 2) >= 0) {
        odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
        odpovedi[numOfPages - 1][0] = LeftColor;
        odpovedi[numOfPages - 1][1] = MiddleColor;
        odpovedi[numOfPages - 1][2] = RightColor;
        localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
        numOfPages = numOfPages - 1;
        LeftColor = odpovedi[numOfPages - 1][0];
        MiddleColor = odpovedi[numOfPages - 1][1];
        RightColor = odpovedi[numOfPages - 1][2];
        if (odpovedi[numOfPages - 1][1] == "null") {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[numOfPages - 1][0] + ", " + odpovedi[numOfPages - 1][2] + " 100%)";
            checked = false;
        }
        else {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[numOfPages - 1][0] + "," + odpovedi[numOfPages - 1][1] + "," + odpovedi[numOfPages - 1][2] + " 100%)";
            checked = true;
        }
        leftButton.style.backgroundColor = odpovedi[numOfPages - 1][0];
        if (odpovedi[numOfPages - 1][1] == "null") {
            middleButton.style.backgroundColor = "#00000000";

        } else
            middleButton.style.backgroundColor = odpovedi[numOfPages - 1][1];

        rightButton.style.backgroundColor = odpovedi[numOfPages - 1][2];
        document.getElementById("cislostranky").innerHTML = numOfPages + "/" + numOfQuestions;

        document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
        for (let i = 0; i < Questions[numOfPages - 1].length; i++) {
            document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / Questions[numOfPages - 1].length + "%'>" + Questions[numOfPages - 1][i] + "</li>";

            // if(Questions[numOfPages-1][i].length < 7)
            // document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / Questions[numOfPages].length + "%'>" + Questions[numOfPages][i] + "</li>";
            // else{
            //     document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / Questions[numOfPages - 1].length + "%;font-size:16px'>" + Questions[numOfPages - 1][i] + "</li>";
            //     }
            //Zmenseni pisma, pokud slovo obsahuje vic jak 7 pismen
        }

        if (numOfQuestions == numOfPages) {
            document.getElementById("dalsi").innerHTML = "Ukončit dotazník";
            document.getElementById("dalsi").style.width = "250px";

        } else {

            document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';
            document.getElementById("dalsi").style.width = "130px";
        }
        AdjustColorToBackground();
    }
}

