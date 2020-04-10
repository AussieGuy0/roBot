export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
}

export function createString(char: string, length: number): string {
    let out = "";
    for (let i = 0; i < length; i++) {
       out +=  char; 
    }
    return out;
}

export function generateUniqueNumbers(min: number, max: number, count: number) {
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

export function generateArray(count: number, char: string) {
    let out = [];
    for (let i = 0; i < count; i++) {
        out.push(char);
    }
    return out;
};
