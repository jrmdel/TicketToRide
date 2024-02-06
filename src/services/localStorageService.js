const ENUM_ITEMS = {
  units: 'units',
  mandala: 'mandalaBonus',
};

class LocalStorageService {
  constructor() {}

  setUnits(units) {
    if (!units) {
      localStorage.removeItem(ENUM_ITEMS.units);
      return;
    }
    localStorage.setItem(ENUM_ITEMS.units, JSON.stringify(units));
  }

  getUnits() {
    const unitsFromStorage = localStorage.getItem(ENUM_ITEMS.units);
    if (!unitsFromStorage) {
      return null;
    }
    return JSON.parse(unitsFromStorage);
  }

  setMandala(bonus) {
    if (!bonus) {
      localStorage.removeItem(ENUM_ITEMS.mandala);
      return;
    }
    localStorage.setItem(ENUM_ITEMS.mandala, bonus);
  }

  getMandala() {
    const mandalaBonus = parseInt(localStorage.getItem(ENUM_ITEMS.mandala));
    if (isNaN(mandalaBonus)) {
      return 0;
    }
    return mandalaBonus;
  }
}

export default new LocalStorageService();
