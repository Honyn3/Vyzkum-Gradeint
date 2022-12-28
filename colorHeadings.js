function AdjustColorToBackground() {
    for (let index = 0; index < scaleList.childElementCount; index++) {
        let child = scaleList.children[index];
        if (index == 0) percentage = 0;
        else if (index == scaleList.childElementCount - 1) percentage = 100;
        else percentage = (index * 100 / scaleList.childElementCount) + 50 / scaleList.childElementCount;
        // child.style.color = GetColorFromGradient(percentage); //pro zmenu barvy pisma na gradientovou
        if (GetColorAverage(percentage) > 128) child.style.color = "#222A35"; //pro zmenu barvy pisma vzhledem k pozadi
        else child.style.color = "#f0f0f0";
    }
}
function GetColorAverage(percentage) {
    color = GetColorFromGradientArray(percentage);
    return (Number(color[0]) + Number(color[1]) + Number(color[2])) / 3;
}
function GetColorFromGradient(percentage) {
    if (MiddleColor == "null") {
        let lCol, rCol;
        if (LeftColor[0] == 'r') lCol = ConvertRGBToHex(LeftColor);
        else lCol = hexToRgb(LeftColor);
        if (RightColor[0] == 'r') rCol = ConvertRGBToHex(RightColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;


        return "rgb( " + Math.round(lCol[0] + percentage * rDelta) + ", " + Math.round(lCol[1] + percentage * gDelta) + ", " + Math.round(lCol[2] + percentage * bDelta) + ")";
    } else {
        if (percentage >= 50) {
            return GetColorFromGradientMiddleColor(2 * percentage - 50, false);
        } else {
            return GetColorFromGradientMiddleColor(percentage * 2, true);
        }
    }
}
function GetColorFromGradientMiddleColor(percentage, LeftToMiddle) {
    if (LeftToMiddle) {
        let lCol, rCol;
        if (LeftColor[0] == 'r') lCol = ConvertRGBToHex(LeftColor);
        else lCol = hexToRgb(LeftColor);
        if (MiddleColor[0] == 'r') rCol = ConvertRGBToHex(MiddleColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;

        return "rgb( " + Math.round(lCol[0] + percentage * rDelta) + ", " + Math.round(lCol[1] + percentage * gDelta) + ", " + Math.round(lCol[2] + percentage * bDelta) + ")";
    } else {
        let lCol, rCol;
        if (MiddleColor[0] == 'r') lCol = ConvertRGBToHex(MiddleColor);
        else lCol = hexToRgb(LeftColor);
        if (RightColor[0] == 'r') rCol = ConvertRGBToHex(RightColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;


        return "rgb( " + Math.round(lCol[0] + percentage * rDelta) + ", " + Math.round(lCol[1] + percentage * gDelta) + ", " + Math.round(lCol[2] + percentage * bDelta) + ")";
    }
}
function GetColorFromGradientMiddleColorArray(percentage, LeftToMiddle) {
    if (LeftToMiddle) {
        let lCol, rCol;
        if (LeftColor[0] == 'r') lCol = ConvertRGBToHex(LeftColor);
        else lCol = hexToRgb(LeftColor);
        if (MiddleColor[0] == 'r') rCol = ConvertRGBToHex(MiddleColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;

        return [Math.round(lCol[0] + percentage * rDelta), Math.round(lCol[1] + percentage * gDelta), Math.round(lCol[2] + percentage * bDelta)];
    } else {
        let lCol, rCol;
        if (MiddleColor[0] == 'r') lCol = ConvertRGBToHex(MiddleColor);
        else lCol = hexToRgb(LeftColor);
        if (RightColor[0] == 'r') rCol = ConvertRGBToHex(RightColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;


        return [Math.round(lCol[0] + percentage * rDelta), Math.round(lCol[1] + percentage * gDelta), Math.round(lCol[2] + percentage * bDelta)];

    }
}
function GetColorFromGradientArray(percentage) {
    if (MiddleColor == "null") {
        let lCol, rCol;
        if (LeftColor[0] == 'r') lCol = ConvertRGBToHex(LeftColor);
        else lCol = hexToRgb(LeftColor);
        if (RightColor[0] == 'r') rCol = ConvertRGBToHex(RightColor);
        else rCol = hexToRgb(RightColor);

        let rDelta = Number(rCol[0] - lCol[0]) / 100;
        let gDelta = Number(rCol[1] - lCol[1]) / 100;
        let bDelta = Number(rCol[2] - lCol[2]) / 100;

        return color = [Math.round(lCol[0] + percentage * rDelta), Math.round(lCol[1] + percentage * gDelta), Math.round(lCol[2] + percentage * bDelta)];
    } else {
        if (percentage > 50) {
            return GetColorFromGradientMiddleColorArray(2 * percentage - 50, false);
        } else {
            return GetColorFromGradientMiddleColorArray(percentage * 2, true);
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
function ConvertRGBToHex(color) {
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