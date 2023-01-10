import React from "react";

export const getTotalPrice = (number: string, price: string) => {
  const quant = parseInt(number);
  const currency = price.charAt(0);
  const stringWithoutCurrency = price.substring(1);
  const floatPrice = parseFloat(stringWithoutCurrency);
  return `${currency}${(floatPrice * quant).toFixed(2)}`;
};

export const preparedObjectForFetch = (
  componentsAppState,
  checked,
  location,
  type: "inventory" | "shopping"
) => {
  const returnObject = {};

  Object.keys(componentsAppState)
    .filter((item) => checked.has(item))
    .forEach(
      (item) =>
        (returnObject[item] =
          type === "inventory"
            ? {
                quantity: componentsAppState[item]["quantity"],
                location: location[item]["location"],
              }
            : { quantity: componentsAppState[item]["quantity"] })
    );
  return returnObject;
};

export const clear_app_cache = (
  componentsAppState,
  setComponentsAppState,
  setComponentLocalStorage,
  setComponentsChecked,
  setShoppingChecked,
  setAllCSwitchesOn,
  setAllSSwitchesOn,
  setLocation,
  localforage
) => {
  localforage
    .clear()
    .then(() => {
      Object.keys(componentsAppState).forEach((id) => {
          const elements = document.getElementById(
          `quantity_${id}`
        ) as HTMLInputElement;
        elements.value = null;
      })
      setComponentsAppState({});
      setComponentLocalStorage([]);
      setComponentsChecked(new Set([]));
      setShoppingChecked(new Set([]));
      setAllCSwitchesOn(false);
      setAllSSwitchesOn(false);
      setLocation({});
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setAllSwitches = (
  appState,
  switchesOn,
  setChecked,
  localKey,
  localforageStore
) => {
  if (Object.keys(appState).length) {
    if (switchesOn) {
      const newShoppingChecked = [...Object.keys(appState)];
      localforageStore.setItem(localKey, newShoppingChecked).then(() => {
        setChecked(new Set(newShoppingChecked));
      });
    } else {
      localforageStore.setItem(localKey, []).then(() => {
        setChecked(new Set([]));
      });
    }
  }
};

export const switchHandler = (
  array: Set<any>,
  value: any,
  setter: {
    (value: React.SetStateAction<Set<any>>): void;
    (value: React.SetStateAction<Set<any>>): void;
    (arg0: { (prev: any): Set<any>; (prev: any): Set<any> }): void;
  }
) => {
  if (array.has(value)) {
    // Remove from set
    setter((prev) => new Set([...prev].filter((x) => x !== value)));
  } else {
    // Add to set
    setter((prev) => new Set([...prev, value]));
  }
};

export const getID = (e: { target: { id: string } }) =>
  e.target.id.split("_")[1];
