import React from "react";

export const getTotalPrice = (number: string, price: string) => {
  const quant = parseInt(number);
  const currency = price.charAt(0);
  const stringWithoutCurrency = price.substring(1);
  const floatPrice = parseFloat(stringWithoutCurrency);
  return `${currency}${(floatPrice * quant).toFixed(2)}`;
};

interface PreparedObject {
  [key: string]: {
    quantity: number;
    location?: string;
  };
}

export const preparedObjectForFetch = (
  componentsAppState: any,
  checked: Set<string> | null,
  location: any,
  type: "inventory" | "shopping"
): PreparedObject => {
  if (!componentsAppState || !checked) {
    return {};
  }

  const returnObject: PreparedObject = {};
  Object.keys(componentsAppState)
    .filter((item) => checked?.has(item))
    .forEach((item) => {
      returnObject[item] =
        type === "inventory"
          ? {
              quantity: componentsAppState[item]?.quantity || 0,
              location: location?.[item]?.location,
            }
          : { quantity: componentsAppState[item]?.quantity || 0 };
    });
  return returnObject;
};

export const clearAppCache = async (
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
    try {
        await localforage.clear();
        Object.keys(componentsAppState).forEach((id) => {
            const element = document.getElementById(`quantity_${id}`);
            if(element) { // @ts-ignore
                element.value = null;
            }
        });
        setComponentsAppState({});
        setComponentLocalStorage({});
        setComponentsChecked(new Set([]));
        setShoppingChecked(new Set([]));
        setAllCSwitchesOn(false);
        setAllSSwitchesOn(false);
        setLocation({});
    } catch (err) {
        console.log(err);
    }
};

export const setAllSwitches = (appState, switchesOn, setChecked, localKey, localforageStore) => {
    if (Object.keys(appState).length) {
        localforageStore.setItem(localKey, switchesOn ? Object.keys(appState) : []).then(() => {
            setChecked(new Set(switchesOn ? Object.keys(appState) : []));
        });
    }
};

export const switchHandler = (array, value, setter) => {
    setter(prev => {
        const newArray = new Set(prev);
        if (array.has(value)) {
            newArray.delete(value);
        } else {
            newArray.add(value);
        }
        return newArray;
    });
};

export const getID = (e: { target: { id: string } }) =>
  e.target.id.split("_")[1];
