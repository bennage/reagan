
const abbreviator = /^\s*\.\.\.\s*/gm;

module.exports = function (oldCode, newCode, diff) {

    // this works best in the positive case where the sample matches the source
    // in the negative case, it requires manually intervention
    var segments = oldCode.split(abbreviator);

    // if an abbreviator is not found, 
    // return the original diff
    if (segments.length === 1) return diff;

    // if the new code does not have exact matches for _everthing_ in the abbreviated code, 
    // return an annotated diff
    var segments_match = segments.every(s => newCode.indexOf(s) !== -1);
    if (!segments_match) {
        return diff;
    }

    // if all segments have a match,
    // create a new diff communicating no differences
    return [{
        value: oldCode,
        count: oldCode.length
    }];
};