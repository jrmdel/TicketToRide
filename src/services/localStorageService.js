const ENUM_ITEMS = {
  units: 'units',
  mandala: 'mandalaBonus',
  longest: 'longestBonus',
  globeTrotter: 'globeTrotterBonus',
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

  setLongest(bonus) {
    if (!bonus) {
      localStorage.removeItem(ENUM_ITEMS.longest);
      return;
    }
    localStorage.setItem(ENUM_ITEMS.longest, bonus);
  }

  getLongest() {
    const longestBonus = parseInt(localStorage.getItem(ENUM_ITEMS.longest));
    if (isNaN(longestBonus)) {
      return 0;
    }
    return longestBonus;
  }

  setGlobeTrotter(bonus) {
    if (!bonus) {
      localStorage.removeItem(ENUM_ITEMS.globeTrotter);
      return;
    }
    localStorage.setItem(ENUM_ITEMS.globeTrotter, bonus);
  }

  getGlobeTrotter() {
    const globeTrotterBonus = parseInt(
      localStorage.getItem(ENUM_ITEMS.globeTrotter)
    );
    if (isNaN(globeTrotterBonus)) {
      return 0;
    }
    return globeTrotterBonus;
  }
}

export default new LocalStorageService();
