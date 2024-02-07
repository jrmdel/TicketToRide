import { Subject } from 'rxjs';

class BonusService {
  bonusesRelatedToUnits = [];

  constructor() {
    this.unitsWithBonus = new Subject();
    this.unitsWithBonus$ = this.unitsWithBonus.asObservable();
  }

  getUnitsWithBonusObservable() {
    return this.unitsWithBonus$;
  }

  addUnitsWithBonus(value) {
    this.unitsWithBonus.next(value);
  }
}

export default new BonusService();
