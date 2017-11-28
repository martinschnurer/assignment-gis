const Query = require('./Query');
const Link = require('./Link')
const AmenitiesByStops = require('./AmenitiesByStops')
const PeopleConnection = require('./PeopleConnection')

const resolveFunctions = {
  Query, AmenitiesByStops, PeopleConnection, Link
};

module.exports = resolveFunctions;