/**
 * Create a rule object and returns it
 * @param {String} name The name of the version
 * @param {Number} units The number of units each player has at the beginning
 * @param {Array} tickets An array of tickets
 * @param {Number} initialScore The score (positive or negative) at the beginning of a game
 * @param {Object} pointsPerRoute Points per route
 * @param {Number} threshold The threshold from which the last N turns initiate (eg. "six pieces or fewer" ==> threshold = 6)
 * @param {Number} numberOfTurnsEnd The number of turns left once the threshold has been reached
 * @param {Boolean} hasBoats A truthy value if this version has boats
 * @param {Boolean} hasExchanges A truthy value if this version allows exchanges
 * @param {Number} numberOfHarbors The number of harbors per player at the beginning. 0 if this version doesn't include harbors.
 * @param {Number} unsetHarbor The number of points per harbors unused at the end of the game.
 * @param {Array} harborRule Contains the three different values a player can earn thanks to a harbor
 * @param {Number} numberOfTrainStations The number of train stations per player at the beginning. 0 if this version doesn't include train stations.
 * @param {Number} unsetTrainStation The number of points per train station unused at the end of the game.
 * @param {Number} trainStationRule The number of points a player can earn thanks to a train station on the board.
 * @param {Number} bonusLongestPoints Number of bonus points for the longest path. 0 if this version doesn't include this bonus.

 */
function create(
    name, units, tickets, initialScore, pointsPerRoute, threshold, numberOfTurnsEnd,
    hasBoats, hasExchanges, numberOfHarbors=0, unsetHarbor=0, harborRule=null,
    numberOfTrainStations=0, unsetTrainStation=0, trainStationRule=0,
    bonusLongestPoints=0, bonusGlobeTrotter=0){
    return {
        "name": name,
        "units": units,
        "tickets": tickets,
        "initialScore": initialScore,
        "pointsPerRoute": pointsPerRoute,
        "threshold": threshold,
        "numberOfTurnsEnd": numberOfTurnsEnd,
        "hasBoats": hasBoats,
        "hasExchanges": hasExchanges,
        "hasHarbors": (numberOfHarbors!=0),
        "numberOfHarborsPerPlayer": numberOfHarbors,
        "pointsPerUnsetHarbor": unsetHarbor,
        "harborRule": harborRule,
        "hasTrainStations": (numberOfTrainStations!=0),
        "numberOfTrainStationsPerPlayer": numberOfTrainStations,
        "pointsPerUnsetTrainStation": unsetTrainStation,
        "trainStationRule": trainStationRule,
        "hasLongest": (bonusLongestPoints!=0),
        "longestPoints": bonusLongestPoints,
        "hasBonusGlobeTrotter": (bonusGlobeTrotter != 0),
        "bonusGlobeTrotter": bonusGlobeTrotter,
    }
}

module.exports.create = create;