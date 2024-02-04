import { PennsylvaniaStockShares } from './pennsylvania/pennsylvania-stock-shares';
import Rule from './rule';
import { Tickets } from './tickets';

var world = Rule.create(
  'Around The World',
  60,
  Tickets.World,
  -12,
  { 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 15, 7: 18, 8: 21 },
  6,
  2,
  true,
  true,
  3,
  -4,
  [20, 30, 40]
);
var lakes = Rule.create(
  'Great Lakes',
  50,
  Tickets.GreatLakes,
  -12,
  { 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 15, 7: 18, 8: 21, 9: 27 },
  6,
  2,
  true,
  true,
  3,
  -4,
  [10, 20, 30]
);
var europ = Rule.create(
  'Europe',
  45,
  Tickets.Europe,
  12,
  { 1: 1, 2: 2, 3: 4, 4: 7, 6: 15, 8: 21 },
  2,
  1,
  false,
  false,
  0,
  0,
  null,
  3,
  4,
  0,
  10
);
var france = Rule.create(
  'France',
  40,
  Tickets.France,
  0,
  { 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 18 },
  2,
  1,
  false,
  false,
  0,
  0,
  null,
  0,
  0,
  0,
  10,
  15
);
var india = Rule.create(
  'India',
  45,
  Tickets.India,
  0,
  { 1: 1, 2: 2, 3: 4, 4: 7, 6: 18, 8: 21 },
  2,
  1,
  false,
  false,
  0,
  0,
  null,
  0,
  0,
  0,
  10,
  0,
  true
);
const pennsylvania = Rule.create(
  'Pennsylvanie',
  45,
  Tickets.Pennsylvania,
  0,
  { 1: 1, 2: 2, 3: 4, 4: 7, 5: 10, 6: 15, 7: 18 },
  2,
  1,
  false,
  false,
  0,
  0,
  null,
  0,
  0,
  null,
  0,
  15,
  false,
  true,
  PennsylvaniaStockShares
);

export const Games = [world, lakes, europ, france, india, pennsylvania];
