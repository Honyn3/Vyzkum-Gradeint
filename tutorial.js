let tutorialwords = ["horké", "vlažné", "studené"];
const tutorialtext = document.createElement("div");
tutorialtext.setAttribute("id", "tutorialtext");
document.body.appendChild(tutorialtext);
movesofcursor();
let cursorTut = document.getElementById("cursortutorial");
cursorTut.style.display = "none";
var r = document.querySelector(':root');
var rs = getComputedStyle(r);
move = 1;

function movesofcursor() {

    document.getElementById("zpatky").style.display = "none";
    document.getElementById("cislostranky").style.display = "none";
    document.getElementById("stranka").style.display = "block";
    document.getElementById("buttonstart").style.display = "none";
    document.getElementById("scaleLi").innerHTML = ''; //vypis slov nad sliderem
    for (let i = 0; i < tutorialwords.length; i++) {
        document.getElementById("scaleLi").innerHTML += "<li style='text-align:center;width:" + 100 / tutorialwords.length + "%'>" + tutorialwords[i] + "</li>";
    }
    page.onclick = "";
    document.body.onclick = "";
    for (let i = 0; i < document.getElementsByTagName("button").length; i++) {
        document.getElementsByTagName("button")[i].onclick = "";
    }
    for (let i = 0; i < document.getElementsByTagName("input").length; i++) {
        document.getElementsByTagName("input")[i].onclick = "";
    }
    // create tutorial pop up
    const tutorialrealtext = document.createTextNode("Budeme mít za úkol přiřadit barvy ke slovům nad nimi, můžete přiřadit 2 nebo 3 barvy jak uvidíte v následující animaci.");
    tutorialtext.appendChild(tutorialrealtext);
    const tutorialbutton = document.createElement("button");
    const textnode = document.createTextNode("Další");
    tutorialbutton.appendChild(textnode);
    tutorialtext.appendChild(tutorialbutton);
    tutorialbutton.setAttribute("id", "tutorialbutton");
    page.style.filter = "blur(8px)"
    tutorialbutton.onclick = function () {
        cursorTut.style.display = "block";
        page.style.filter = "blur(0px)"
        setTimeout(firstmove, 500);
        tutorialtext.style.display = "none";
    }
    let dalsiButton = document.getElementById("dalsi");
    dalsiButton.onclick = function () { dalsi() }
    dalsiButton.innerHTML = "Přeskočit";
    tutorialBool = true;
}
function GetElementX(nameOfElement) {
    return Number(document.getElementById(nameOfElement).getBoundingClientRect().x.toFixed()) + 10 + 'px';
}
function GetElementY(nameOfElement) {
    return Number(document.getElementById(nameOfElement).getBoundingClientRect().top.toFixed()) + 10 + 'px';
}
function SetNextCoordinates(nameOfElement) {
    r.style.setProperty('--secondleft', GetElementX(nameOfElement));
    if (nameOfElement != "button0")
        r.style.setProperty('--secondtop', GetElementY(nameOfElement));
    else {
        r.style.setProperty('--secondtop', Number(document.getElementById(nameOfElement).getBoundingClientRect().top.toFixed()) + 'px');
    }
}
function ResetRootProperties() {
    cursorTut.style.animation = "none";
    r.style.setProperty('--firstleft', rs.getPropertyValue('--secondleft'));
    r.style.setProperty('--firsttop', rs.getPropertyValue('--secondtop'));
}
function Intervals(moveNumber) {
    if (tutorialBool) {
        cursorTut.style.animation = "moves 2s forwards";
        setTimeout(tutorialclick, 2000);
        setTimeout(moveNumber, 2500);
    } else {
        cursorTut.style.animation = "none";
        clearTimeout(tutorialclick);
        clearTimeout(moveNumber);
    }
}
function firstmove() {
    SetNextCoordinates("colorButtonLeft");
    Intervals(secondmove);
}
function secondmove() {
    ResetRootProperties();
    SetNextCoordinates("button8");
    Intervals(thirdmove);
}
function thirdmove() {
    ResetRootProperties();
    SetNextCoordinates("colorButtonRight");
    Intervals(fourthmove);
}
function fourthmove() {
    ResetRootProperties();
    SetNextCoordinates("button20");
    Intervals(fifthmove);
}
function fifthmove() {
    ResetRootProperties();
    SetNextCoordinates("colorButtonMiddle");
    Intervals(sixthmove);
}
function sixthmove() {
    ResetRootProperties();
    SetNextCoordinates("button4");
    if (tutorialBool) {
        cursorTut.style.animation = "moves 2s forwards"; //second move of the cursor
        setTimeout(tutorialclick, 2000);
        while (tutorialtext.firstChild) {
            tutorialtext.removeChild(tutorialtext.firstChild);
        }
        setTimeout(() => {
            page.style.filter = "blur(0px)"
            tutorialtext.style.display = "block";
            const tutorialrealtext = document.createTextNode("Prostřední barvu můžete též zrušit a nechat pouze dvě.");
            tutorialtext.appendChild(tutorialrealtext);
            const tutorialbutton = document.createElement("button");
            const textnode = document.createTextNode("Další");
            tutorialbutton.appendChild(textnode);
            tutorialtext.appendChild(tutorialbutton);
            tutorialbutton.setAttribute("id", "tutorialbutton");
            page.style.filter = "blur(8px)"
            tutorialbutton.onclick = function () {
                page.style.filter = "blur(0px)"
                setTimeout(sevethmove, 500);
                tutorialtext.style.display = "none";
            }
        }, 2500);
    }
}
function sevethmove() {
    ResetRootProperties();
    SetNextCoordinates("button0");
    Intervals(eighthmove);
}
function eighthmove() {
    ResetRootProperties();

    if (tutorialBool) {
        r.style.setProperty('--secondleft', document.getElementById("button7").getBoundingClientRect().x.toFixed() * 1.2 + 'px');
        r.style.setProperty('--secondtop', Number(document.getElementById("button7").getBoundingClientRect().top.toFixed()) + 10 + 'px');
        cursorTut.style.animation = "moves 2s forwards";
        setTimeout(tutorialclick, 2000);

        EndOfAnim();
    }
}
function ForceEndOfAnim() {
    while (tutorialtext.firstChild) {
        tutorialtext.removeChild(tutorialtext.firstChild);
    }
    page.style.filter = "blur(0px)"
    tutorialtext.style.display = "block";
    const tutorialrealtext = document.createTextNode("Nyní můžete pokračovat na výzkum.");
    tutorialtext.appendChild(tutorialrealtext);
    const tutorialbutton = document.createElement("button");
    const textnode = document.createTextNode("Začít test");
    tutorialbutton.appendChild(textnode);
    tutorialtext.appendChild(tutorialbutton);
    tutorialbutton.setAttribute("id", "tutorialbutton");
    page.style.filter = "blur(8px)"

    tutorialbutton.onclick = function () { //shows the start menu
        for (let i = 0; i < document.getElementById("preset").getElementsByTagName("button").length; i++) {
            document.getElementById("preset").getElementsByTagName("button")[i].onclick = function () { Barvy(this); };
        }
        document.getElementById("dalsi").style.display = "block";
        document.getElementById("zpatky").style.display = "block";
        document.getElementById("cislostranky").style.display = "block";
        rightButton.onclick = function () { RightButtonPressed() }
        leftButton.onclick = function () { LeftButtonPressed() }
        middleButton.onclick = function () { MiddleButtonPressed() }
        page.onclick = function () { hideColor() }
        document.body.onclick = function () { backgroundClicked() }
        document.getElementById("dalsi").onclick = function () { dalsi() }
        document.getElementById("zpatky").onclick = function () { zpatky() }
        page.style.filter = "blur(0px)"
        setTimeout(start, 500);
        tutorialtext.style.display = "none";
        cursorTut.style.display = "none";
        cursorTut.style.animation = "none";

    }
}
function EndOfAnim() {
    while (tutorialtext.firstChild) {
        tutorialtext.removeChild(tutorialtext.firstChild);
    }
    setTimeout(() => {
        page.style.filter = "blur(0px)"
        tutorialtext.style.display = "block";
        const tutorialrealtext = document.createTextNode("Nyní můžete pokračovat na výzkum.");
        tutorialtext.appendChild(tutorialrealtext);
        const tutorialbutton = document.createElement("button");
        const textnode = document.createTextNode("Začít test");
        tutorialbutton.appendChild(textnode);
        tutorialtext.appendChild(tutorialbutton);
        tutorialbutton.setAttribute("id", "tutorialbutton");
        page.style.filter = "blur(8px)"

        tutorialbutton.onclick = function () { //shows the start menu
            for (let i = 0; i < document.getElementById("preset").getElementsByTagName("button").length; i++) {
                document.getElementById("preset").getElementsByTagName("button")[i].onclick = function () { Barvy(this); };
            }
            document.getElementById("dalsi").style.marginTop = '';
            document.getElementById("dalsi").innerHTML = 'Další <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="white" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>';

            document.getElementById("dalsi").style.display = "block";
            document.getElementById("zpatky").style.display = "block";
            document.getElementById("cislostranky").style.display = "block";
            rightButton.onclick = function () { RightButtonPressed() }
            leftButton.onclick = function () { LeftButtonPressed() }
            middleButton.onclick = function () { MiddleButtonPressed() }
            page.onclick = function () { hideColor() }
            document.body.onclick = function () { backgroundClicked() }
            document.getElementById("dalsi").onclick = function () { dalsi() }
            document.getElementById("zpatky").onclick = function () { zpatky() }
            page.style.filter = "blur(0px)";
            setTimeout(start, 500);
            tutorialtext.style.display = "none";
            cursorTut.style.display = "none";
        }
    }, 2500);
}
function tutorialclick() {
    if (!tutorialBool) return;
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    document.body.appendChild(ripple);
    ripple.style.top = cursorTut.getBoundingClientRect().top.toFixed() + "px";
    ripple.style.left = cursorTut.getBoundingClientRect().left.toFixed() + "px";
    ripple.style.animation = "ripple-effect .4s  linear";
    ripple.onanimationend = () => {
        document.body.removeChild(ripple);
    }
    if (move == 1) {
        LeftButtonPressed();
    } else if (move == 2) {
        setTimeout(Barvy(document.getElementById("button8")), 1000);
    } else if (move == 3) {
        RightButtonPressed();
    } else if (move == 4) {
        setTimeout(Barvy(document.getElementById("button20")), 1000);
    } else if (move == 5) {
        MiddleButtonPressed();
    } else if (move == 6) {
        setTimeout(Barvy(document.getElementById("button4")), 1000);
    } else if (move == 7) {
        MiddleColor = "null";
        middleButton.style.backgroundColor = "#00000000";
        backgroundClick = true;
        MoveGradient();
    } else if (move == 8) {
        backgroundClickedtutorial();
    }
    move += 1;
}