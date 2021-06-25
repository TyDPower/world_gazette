export const compareIndex = (whichIndex, userIndexArr, compareIndexArr) => {
    let x = compareIndexArr[1] * 100
    let y = x / userIndexArr[1]
    let res;
    
    const comparison = (whichIndex) => {
        if (y <= 100) {
            let z = 100 - y
            z = z.toFixed(2)
            return `${userIndexArr[0]} ${whichIndex} index is ${z}% higher than in ${compareIndexArr[0]}`
        } else if (y > 100 && y < 1000) {
            let a = y - 100
            a = a.toFixed(2)
            return `${userIndexArr[0]} ${whichIndex} index is ${a}% lower than in ${compareIndexArr[0]}`
        } else {
            return `Not enough information is avalible for this comparison. Either enable location sharing by refreshing your browser or please see "About API's" if you have any data relating to ${whichIndex} in ${compareIndexArr[0]}.`
        }
    }  

    switch (whichIndex) {
        case "traffic":
            res = comparison(whichIndex);
            break;

        case "quality of life":
            res = comparison(whichIndex);
            break;

        case "healthcare":
            res = comparison(whichIndex);
            break;

        case "crime":
            res = comparison(whichIndex);
            break;

        case "safety":
            res = comparison(whichIndex);
            break;

        case "pollution":
            res = comparison(whichIndex);
            break;

        case "cost of living":
            res = comparison(whichIndex);
            break;

        case "rent":
            res = comparison(whichIndex);
            break;

        case "groceries": case "food":
            res = comparison(whichIndex);
            break;

        case "resturant":
            res = comparison(whichIndex);
            break;

        case "purchasing power":
            res = comparison(whichIndex);
            break;

        default:
            console.error("whichIndex must be have an input.")
    }

    return res;
}

export const checkValidCurrency = (userCurrency) => {
    if (!userCurrency) {
        return "$"
    } else {
        return userCurrency
    }
};

export const checkDST = (dst) => {
    if (dst === 1) {
        return "Daylight Savings Time is currently active"
    } else {
        return "No Daylight Savings Time currently active"
    }
};

