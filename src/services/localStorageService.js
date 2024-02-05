const ENUM_ITEMS = {
  units: 'units',
};

class LocalStorageService {
  constructor() {}

  setUnits(units) {
    if (!units) {
      localStorage.removeItem(ENUM_ITEMS.units);
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
}

export default new LocalStorageService();
