let colorPicker = document.getElementById("colorDiv");
let slider = document.getElementById("slider");
let rightButton = document.getElementById("colorButtonRight");
let leftButton = document.getElementById("colorButtonLeft");
let gradient = document.getElementById("gradient");
let middleButton = document.getElementById("slider");
let middleSwitch = document.getElementById("checkbox");

let btnIndex = 0;
let colorWidthHalf = 100;

let LeftColor = "#A1A1A1";
let RightColor = "#A1A1A1";
let MiddleColor = null;
let prevMiddleColor = "#A1A1A1";


function LeftButtonPressed() {
    colorPicker.style.marginLeft = leftButton.getBoundingClientRect().x - colorWidthHalf + "px";
    btnIndex = 0;
    ChangeActive();
}
function MiddleButtonPressed() {
    let pos = slider.getBoundingClientRect().x + (slider.value / 100 * slider.offsetWidth) - slider.value / 2.8 - 100;
    colorPicker.style.marginLeft = pos + "px";
    btnIndex = 1;
    MoveGradient();
    ChangeActive();

}
function RightButtonPressed() {
    colorPicker.style.marginLeft = rightButton.getBoundingClientRect().x - colorWidthHalf + "px";
    btnIndex = 2;
    ChangeActive();

}
function ChangeActive() {
    switch (btnIndex) {
        case 0:
            leftButton.style.borderRadius = '10px';
            rightButton.style.borderRadius = '1000px';
            middleButton.style.setProperty('--borderRadius', '40px');
            break;
        case 1:
            leftButton.style.borderRadius = '1000px';
            rightButton.style.borderRadius = '1000px';
            middleButton.style.setProperty('--borderRadius', '10px');
            break;
        case 2:
            leftButton.style.borderRadius = '1000px';
            rightButton.style.borderRadius = '10px';
            middleButton.style.setProperty('--borderRadius', '40px');
            break;
    }
}
function Barvy(barva) {
    switch (btnIndex) {
        case 0:
            LeftColor = barva;
            leftButton.style.backgroundColor = barva;
            break;
        case 1:
            MiddleColor = barva;
            middleButton.style.setProperty('--sliderColor', barva);
            middleSwitch.checked = true;
            break;
        case 2:
            RightColor = barva;
            rightButton.style.backgroundColor = barva;
            break;

    }
    MoveGradient();
}
function MoveGradient() {
    if (MiddleColor != "null") {
        let col = "linear-gradient(to right, " + LeftColor + " , " + MiddleColor + " " + (GradientAdjust((slider.value + 10) / 100)) + "%, " + RightColor + " )";
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
LeftButtonPressed();

function Checkbox() {
    if (middleSwitch.checked == true) {
        MiddleColor = prevMiddleColor;
        middleButton.style.setProperty('--sliderColor', MiddleColor);

    }
    else {
        prevMiddleColor = MiddleColor;

        MiddleColor = "null";
        middleButton.style.setProperty('--sliderColor', MiddleColor);
    }
    MoveGradient();

}

let pocetstranek = 1;
let soupisotazek = [["skvělé", "dobré", "neutrální", "špatné", "příšerné"], ["nádherné", "hezké", "neutrální", "ošklivé", "ohavné"], ["rychlé", "svižné", "neutrální", "zvolna", "pomalé"], ["biologie", "programování", "chemie", "němčina"]] //slova nad sliderem (budou v budoucnu přicházet ze serveru)
let celkovypocetotazek = soupisotazek.length;
let odpovedi = [];
let barvy = ["#A1A1A1", "null", "#A1A1A1"]; // zapisuje pouze 3 barvy
if (localStorage.getItem("odpovedi")) {
}
else {
    for (let i = 0; i < celkovypocetotazek; i++) { // vytvori JSON se samými šedými barvami
        odpovedi[i] = barvy;
    }
    localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
}

function start() {
    if (localStorage.getItem("pouzil")) {
        document.getElementById("buttonstart").style.display = "none";
        document.getElementById("konec").style.display = "block";
        document.getElementById("konec").innerHTML = "Průzkum jste již vyplnil(a), moc děkujeme.";
        localStorage.removeItem("odpovedi");
    }
    else {
        odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
        console.log(odpovedi[0][1]);
        if (odpovedi[0][1] == "null") {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[0][0] + ", " + odpovedi[0][2] + " 100%)";
            middleSwitch.checked = false;
        }
        else {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[0][0] + "," + odpovedi[0][1] + "," + odpovedi[0][2] + " 100%)";
            middleSwitch.checked = true;
        }
        LeftColor = odpovedi[0][0];
        MiddleColor = odpovedi[0][1];
        RightColor = odpovedi[0][2];
        leftButton.style.backgroundColor = odpovedi[0][0];
        if (odpovedi[0][1] != null) {
            middleButton.style.setProperty('--sliderColor', odpovedi[0][1]);
        } else {
            middleButton.style.setProperty('--sliderColor', "#A1A1A1");
        }
        rightButton.style.backgroundColor = odpovedi[0][2];
        document.getElementById("buttonstart").style.display = "none";
        document.getElementById("stranka").style.display = "block";

        document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
        for (let i = 0; i < soupisotazek[0].length; i++) {
            document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / soupisotazek[0].length + "%'>" + soupisotazek[0][i] + "</li>";
        }

        document.getElementById("cislostranky").innerHTML = pocetstranek + "/" + celkovypocetotazek;
    }
}
function dalsi() {
    odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
    odpovedi[pocetstranek - 1][0] = LeftColor;
    odpovedi[pocetstranek - 1][1] = MiddleColor;
    odpovedi[pocetstranek - 1][2] = RightColor;
    localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
    if (celkovypocetotazek == pocetstranek)// zápis do online databáze v případě, že jsme na poslední stránce
    {
        document.getElementById("stranka").style.display = "none";
        document.getElementById("konec").style.display = "block";
        localStorage.removeItem("odpovedi");
        localStorage.setItem("pouzil", "ano");
    } else {
        LeftColor = odpovedi[pocetstranek][0];
        MiddleColor = odpovedi[pocetstranek][1];
        RightColor = odpovedi[pocetstranek][2];
        if (odpovedi[pocetstranek][1] == "null") {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[pocetstranek][0] + ", " + odpovedi[pocetstranek][2] + " 100%)";
            middleSwitch.checked = false;
        }
        else {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[pocetstranek][0] + "," + odpovedi[pocetstranek][1] + "," + odpovedi[pocetstranek][2] + " 100%)";
            middleSwitch.checked = true;
        }
        leftButton.style.backgroundColor = odpovedi[pocetstranek][0];
        middleButton.style.setProperty('--sliderColor', odpovedi[pocetstranek][1]);
        rightButton.style.backgroundColor = odpovedi[pocetstranek][2];

        document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
        for (let i = 0; i < soupisotazek[pocetstranek].length; i++) {
            document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / soupisotazek[pocetstranek].length + "%'>" + soupisotazek[pocetstranek][i] + "</li>";
        }

        pocetstranek = pocetstranek + 1;
        document.getElementById("cislostranky").innerHTML = pocetstranek + "/" + celkovypocetotazek;
        if (celkovypocetotazek == pocetstranek) {
            document.getElementById("dalsi").innerHTML = "Ukončit dotazník";
        } else {
            document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';
        }
    }
}


function zpatky() {
    if ((pocetstranek - 2) >= 0) {
        odpovedi = JSON.parse(localStorage.getItem("odpovedi"));
        odpovedi[pocetstranek - 1][0] = LeftColor;
        odpovedi[pocetstranek - 1][1] = MiddleColor;
        odpovedi[pocetstranek - 1][2] = RightColor;
        localStorage.setItem("odpovedi", JSON.stringify(odpovedi));
        pocetstranek = pocetstranek - 1;
        LeftColor = odpovedi[pocetstranek - 1][0];
        MiddleColor = odpovedi[pocetstranek - 1][1];
        RightColor = odpovedi[pocetstranek - 1][2];
        if (odpovedi[pocetstranek - 1][1] == "null") {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[pocetstranek - 1][0] + ", " + odpovedi[pocetstranek - 1][2] + " 100%)";
            middleSwitch.checked = false;
        }
        else {
            gradient.style.background = "linear-gradient(to right, " + odpovedi[pocetstranek - 1][0] + "," + odpovedi[pocetstranek - 1][1] + "," + odpovedi[pocetstranek - 1][2] + " 100%)";
            middleSwitch.checked = true;
        }
        leftButton.style.backgroundColor = odpovedi[pocetstranek - 1][0];
        middleButton.style.setProperty('--sliderColor', odpovedi[pocetstranek - 1][1]);
        rightButton.style.backgroundColor = odpovedi[pocetstranek - 1][2];
        document.getElementById("cislostranky").innerHTML = pocetstranek + "/" + celkovypocetotazek;

        document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
        for (let i = 0; i < soupisotazek[pocetstranek - 1].length; i++) {
            document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / soupisotazek[pocetstranek - 1].length + "%'>" + soupisotazek[pocetstranek - 1][i] + "</li>";
        }

        if (celkovypocetotazek == pocetstranek) {
            document.getElementById("dalsi").innerHTML = "Ukončit dotazník";
        } else {
            document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';
        }
    }

}