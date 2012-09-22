exports.fullName = function(first, last) {
    first = first || '';
    last = last || '';

    return first + ((first && last) ? ' ' : '') + last;
}