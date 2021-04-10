class Rule {
    constructor(name, units, pointsPerRoute, threshold, numberOfTurnsEnd, hasHarbors, hasTrainStations, hasLongest, longestPoints=0, tickets) {
        // The name of the version
        this.name = name;
        // The number of units each player has at the beginning
        this.units = units;
        // Points per route
        this.pointsPerRoute = pointsPerRoute
        // The threshold from which the last N turns initiate (eg. "six pieces or fewer" ==> threshold = 6)
        this.threshold = threshold;
        // The number of turns left once the threshold has been reached
        this.numberOfTurnsEnd = numberOfTurnsEnd;
        // A truthy value if this version has harbors
        this.hasHarbors = hasHarbors;
        // A truthy value if this version has train station
        this.hasTrainStations = hasTrainStations;
        // A truthy value if this version gives bonus points to the longest continuous path
        this.hasLongest = hasLongest;
        // Number of bonus points for the longest path
        this.longestPoints = longestPoints;
        // Tickets
        this.tickets = tickets;
    }
}