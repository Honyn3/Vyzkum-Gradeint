let CompOne = document.getElementById("CompOne");
let CompTwo = document.getElementById("CompTwo");
let CompTextOne = document.getElementById("CompTextOne");
let CompTextTwo = document.getElementById("CompTextTwo");
let ResultText = document.getElementById("Result");

function FillScalePickTable() {
    let rows;
    rows = (document.body.offsetWidth-200) / 100 - 2;
    console.log(rows);
    if(document.body.offsetWidth > 1000) rows = (Questions.length / 4) + 1;
    else rows = (Questions.length / 8) + 1;
    //TODO: MOBIL

    console.log(rows);

    for (let i = 0; i < rows; i++) {
        let add = document.createElement("tr");

        add.className = "trScalePick";
        for (let j = 0; j < 4; j++) {
            if (Questions[i * 4 + j] != undefined) {
                let child = document.createElement("td");
                child.style.background = GetCone(i * 4 + j, 0);

                let word = document.createElement("p");
                word.innerHTML = Questions[i * 4 + j][0];
                word.style.margin = "1px";
                word.style.color = "white";
                word.style.textShadow = "1px 1px 2px black";
                child.appendChild(word);

                child.onclick = function () { SelectColor(i * 4 + j, 0) };
                child.className = "ScalePickSingle";
                child.id = Number(String(i * 4 + j) + "0");
                add.appendChild(child);

                let child2 = document.createElement("td");
                child2.style.background = GetCone(i * 4 + j, 2);

                let word2 = document.createElement("p");
                word2.innerHTML = Questions[i * 4 + j][Questions[i * 4 + j].length - 1];
                word2.style.margin = "1px";
                word2.style.color = "white";
                word2.style.textShadow = "1px 1px 2px black";
                child2.appendChild(word2);

                child2.onclick = function () { SelectColor(i * 4 + j, 1) };
                child2.className = "ScalePickSingle";
                child2.id = Number(String(i * 4 + j) + "1");
                add.appendChild(child2);

            }
        }
        ScalePickTable.appendChild(add);
    }
}

let left = true;
let CompareCones = [];
function SelectColor(id, side) {

    let ConeId = String(id) + String(side);
    if (ConeId == "00") ConeId = "0";
    if (ConeId == "01") ConeId = "1";

    let cone = document.getElementById(ConeId);
    ChangeSelectedConeStyle(cone);

    if (left) {
        CompOne.style.background = cone.style.background;
        CompTextOne.innerHTML = cone.children[0].innerHTML;
        let pushToCone = [];
        for (let i = 0; i < Gradients.length; i++) {
            const element = RGBToRgb(JSON.parse(Gradients[i].colors)[id][side]);
            if (!element.includes(undefined))
                pushToCone.push(element);
        }
        CompareCones[0] = pushToCone;
    }
    else {
        CompTwo.style.background = cone.style.background;
        CompTextTwo.innerHTML = cone.children[0].innerHTML;

        let pushToCone = [];
        for (let i = 0; i < Gradients.length; i++) {
            const element = RGBToRgb(JSON.parse(Gradients[i].colors)[id][side]);
            if (!element.includes(undefined))
                pushToCone.push(element);
        }
        CompareCones[1] = pushToCone;
        CompareConesIntoArray();

    }
    left = !left;
}

let coneStyles = [];
function ChangeSelectedConeStyle(cone){
    let otherCones = document.getElementsByClassName("ScalePickSingle");
    for (let i = 0; i < otherCones.length; i++) {
        otherCones[i].style.filter = "";
    }
    if (left) {
        coneStyles[0] = cone;
    }
    else {
        coneStyles[1] = cone;
    }
    coneStyles[0].style.filter = "drop-shadow(2px 4px 6px black)";
    if (coneStyles[1] != null) coneStyles[1].style.filter = "drop-shadow(2px 4px 6px black)";
}

let Distances = [];
function CompareConesIntoArray() {
    Distances = []
    for (let i = 0; i < CompareCones[0].length; i++) {
        let DistLow = [];
        for (let j = 0; j < CompareCones[1].length; j++) {
            let dst = Math.sqrt(Math.abs((CompareCones[1][i][0] - CompareCones[0][j][0]) * (CompareCones[1][i][0] - CompareCones[0][j][0]) + (CompareCones[1][i][1] - CompareCones[0][j][1]) * (CompareCones[1][i][1] - CompareCones[0][j][1]) + (CompareCones[1][i][2] - CompareCones[0][j][2]) * (CompareCones[1][i][2] - CompareCones[0][j][2])));
            DistLow.push(dst);
        }
        Distances.push(DistLow);
    }
    //console.log(Distances);

    GetSimilarity();
}

function GetSimilarity() {
    let DistancesHelp = JSON.parse(JSON.stringify(Distances));

    var m = new Munkres();
    var indices = m.compute(DistancesHelp);
    var total = 0;
    for (var i = 0; i < indices.length; ++i) {
        var row = indices[i][0], col = indices[i][1];
        var value = DistancesHelp[row][col];
        total += value;
    }

    console.log('Percentage:', Math.round(100 - (total / (indices.length * 441)) * 100) + "%");

    ResultText.innerHTML = "Stejné na " + Math.round(100 - (total / (indices.length * 441)) * 100) + "%";
}

function FindOptimal(dist) {
    let is = [];
    let js = [];
    let n = dist.length;

    let zeroCount = 0;
    for (let i = 0; i < dist.length; i++) {
        for (let j = 0; j < dist[i].length; j++) {
            if (dist[i][j] == 0) zeroCount++;
        }
    }

    //console.log("Zeros: " + zeroCount);

    let StarZeros = [];
    let loop = 0;
    while (loop < 1000) {
        is.splice(0, is.length);
        js.splice(0, js.length);
        for (let i = 0; i < dist.length; i++) {
            for (let j = 0; j < dist[i].length; j++) {
                if (dist[i][j] == 0) {
                    if (!is.includes(i) && !js.includes(j) && !StarZeros.includes([i, j])) {
                        is.push(i);
                        js.push(j);
                        StarZeros.push([i, j]);
                        console.log(StarZeros.includes([i, j]));
                    }

                }
            }
        }
        /* console.log(PrimeZeros);*/
        console.log(StarZeros);
        let colums = [];
        let rows = [];
        for (let i = 0; i < StarZeros.length; i++) {
            if (!colums.includes(StarZeros[i][1]))
                colums.push(StarZeros[i][1]);
        }
        PrimeZeros = [];
        let zerosUncovered = 0;
        let containsZero = false;
        //console.log("1");
        for (let i = 0; i < dist.length; i++) {
            if (!colums.includes(i)) {
                for (let j = 0; j < dist[i].length; j++) {
                    if (!rows.includes(j) && dist[i][j] == 0) {
                        if (!PrimeZeros.includes([i, j])) {
                            PrimeZeros.push([i, j]);
                            let k = PrimeZeros.length - 1;
                            containsZero = false;
                            for (let l = 0; l < StarZeros.length; l++) {
                                if (PrimeZeros[k][0] == StarZeros[l][0] && !rows.includes(PrimeZeros[k][0])) {
                                    rows.push(PrimeZeros[k][0]);
                                    colums.splice(colums.indexOf(StarZeros[l][1]), 1);
                                    //console.log("2");
                                    ////console.log("Rows " + rows);
                                    ////console.log("Columns " + colums);
                                    containsZero = true;
                                    break;

                                }
                            }
                            if (!containsZero) {
                                //console.log("3");

                                try {
                                    ////console.log(PrimeZeros[k]);
                                    let path = findPath(PrimeZeros[k][1], dist);
                                    while (path[0] == true) {
                                        path = findPath(path[1], dist);
                                        //console.log(path);
                                    }
                                } catch (error) {
                                    //console.log("Index out of range - caught error");
                                }

                                break;


                            }
                        }
                        ////console.log(StarZeros.length + " " + PrimeZeros.length +" " + containsZero);

                    }
                }
            }
        }

        console.log("Rows: " + rows + "\n" + "Columns: " + colums);
        //console.log("4");
        if (CheckIfAllCovered(rows, colums, zeroCount, dist)) break;
        else {
            PrimeZeros = [];
            rows = [];
            colums = [];
        }
        loop++;

    }
    console.log("finish");

}

function CheckIfAllCovered(rows, colums, zeroCount, dist) {
    let zeros = [];
    let zeroCompareCount = 0;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < dist.length; j++) {
            if (dist[rows[i]][j] == 0 && !zeros.includes([rows[i], j])) {
                zeroCompareCount++;
                zeros.push([rows[i], j]);
            }
        }
    }

    for (let i = 0; i < colums.length; i++) {
        for (let j = 0; j < dist.length; j++) {
            if (dist[j][colums[i]] == 0 && !zeros.includes([j, colums[i]])) {
                zeroCompareCount++;
                zeros.push([j, colums[i]]);
            }
        }
    }

    console.log("Zeros: " + zeroCount + " " + zeroCompareCount);
    if (zeroCount == zeroCompareCount) return true;
    return false;
}

/* function hungarianAlgorithm(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const assignments = new Array(numRows).fill(null);
    const potentials = new Array(numCols).fill(0);
    const primes = new Array(numRows).fill(null).map(() => new Array(numCols).fill(false));

    for (let k = 0; k < 2; k++) {
        for (let i = 0; i < numRows; i++) {
            if (assignments[i] === null) {
                const minVal = Math.min(...matrix[i]);
                for (let j = 0; j < numCols; j++) {
                    if (matrix[i][j] === minVal) {
                        if (potentials[j] > minVal || k === 1) {
                            potentials[j] = minVal;
                            primes[i][j] = true;
                            const colIndex = assignments.indexOf(j);
                            if (colIndex !== -1) {
                                primes[colIndex][j] = false;
                            } else {
                                for (let m = 0; m < numRows; m++) {
                                    if (m !== i) {
                                        primes[m][j] = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let path = [];
        for (let i = 0; i < numRows && path.length === 0; i++) {
            if (assignments[i] === null) {
                const visitedRows = new Array(numRows).fill(false);
                const visitedCols = new Array(numCols).fill(false);
                path = findPath(i, matrix, assignments, primes, visitedRows, visitedCols);
            }
        }

        while (path.length > 0) {
            for (let i = 0; i < path.length; i++) {
                const [row, col] = path[i];
                if (primes[row][col]) {
                    primes[row][col] = false;
                    assignments[row] = col;
                    break;
                } else {
                    primes[row][col] = true;
                    const rowIndex = assignments.indexOf(col);
                    if (rowIndex !== -1) {
                        path.push([rowIndex, col]);
                    }
                }
            }
            path = [];
            for (let i = 0; i < numRows && path.length === 0; i++) {
                if (assignments[i] === null) {
                    const visitedRows = new Array(numRows).fill(false);
                    const visitedCols = new Array(numCols).fill(false);
                    path = findPath(i, matrix, assignments, primes, visitedRows, visitedCols);
                }
            }
        }
    }

    let totalCost = 0;
    for (let i = 0; i < numRows; i++) {
        if (assignments[i] !== null) {
            totalCost += matrix[i][assignments[i]];
        }

    }

    return totalCost;
}

function findPath(column, matrix) {
    const l = matrix.length;
    const path = [];
    let row = -1;
    let origCol = column;

    for (let i = 0; i < StarZeros.length; i++) {
        let s = StarZeros[i];
        ////console.log(s[1] + " " + column);

        if (s[1] == column) {
            row = s[0];

            StarZeros.splice(StarZeros.indexOf(s), 1);
            ////console.log("encounterSplice " + col + " " + s);
            break;
        }

    }
    if (row == -1) {
        return [false, 0]
    };

    for (let i = 0; i < PrimeZeros.length; i++) {
        let p = PrimeZeros[i];
        if (p[0] == row) {
            column = p[1];
            StarZeros.push(p);
            PrimeZeros.splice(PrimeZeros.indexOf(p), 1);
            ////console.log("encounter2 " + row + " " + col + " " + origRow);

            break;
        }

    }

    if (origCol != column) {
        //console.log("5");

        for (let i = 0; i < StarZeros.length; i++) {
            let s = StarZeros[i];
            if (s[1] == column) {
                //console.log("6");

                return [true, column];
            }

        }
    }
    return [false, 0];
}


function StepFive(columns, rows, dist) {
    let min = 10000;
    for (let i = 0; i < dist.length; i++) {
        for (let j = 0; j < dist[i].length; j++) {
            if (dist[i][j] < min && !columns.includes(j) && !rows.includes(i)) min = dist[i][j];
        }
    }

    for (let i = 0; i < dist.length; i++) {
        for (let j = 0; j < dist[i].length; j++) {
            if (!columns.includes(j) && !rows.includes(i)) dist[i][j] -= min;
            else if (columns.includes(j) && rows.includes(i)) dist[i][j] += min;
        }
    }
    alert("StepFive");
    FindOptimal(dist);

}

function SubtractMinColumn(dist) {
    let mins = [];
    for (let i = 0; i < dist.length; i++) {
        mins[i] = 100000;
        for (let j = 0; j < dist[i].length; j++) {
            if (dist[j][i] < mins[i]) mins[i] = dist[j][i];
        }
    }

    for (let i = 0; i < dist.length; i++) {
        for (let j = 0; j < dist[i].length; j++) {
            dist[j][i] -= mins[i];
        }
    }

    return dist;
}

function SubtractMinRow(dist) {
    let mins = [];
    for (let i = 0; i < dist.length; i++) {
        mins[i] = 100000;
        for (let j = 0; j < dist[i].length; j++) {
            if (dist[i][j] < mins[i]) mins[i] = dist[i][j];
        }
    }

    for (let i = 0; i < dist.length; i++) {
        for (let j = 0; j < dist[i].length; j++) {
            dist[i][j] -= mins[i];
        }
    }

    return dist;
} */

function GetCone(id, place) {
    SortHueWithSpecifiedScale(id, place, 1);
    let div0 = 'conic-gradient(';

    for (let index = 0; index < Gradients.length; index++) {

        if (filterEmptyTickbox.checked && JSON.parse(Gradients[index].colors)[id][1] == "null" && JSON.parse(Gradients[index].colors)[id][2] == "#A1A1A1" && JSON.parse(Gradients[index].colors)[id][0] == "#A1A1A1") {
            if (index == Gradients.length - 1) {
                div0 = div0.slice(0, div0.length - 2)
            };
        }
        else {

            if (index == Gradients.length - 1) {
                div0 += JSON.parse(Gradients[index].colors)[id][place];
            } else {
                div0 += JSON.parse(Gradients[index].colors)[id][place] + ', ';
            }
        }
    }

    GraphWidth = document.body.offsetWidth / 5;

    div0 += ')';
    return div0;
}