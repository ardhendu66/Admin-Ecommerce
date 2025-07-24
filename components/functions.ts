export function destructDescriptionArray(str: string[]) {
    let newString = ""
    for(let i = 0; i < str.length; i++) {
        newString = newString + str[i] + ","
    }
    return newString
}

export function constructDescriptionArray(str: string) {
    let s: string = ""
    let newStringArray = []
    for(let i = 0; i < str.length; i++) {
        if(str[i] !== ',') {
            s += str[i]
        }
        else if(str[i] === ',') {
            newStringArray.push(s)
            s = ""
        }
    }
    return newStringArray
}