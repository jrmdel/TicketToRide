const ENUM_ITEMS = {
  units: 'units',
  mandala: 'mandalaBonus',
  longest: 'longestBonus',
  globeTrotter: 'globeTrotterBonus',
  harbors: 'harbors',
};

class LocalStorageService {
  constructor() {}

  /* UNITS */
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

  /* MANDALA BONUS */
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

  /* LONGEST BONUS */
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

  /* GLOBE TROTTER BONUS */
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

  /* HARBORS */
  setHarbors(harbors) {
    if (!harbors || harbors?.length === 0) {
      localStorage.removeItem(ENUM_ITEMS.harbors);
      return;
    }
    localStorage.setItem(ENUM_ITEMS.harbors, JSON.stringify(harbors));
  }

  getHarbors() {
    const harborsFromStorage = localStorage.getItem(ENUM_ITEMS.harbors);
    if (!harborsFromStorage) {
      return [];
    }
    return JSON.parse(harborsFromStorage);
  }
}

export default new LocalStorageService();
