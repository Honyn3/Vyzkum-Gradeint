<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rozcestník - gradienty</title>
    <link rel="stylesheet" href="RozcestnikStyle.css">
</head>
<body>
<header>
        <nav>
            <p id="Heading">Rozcestník</p>
            <ul class="Grid">
                <ul class="Grid">
                    <li class="bold">Základ:</li>
                    <li><a href="http://klara.fit.vutbr.cz:3000/" class="border">Dotazník</a></li>
                    <li><a href="http://klara.fit.vutbr.cz:3000/results/" class="border">Výsledky</a></li>
                </ul>

                <ul class="Grid">
                    <li class="bold">Barvy:</li>
                    <li><a href="http://klara.fit.vutbr.cz:3000/colors/" class="border">Dotazník</a></li>
                    <li><a href="http://klara.fit.vutbr.cz:3000/colorsresults/" class="border">Výsledky</a></li>
                </ul>
            </ul>
        </nav>
    </header>

    <?php $password = $_POST["pass"];
    if ($password != "heslo"){
        redirect("index.html");
    } else
        ShowTheRest();

    function redirect($url, $statusCode = 303){
        header('Location: ' . $url, true, $statusCode);
        die();
    }

    function ShowTheRest(){
        echo <<< EOT
        (<div id="container">
        <div id="basic" class="contChild">
            <h2 style="text-align: center; margin-bottom: 0px; margin-top: 50px;">Základ</h3>
                <hr>
                <div class="lowerCont">
                    <div style="grid-row: 1; grid-column: 1;"> Otázky :</div>
                    <div style="grid-row: 1 / 4; grid-column: 2 / 5;" class="table">
                        <table id="basicTable">

                        </table>
                    </div>
                </div>
        </div>
        <div id="colors" class="contChild">
            <h2 style="text-align: center; margin-bottom: 0px; margin-top: 50px;">Barvy</h3>
                <hr>
                <div class="lowerCont">
                    <div style="grid-row: 1; grid-column: 1;"> Otázky :</div>
                    <div style="grid-row: 1 / 4; grid-column: 2 / 5;" class="table">
                        <table id="colorTable">

                        </table>
                    </div>
                </div>
        </div>
    </div>

    <script>
        let basicData;
        let basicTable = document.getElementById("basicTable");

        let colorData;
        let colorTable = document.getElementById("colorTable");

        window.addEventListener('DOMContentLoaded', () => {
            GetQuestionsBasic();
            GetQuestionsColor();
        })

        //#region Basic

        const GetQuestionsBasic = async () => {
            let uri = 'http://klara.fit.vutbr.cz:3000/source/0';
            const wait = await fetch(uri);
            const data = await wait.json();

            basicData = (data.data);
            WriteToTableBasic();
            console.log(basicData);
        }

        function WriteToTableBasic() {
            basicTable.innerHTML = "";

            for (let i = 0; i < basicData.length; i++) {
                let div = "<tr>"
                for (let j = 0; j < basicData[i].length; j++) {
                    div += '<td class="basicTd"><input type="text" value="' + basicData[i][j] + '" class="width80 QuestionInput"></td>';
                }
                div += '<td><input type="button" value="-" onclick="RemoveBasic(' + i + ')" class="minusButton"></td>'
                div += "</tr>";
                basicTable.innerHTML += div;
            }
            let addNew = '<td><input type="button" value="Přidat" onclick="addNewBasic()" class="plusButton"></td>' + '<td><input type="button" value="Uložit" onclick="SaveBasic()" id="saveButton"></td>';
            basicTable.innerHTML += addNew;

        }

        function SaveBasic() {

            let dataToSave = [,];
            for (let i = 0; i < basicTable.children.length - 1; i++) {
                const element = basicTable.children[i];
                let toSave = [];

                for (let j = 0; j < element.firstChild.children.length; j++) {
                    let help = element.firstChild.children[j].firstChild.value;
                    if (help != "-" && help != "" && help != null) {

                        toSave[toSave.length] = help;
                    }
                }

                dataToSave[i] = toSave;
            }
            console.log(dataToSave);

            let ConfirmText = "";
            for (let i = 0; i < dataToSave.length; i++) {
                ConfirmText += dataToSave[i];
                ConfirmText += "\n";
            }
            console.log(ConfirmText)

            if (confirm(ConfirmText)) {
                SaveBasicToDB(dataToSave);
            }
        }

        const SaveBasicToDB = async (data) => {
            let uri = 'http://klara.fit.vutbr.cz:3000/source/0';

            let saveData = {
                data: data,
                id:0
            };

            await fetch(uri, {
                method: 'PATCH',
                body: JSON.stringify(saveData),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        

        function addNewBasic() {
            basicData.push(["", "", "", "", ""]);
            WriteToTableBasic();
        }

        function RemoveBasic(index) {
            basicData.splice(index, 1);
            WriteToTableBasic();
        }
        //#endregion

        //#region color
        const GetQuestionsColor = async () => {
            let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource';
            const wait = await fetch(uri);
            const data = await wait.json();

            colorData = data[0].data;
            console.log(colorData);

            WriteToTableColor();
        }

        function WriteToTableColor() {
            colorTable.innerHTML = "";

            for (let i = 0; i <= colorData.length / 5; i++) {
                let div = "<tr>"
                for (let j = 0; j < 5; j++) {
                    if (colorData[j + (i * 5)] != undefined)
                        div += '<td class="colorTd"><input type="text" value="' + colorData[j + (i * 5)] + '" class="width80 QuestionInput"><input type="button" value="-" onclick="RemoveColor(' + (j + (i * 5)) + ')" class="minusButton"></td>';
                }
                div += "</tr>";
                colorTable.innerHTML += div;
            }
            let addNew = '<td><input type="button" value="Přidat" onclick="addNewColor()" class="plusButton"></td>' + '<td><input type="button" value="Uložit" onclick="SaveColor()" id="saveButton"></td>';
            colorTable.innerHTML += addNew;

        }

        function SaveColor() {

            let dataToSave = [];

            for (let i = 0; i < colorTable.children.length - 1; i++) {
                const element = colorTable.children[i];

                for (let j = 0; j < element.firstChild.children.length; j++) {
                    let help = element.firstChild.children[j].firstChild.value;
                    if (help != "-" && help != "" && help != null) {
                        dataToSave[dataToSave.length] = help;
                    }
                }
            }
            console.log(dataToSave);

            let ConfirmText = "";
            for (let i = 0; i < dataToSave.length; i++) {
                ConfirmText += dataToSave[i];
                ConfirmText += "\n";
            }

            if (confirm(ConfirmText)) {
                SaveColorToDb(dataToSave);
            }
        }

        const SaveColorSaveColorToDb = async (data) => {
            let uri = 'http://klara.fit.vutbr.cz:3000/ColorsSource/0';

            let saveData = {
                data: data,
                id:0
            };

            await fetch(uri, {
                method: 'PATCH',
                body: JSON.stringify(saveData),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        function addNewColor() {
            colorData.push("");
            WriteToTableColor();
        }

        function RemoveColor(index) {
            colorData.splice(index, 1);
            WriteToTableColor();
        }
        //#endregion
    </script>)
EOT;
    }
    ?>

</body>
</html>