// @ts-ignore
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  preparedObjectForFetch,
  switchHandler,
  getID,
  setAllSwitches,
  clear_app_cache,
} from "./utils/common";
// @ts-ignore
import {Button, Form, Offcanvas, OverlayTrigger, Tooltip,} from "react-bootstrap";
import Row from "./components/Row";
import OnDeleteConfirmation from "./components/OnDeleteConfirmation";
// @ts-ignore
import localForage from "localforage";
// @ts-ignore
import Cookies from "js-cookie";
// @ts-ignore
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import _ from "lodash";
// @ts-ignore
import randomColor from "randomcolor";

declare global {
  interface Window {
    username: string;
  }
}

interface ComponentDataType {
  [value: number]: {
    price: string;
    item_url: string;
    description: string;
    item_no: string;
    quantity: number;
    supplier_short_name: string;
    add_to_components_list: "true" | "false";
    add_to_shopping_list: "true" | "false";
    location: string;
    for_module?: string;
  };
}

const App = () => {
  // Show hide state of tab
  const [show, setShow] = useState(false);

  const [extended, setExtended] = useState(false);

  // Main data from browser state
  const [componentsAppState, setComponentsAppState] = useState<
    ComponentDataType | {}
  >({});
  const [componentLocalStorage, setComponentLocalStorage] = useState({});

  const [colorList] = useState(
    [...Array(20)].map(() => {
      return randomColor({ luminosity: "dark" });
    })
  );

  // An array of IDs representing the on/off state of the switches (if it's in the array it's "on")
  const [componentsChecked, setComponentsChecked] = useState(new Set([]));
  const [shoppingChecked, setShoppingChecked] = useState(new Set([]));

  // A boolean representing the state of the two "meta" switches at the top of the columns
  const [allCSwitchesOn, setAllCSwitchesOn] = useState(false);
  const [allSSwitchesOn, setAllSSwitchesOn] = useState(false);

  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  // {"location": ["text": ""}, etc.], "remainder": ""}
  const [location, setLocation] = useState({});

  const getComponents = async () => {
    const csrftoken = Cookies.get("csrftoken");
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(Object.keys(componentLocalStorage).map(Number)),
    };
    try {
      const res = await fetch("/components/lookup/", settings);
      return res.json();
    } catch (e) {
      return e;
    }
  };

  const { data: compData, isLoading: compIsLoading } = useQuery(
    ["componentsInfo"],
    () => getComponents()
  );

  let addToUserListsEnabled: React.MutableRefObject<boolean> = useRef(false);

  const handleConfirmDeleteModelClose = () => setConfirmDeleteShow(false);

  const handleExtended = () => setExtended(!extended);

  // Handle a click on the main button that expands the offcanvas div
  const handleOffCanvasButtonClick = () => {
    const username = window.username;

    window["localforage_store"]
      .getItem("components")
      .then((value) => {
        if (value) {
          setComponentLocalStorage(value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    try {
      window["localforage_store"]
        .getItem("componentsChecked")
        .then((checked) => {
          setComponentsChecked(new Set(checked));
        });
    } catch {
      console.log("No componentsChecked in local storage");
    }

    try {
      window["localforage_store"].getItem("shoppingChecked").then((checked) => {
        setShoppingChecked(new Set(checked));
      });
    } catch {
      console.log("No shoppingChecked in local storage");
    }

    try {
      window["localforage_store"].getItem("locations").then((value) => {
        setLocation(value);
      });
    } catch {
      console.log("No locations in local storage");
    }

    setShow(!show);
  };

  // Open popup to confirm delete
  const handleConfirmDeleteModelShow = (e) => {
    setDeleteID(e);
    setConfirmDeleteShow(true);
  };

  // Handle click on Add Selection to List button
  const addSelectionToList = () => {
    if (typeof componentsAppState !== "object") {
      return;
    }

    const csrftoken = Cookies.get("csrftoken");

    const requestOptionsInventory = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(
        preparedObjectForFetch(
          componentsAppState,
          componentsChecked,
          location,
          "inventory"
        )
      ),
    };

    const requestOptionsShopping = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(
        //   "none" here refers to the module id. No module id means it's part of the anonymous shopping list
        //   {[module id]: {[component id]: {'quantity': "...}}
        {
          none: preparedObjectForFetch(
            componentsAppState,
            shoppingChecked,
            location,
            "shopping"
          ),
        }
      ),
    };

    let response_success = true;

    fetch("/users/add_components_to_shopping/", requestOptionsShopping)
      .then((response) => {
        const status = response.status;
        if (status != 200) {
          response_success = false;
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    fetch("/users/add_components_to_inventory/", requestOptionsInventory)
      .then((response) => {
        const status = response.status;
        if (status != 200) {
          response_success = false;
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    // If all requests are successful, reset app state
    if (response_success) {
      clear_app_cache(
        componentsAppState,
        setComponentsAppState,
        setComponentLocalStorage,
        setComponentsChecked,
        setShoppingChecked,
        setAllCSwitchesOn,
        setAllSSwitchesOn,
        setLocation,
        window["localforage_store"]
      );
    }
  };

  // Handler called when offcanvas closes
  const handleClose = () => {
    setShow(false);
  };

  // Update hook with the state of a single row switch
  const setStateFromSwitch = (compID: string, list_type: string) => {
    if (list_type === "components") {
      const newComponentsChecked = componentsChecked.has(compID)
        ? _.remove(componentsChecked, (n) => n === compID)
        : [...componentsChecked, compID];
      window["localforage_store"]
        .setItem("componentsChecked", newComponentsChecked)
        .then(() => {
          switchHandler(componentsChecked, compID, setComponentsChecked);
        });
    }
    if (list_type === "shopping") {
      const newShoppingChecked = shoppingChecked.has(compID)
        ? _.remove(shoppingChecked, (n) => n === compID)
        : [...shoppingChecked, compID];
      window["localforage_store"]
        .setItem("shoppingChecked", newShoppingChecked)
        .then(() => {
          switchHandler(shoppingChecked, compID, setShoppingChecked);
        });
    }
  };

  // Handle a click on any of the switches for the data rows
  const handleSwitchesChange = (
    e: { target: { id: string } },
    type: string
  ) => {
    const switchID = getID(e);
    setStateFromSwitch(switchID, type);
  };

  // Handle any click on the "meta" switches at the top of the switch columns
  const handleMetaSwitchChange = (e: object, type: string) => {
    if (type === "components") {
      window["localforage_store"]
        .setItem("metaCSwitch", !allCSwitchesOn)
        .then(() => {
          setAllCSwitchesOn(!allCSwitchesOn);
        });
    } else {
      window["localforage_store"]
        .setItem("metaSSwitch", !allSSwitchesOn)
        .then(() => {
          if (!allSSwitchesOn) {
            Object.keys(componentsAppState).forEach((item, index) => {
              setShoppingChecked(new Set([...shoppingChecked, item]));
            });
          }
          setAllSSwitchesOn(!allSSwitchesOn);
        });
    }
  };

  useEffect(() => {
    if (allCSwitchesOn) {
      const allKeys = Object.keys(componentsAppState);
      window["localforage_store"]
        .setItem("componentsChecked", allKeys)
        .then(() => {
          setComponentsChecked(new Set(allKeys));
        });
      console.log(allKeys);
    }
  }, [allCSwitchesOn]);

  useEffect(() => {
    if (allSSwitchesOn) {
      const allKeys = Object.keys(componentsAppState);
      window["localforage_store"]
        .setItem("shoppingChecked", allKeys)
        .then(() => {
          setShoppingChecked(new Set(allKeys));
        });
      console.log(allKeys);
    }
  }, [allSSwitchesOn]);

  const handleDeleteRow = (e: string) => {
    const id = parseInt(e);
    window["localforage_store"]
      .setItem("components", _.omit(componentLocalStorage, [id]))
      .then(() => {
        setComponentLocalStorage(_.omit(componentLocalStorage, [id]));
        setComponentsAppState(_.omit(componentsAppState, [id]));
      })
      .then(() => {
        const elements = document.getElementById(
          `quantity_${id}`
        ) as HTMLInputElement;
        elements.value = null;
      });
  };

  const handleQuantityChange = (e: {
    target: { id: string; value: string };
  }) => {
    const id = getID(e);
    const value = e.target.value;
    window["localforage_store"]
      .setItem("components", {
        ...componentLocalStorage,
        [id]: { quantity: parseInt(value) },
      })
      .then(() => {
        setComponentLocalStorage({
          ...componentLocalStorage,
          [id]: { quantity: parseInt(value) },
        });
        setComponentsAppState({
          ...componentsAppState,
          [id]: { ...componentsAppState[id], quantity: parseInt(value) },
        });
      })
      .then(() => {
        const elements = document.getElementById(
          `quantity_${id}`
        ) as HTMLInputElement;
        elements.value = value;
      });
  };

  const handleLocationChange = (e: { target: any }) => {
    const id = getID(e);
    const value = e.target.value;

    if (value === ",") {
      return;
    }

    if (value.includes(",")) {
      // If last character in string is a comma...
      if (value.slice(-1) === ",") {
        const newLocations = value.split(",");
        const newLocationsFiltered = newLocations.filter(function (el: string) {
          return el !== "";
        });
        // @ts-ignore
        const newLocationArray = [
          ...location[id]["location"],
          ...newLocationsFiltered,
        ];
        setLocation((prev) => {
          return {
            ...prev,
            [id]: { location: newLocationArray, remainder: "" },
          };
        });
      } else {
        const newLocations = value.split(",");
        // @ts-ignore
        const newLocationArray = [...location[id]["location"], ...newLocations];
        const newLocationArrayFiltered = newLocationArray.filter(function (el) {
          return el !== "";
        });
        setLocation((prev) => {
          return {
            ...prev,
            [id]: { location: newLocationArrayFiltered, remainder: "" },
          };
        });
      }
    } else {
      setLocation((prev) => {
        // @ts-ignore
        return {
          ...prev,
          [id]: {
            location: prev[id] ? prev[id]["location"] : [],
            remainder: value,
          },
        };
      });
    }
  };

  const handleLocationBubbleDelete = (e: { target: { id: string } }) => {
    const row_id = e.target.id.split("_")[1];
    const bubble_id = e.target.id.split("_")[2];

    // @ts-ignore
    let newLocationArray = location[row_id]["location"];
    newLocationArray.splice(bubble_id, 1);
    setLocation((prev) => {
      return {
        ...prev,
        [row_id]: { location: newLocationArray, remainder: "" },
      };
    });
  };

  //  Set internal app state from API call
  useEffect(() => {
    setComponentsAppState(_.merge(compData, componentLocalStorage));
  }, [compData]);

  useEffect(() => {
    if (location && Object.keys(location).length > 0) {
      window["localforage_store"].setItem("locations", location);
    }
  }, [location]);

  // If the "allCSwitchesOn" state is true, switch all switches to the "on" state, else "off"
  useEffect(() => {
    setAllSwitches(
      componentsAppState,
      allCSwitchesOn,
      setComponentsChecked,
      "componentsChecked",
      window["localforage_store"]
    );
  }, [allCSwitchesOn]);

  // If the "allSSwitchesOn" state is true, switch all switches to the "on" state, else "off"
  useEffect(() => {
    setAllSwitches(
      componentsAppState,
      allSSwitchesOn,
      setShoppingChecked,
      "shoppingChecked",
      window["localforage_store"]
    );
  }, [allSSwitchesOn]);

  const totalQuantityToAdd = () => {
    return (componentLocalStorage || Object.keys(componentLocalStorage).length > 0) ? (Object.keys(componentLocalStorage).reduce(
        (accumulator, currentValue) =>
            accumulator + componentLocalStorage[currentValue]["quantity"],
        0
    )) : 0
  };

  const rows = Object.keys(componentsAppState).map((value, index) => {
    return (
      <Row
        key={`${value}_${index}`}
        componentsData={componentsAppState}
        value={value}
        componentsChecked={componentsChecked}
        shoppingChecked={shoppingChecked}
        handleSwitchesChange={handleSwitchesChange}
        handleConfirmDeleteModelShow={handleConfirmDeleteModelShow}
        handleQuantityChange={handleQuantityChange}
        location={location || {}}
        handleLocationChange={handleLocationChange}
        handleLocationBubbleDelete={handleLocationBubbleDelete}
        colorList={colorList}
      />
    );
  });

  return (
    <>
      <Button
        id="components__offcanvas-button"
        className={
          !show
            ? "btn btn-success px-3 components__offcanvas-button"
            : extended
            ? "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--full"
            : "btn btn-success px-3 components__offcanvas-button components__offcanvas-button--lifted"
        }
        type="button"
        style={{ zIndex: 1045 }}
        onClick={handleOffCanvasButtonClick}
      >
        Components to Add [
        <span id="components-quantity-tab-number">
          {totalQuantityToAdd()}
        </span>
        ]
        <span className="components__offcanvas-svg">
          <svg
            id="components__offcanvas-arrow"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={
              !show
                ? "bi bi-caret-up-fill components__offcanvas-arrow"
                : "bi bi-caret-up-fill components__offcanvas-arrow--flipped"
            }
            viewBox="0 0 16 16"
          >
            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
          </svg>
        </span>
      </Button>

      {confirmDeleteShow && (
        <OnDeleteConfirmation
          // @ts-ignore
          componentsAppState={componentsAppState}
          deleteID={deleteID}
          confirmDeleteShow={confirmDeleteShow}
          handleDeleteRow={handleDeleteRow}
          handleConfirmDeleteModelClose={handleConfirmDeleteModelClose}
        />
      )}

      <Offcanvas
        id="components__offcanvas-container"
        className={
          !show
            ? "offcanvas offcanvas-bottom components__offcanvas-container"
            : extended
            ? "offcanvas offcanvas-bottom components__offcanvas-container components__offcanvas-container--full"
            : "offcanvas offcanvas-bottom components__offcanvas-container components__offcanvas-container--lifted"
        }
        aria-labelledby="offcanvasBottomLabel"
        show={show}
        onHide={handleClose}
        placement={"bottom"}
      >
        <Offcanvas.Body>
          <OverlayTrigger placement={"top"} overlay={<Tooltip>Expand</Tooltip>}>
            <Button
              variant="outline-primary"
              className={"offcanvas__buttons"}
              onClick={handleExtended}
              style={{ padding: ".375rem .575rem", marginRight: "1%" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-bar-up"
                viewBox="0 0 15 15"
                style={
                  extended
                    ? { transform: "scale(-1, -1)" }
                    : { transform: "scale(-1, 1)" }
                }
              >
                <path
                  fillRule="evenodd"
                  d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </Button>
          </OverlayTrigger>
          <Button
            variant="outline-primary"
            className={"offcanvas__buttons"}
            onClick={() => clear_app_cache(
              componentsAppState,
              setComponentsAppState,
              setComponentLocalStorage,
              setComponentsChecked,
              setShoppingChecked,
              setAllCSwitchesOn,
              setAllSSwitchesOn,
              setLocation,
              window["localforage_store"]
            )}
            style={{
              padding: ".375rem .575rem",
              border: "1px #528c69 solid",
              marginRight: "1%",
              color: "white",
            }}
            active
          >
            Clear
          </Button>
          {componentsChecked.size || shoppingChecked.size ? (
            <Button
              variant="outline-primary"
              className={"offcanvas__buttons"}
              onClick={addSelectionToList}
              style={{
                padding: ".375rem .575rem",
                border: "1px #528c69 solid",
                color: "white",
              }}
              active
            >
              Add Selection to List
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              className={"offcanvas__buttons"}
              style={{ padding: ".375rem .575rem" }}
              disabled
            >
              Add Selection to List
            </Button>
          )}
          {Object.keys(componentLocalStorage).length === 0 ? (
            <p className="my-4 text-secondary">
              No components added to the queue.
            </p>
          ) : compIsLoading ||
            !componentsAppState ||
            Object.keys(componentsAppState).length === 0 ||
            Object.keys(componentsAppState).length !==
              Object.keys(componentLocalStorage).length ? (
            <p className="my-4 text-secondary">Loading...</p>
          ) : (
            <table
              id="components__offcanvas-table"
              className="table table-sm components__offcanvas-table"
            >
              <thead
                className={"components__offcanvas-thead"}
                style={{ fontSize: "13px" }}
              >
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Supplier Item #</th>
                  <th scope="col">Quantity to Add</th>
                  <th
                    scope="col"
                    style={
                      componentsChecked.size
                        ? { width: "12%" }
                        : { display: "none" }
                    }
                  >
                    Location{" "}
                    <span
                      className="d-inline-block"
                      data-bs-toggle="tooltip"
                      title=""
                      data-bs-original-title="<span style='z-index: 99999999'>Enter location separated by commas (e.g. box 1, cell A1, etc.)</span>"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-info-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                    </span>
                  </th>
                  <th scope="col">
                    Add to Components
                    <Form style={{ fontSize: "16px" }}>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={allCSwitchesOn}
                        onChange={(e: object) =>
                          handleMetaSwitchChange(e, "components")
                        }
                      />
                    </Form>
                  </th>
                  <th scope="col">
                    Add to Shopping
                    <Form style={{ fontSize: "16px" }}>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={allSSwitchesOn}
                        onChange={(e: object) =>
                          handleMetaSwitchChange(e, "shopping")
                        }
                      />
                    </Form>
                  </th>
                  <th scope="col">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody
                id="components__offcanvas-tbody"
                style={{ fontSize: "13px" }}
              >
                {rows}
              </tbody>
            </table>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default App;
