import { Types } from '../types';

export function isTour(route) {
  return route.type === Types.TOUR;
}

export function sumReducer(acc, val) {
  return acc + val;
}
