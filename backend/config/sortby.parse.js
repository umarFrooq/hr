const sortByParser = (options, sortBy) => {
    if (!options.sortBy && sortBy) {
        options["sortBy"] = sortBy;
    } else if (options && options.sortBy && typeof options.sortBy == 'object') {
        let sort = options.sortBy
        options.sortBy = Object.assign(sortBy, sort);
    } else if (options && options.sortBy && typeof options.sortBy == 'string') {
        const isJson = IsJsonString(options.sortBy);
        if (isJson) {
            let sort = JSON.parse(options.sortBy)
            options.sortBy = Object.assign(sortBy, sort);
        } else {
            const sorting = (sortByStringParser(options.sortBy));
            options.sortBy = sorting;
        }
    }
    return options
}

const sortByStringParser = (sortBy) => {
    let options = {}
    if (sortBy.indexOf(":") !== -1) {
        let splitString = sortBy.split(/[x^:]/);
        console.log(splitString);
        options[splitString[0]] = splitString[1];
    } else {
        let index = false;
        if (sortBy.indexOf("+") !== -1) index = false
        if (sortBy.indexOf("-") !== -1) index = true
        let splitString = sortBy.split(/[x^+-]/);
        options[splitString[1]] = index ? "-1" : "1";
    }
    return options
}

const IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
module.exports = sortByParser;