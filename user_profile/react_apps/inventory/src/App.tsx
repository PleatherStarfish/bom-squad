// @ts-ignore
import React, {useEffect, useState} from "react";
// @ts-ignore
import {useMutation, useQuery} from "@tanstack/react-query";
// @ts-ignore
import Cookies from "js-cookie";
// @ts-ignore
import DataTable from 'react-data-table-component';
// @ts-ignore
import _ from 'lodash';
// @ts-ignore
import randomColor from 'randomcolor'
import ItemQuantity from "./components/ItemQuantity";
import Location from "./components/Location"
// @ts-ignore
import { Button } from 'react-bootstrap'
import OnDeleteConfirmation from "./components/OnDeleteConfirmation";

const convertAndRemove = (input) => {
    let str = JSON.stringify(input);
    return str.replace(/("(?!\d)[^"]*"|[^\w\s])/gi, "");
}

const convertJsonStringToArray = (jsonString: string): string[] => {
    try {
        return jsonString.match(/"([^"]+)"|'([^']+)'/g).map(match => match.replace(/^(['"])(.*)\1$/, '$2'));
    } catch {
        return []
    }
}

const customStyles = {
    cells: {
        style: {
            width: '100%',
        },
    },
};

export const getID = (e: { target: { id: string } }) =>
    e.target.id.split("_")[1];

const App = () => {

    const [editLocationId, setEditLocationId] = useState<number | undefined>(undefined)
    const [editQuantityId, setEditQuantityId] = useState<number | undefined>(undefined)

    const [location, setLocation] = useState({});

    const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    const [colorList] = useState(['#538b69',
        '#4a7f5f',
        '#417355',
        '#38674b',
        '#305b42',
        '#275039',
        '#1f4530',
        '#173a27',
        '#102f1e',
        '#082516'
    ]);

    const csrftoken = Cookies.get("csrftoken");

    const {data, status, refetch} = useQuery(['get_user_inventory'], async () => {
        const res = await fetch(`/users/user_inventory/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        });
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error(res.statusText);
        }
    });

    const {mutate: deleteMutate, status: deleteStatus} = useMutation(async (id) => {
        const response = await fetch(`/users/delete_inventory_item/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        });
        return response.json();
    }, {
        onSuccess: (response) => {
            refetch()
        }
    });

    const sortLocationsAlpha = (rowA, rowB) => {
        const a = convertAndRemove(rowA["location"]);
        const b = convertAndRemove(rowB["location"]);

        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }

        return 0;
    };

    const sortQuant = (rowA, rowB) => {
        const a = parseInt(rowA["quantity"]);
        const b = parseInt(rowB["quantity"]);

        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }

        return 0;
    };

    const handleLocationEditButtonClick = (id, locationArray) => {
        setEditLocationId(id)
        setLocation({[id]: {location: [...locationArray], remainder: ""}})
    }

    const handleLocationChange = (e) => {
        const id = getID(e);
        const value = e.target.value;

        if (value === ",") return;

        const newLocations = value.split(",").filter(el => el !== "");
        const newLocationArray = value.includes(",")
            ? [...location[id].location, ...newLocations]
            : [...(location[id]?.location || [])];

        setLocation((prev) => ({
            ...prev,
            [id]: {location: newLocationArray, remainder: value.includes(",") ? "" : value},
        }));
    };

    useEffect(() => refetch(), [location])
    useEffect(() => refetch(), [editQuantityId])

    const handleQuantityEdit = (id) => {
        setEditQuantityId(id)
    }

    if (status === 'loading') {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        return <div>Error: {status}</div>
    }

    const handleLocationBubbleDelete = (e: { target: { id: string } }) => {
        const row_id = e.target.id.split("_")[1];
        const bubble_id = e.target.id.split("_")[2];

        // @ts-ignore
        let newLocationArray = location[row_id]["location"];
        newLocationArray.splice(bubble_id, 1);
        setLocation((prev) => {
            return {
                ...prev,
                [row_id]: {location: newLocationArray, remainder: ""},
            };
        });
    };

    // Open popup to confirm delete
    const handleConfirmDeleteModelShow = (e) => {
      console.log(e)
      setDeleteID(e);
      setConfirmDeleteShow(true);
    };

    // Close popup to confirm delete
    const handleConfirmDeleteModelClose = () => setConfirmDeleteShow(false);

    const columns = [
        {
            name: 'Component',
            selector: (item) => item['component'],
            sortable: true,
        },
        {
            name: 'Manufacturer',
            selector: (item) => item['manufacturer'],
            sortable: true,
        },
        {
            name: 'Location',
            selector: (item) => {
                return <Location
                    handleLocationBubbleDelete={handleLocationBubbleDelete}
                    colorList={colorList}
                    item={item}
                    editLocationId={editLocationId}
                    handleEdit={handleLocationEditButtonClick}
                    handleLocationChange={handleLocationChange}
                    locationArray={item.id in location ? location[item.id]["location"] : convertJsonStringToArray(item["location"])}
                    location={location[item.id]}/>
            },
            sortable: true,
            sortFunction: sortLocationsAlpha
        },
        {
            name: 'Quantity',
            selector: (item) => {
                return (<ItemQuantity item={item} editQuantityId={editQuantityId} handleEdit={handleQuantityEdit}/>)
            },
            sortable: true,
            sortFunction: sortQuant,
            maxWidth: "200px",
        },
        {
            name: "Delete",
            selector: (item) => {
                return (<div className={"h-100"} style={{verticalAlign: "middle"}}>
                    <Button
                        className="components__offcanvas-remove-btn"
                        variant="outline-danger"
                        size="sm"
                        id={`rowDelete_${item.id}`}
                        onClick={() => handleConfirmDeleteModelShow(item['id'])}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </Button>
                </div>)
            },
            sortable: false,
            maxWidth: "80px",
        },

    ];

    const conditionalRowStyles = {
        when: true,
        style: {
            padding: '5px 0',
            width: '100%',
        },
    }

    return (
        <div className="w-100">
            {data && <DataTable
				data={data}
				columns={columns}
				conditionalRowStyles={conditionalRowStyles}
				customStyles={customStyles}
			/>}
            {confirmDeleteShow && (
                <OnDeleteConfirmation
                  componentsAppState={data}
                  deleteID={deleteID}
                  confirmDeleteShow={confirmDeleteShow}
                  handleDeleteRow={deleteMutate}
                  handleConfirmDeleteModelClose={handleConfirmDeleteModelClose}
                />
            )}
        </div>)
};
export default App;