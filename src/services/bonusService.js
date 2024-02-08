import { BehaviorSubject, Subject } from 'rxjs';

class BonusService {
  constructor() {
    this.unitsWithBonus = new Subject();
    this.bonusesRelatedToUnits = new BehaviorSubject();
  }

  getUnitsWithBonusObservable() {
    return this.unitsWithBonus.asObservable();
  }

  addUnitsWithBonus(value) {
    this.unitsWithBonus.next(value);
  }

  resetUnits() {
    this.unitsWithBonus.next(null);
  }

  getBonusesRelatedToUnitsObservable() {
    return this.bonusesRelatedToUnits.asObservable();
  }

  setBonusesRelatedToUnits(value) {
    this.bonusesRelatedToUnits.next(value);
  }

  resetBonuses() {
    this.bonusesRelatedToUnits.next(null);
  }
}

export default new BonusService();
