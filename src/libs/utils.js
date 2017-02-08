this.isNullOrUndefined = function(value) {
    return value === null || value === undefined;
}

this.createString = function(char, length) {
    let out = "";
    for (let i = 0; i < length; i++) {
       out +=  char; 
    }
    return out;
}

this.generateUniqueNumbers = function(min, max, count) {
    if (min > max) {
        console.error(`Could not generate numbers because min '${min}' is greater than max '${max}'`);
        return [];
    }

    if (max - min < count) {
        console.error(`Not enough numbers to generate ${count} unique random numbers with min '${min}' and max '${max}' `);
        return [];
    }

    let pool = [];
    for (let i = min; i < max; i++) {
        pool.push(i);
    }

    pool.sort((a,b) => {
        let randNum = Math.random();
        return randNum === 0.5 ? 0 : randNum < 0.5 ? -1 : 1;
    });

    let out = [];
    for (let i = 0; i < count; i++) {
        out.push(pool[i]);
    }

    return out;
};

this.generateArray = function(count, char) {
    let out = [];
    for (let i = 0; i < count; i++) {
        out.push(char);
    }
    return out;
};