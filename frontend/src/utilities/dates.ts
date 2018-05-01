
export interface IDateDiffParams {
    past: Date | string;
    future?: Date | string;
    levels?: number;
}

export function getDateDiff(params: IDateDiffParams) {
    const past = params.past instanceof Date ? params.past : new Date(params.past);
    const future = params.future ? params.future instanceof Date ? params.future : new Date(params.future) : new Date();
    const levels = params.levels || 2;
    return dateDiff(past, future, levels);
}

function dateDiff(past: Date, future: Date, levels: number) {
    const diff = future.getTime() - past.getTime();

    let seconds = diff / 1000;
    const years = Math.floor(seconds / 31556926);
    seconds -= years * 31556926;

    const months = Math.floor(seconds / 2629744);
    seconds -= months * 2629744;

    const weeks = Math.floor(seconds / 604800);
    seconds -= weeks * 604800;

    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let result = '';
    if (years > 0) {
        result += years + (years > 1 ? ' years' : ' year');
        levels--;
    }

    if (months > 0 && levels > 0) {
        if (result) {
            result += ', ';
        }
        result += months + (months > 1 ? ' months' : ' month');
        levels--;
    }

    if (weeks > 0 && levels > 0) {
        if (result) {
            result += ', ';
        }
        result += weeks + (weeks > 1 ? ' weeks' : ' week');
        levels--;
    }

    if (days > 0 && levels > 0) {
        if (result) {
            result += ', ';
        }
        result += days + (days > 1 ? ' days' : ' day');
        levels--;
    }

    if (hours > 0 && levels > 0) {
        if (result) {
            result += ', ';
        }
        result += hours + (hours > 1 ? ' hours' : ' hour');
        levels--;
    }

    if (minutes > 0 && levels > 0) {
        if (result) {
            result += ' and ';
        }
        result += minutes + (minutes > 1 ? ' minutes' : ' minute');
        levels--;
    }

    if (seconds > 0 && levels > 0) {
        if (result) {
            result += ' and ';
        }
        result += seconds + (seconds > 1 ? ' seconds' : ' second');
        levels--;
    }

    if (!result) {
        return 'Just now';
    }

    return result + ' ago';
}