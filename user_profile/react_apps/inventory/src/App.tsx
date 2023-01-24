// @ts-ignore
import React, {useState, useEffect} from "react";
// @ts-ignore
import {useQuery} from "@tanstack/react-query";
// @ts-ignore
import Cookies from "js-cookie";
// @ts-ignore
import DataTable from 'react-data-table-component';
// @ts-ignore
import _ from 'lodash';
import {createPlaceList} from '../../../../components/react_app/src/components/Row'
// @ts-ignore
import randomColor from 'randomcolor'
import ItemQuantity from "./components/ItemQuantity";

const convertAndRemove = (input) => {
    let str = JSON.stringify(input);
    return str.replace(/("(?!\d)[^"]*"|[^\w\s])/gi, "");
}


const convertJsonStringToArray = (jsonString) => {
    let locationArray = jsonString.match(/"([^"]+)"|'([^']+)'/g).map(match => match.replace(/^(['"])(.*)\1$/, '$2'));
    if (!locationArray) {
        return <div style={{color: 'red'}}>Invalid JSON string format</div>
    }
    return locationArray;
}

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

const App = () => {

    // const [data, setData] = useState();
    // const [status, setStatus] = useState('idle');
    const [editLocationId, setEditLocationId] = useState<number | undefined>(undefined)
    const [editQuantityId, setEditQuantityId] = useState<number | undefined>(undefined)

    const [colorList] = useState(
        [...Array(20)].map(() => {
            return randomColor({luminosity: "dark"});
        })
    );

    const csrftoken = Cookies.get("csrftoken");

    const { data, status, refetch } = useQuery(['get_user_inventory'], async () => {
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

    const handleLocationEdit = (id) => {
        setEditLocationId(id)
        refetch()
    }

    const handleQuantityEdit = (id) => {
        setEditQuantityId(id)
        refetch();
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
        // let newLocationArray = location[row_id]["location"];
        // newLocationArray.splice(bubble_id, 1);
        // setLocation((prev) => {
        //   return {
        //     ...prev,
        //     [row_id]: { location: newLocationArray, remainder: "" },
        //   };
        // });
    };

    const columns = [
        {
            name: 'Component',
            selector: (row) => row['component'],
            sortable: true,
        },
        {
            name: 'Manufacturer',
            selector: (row) => row['manufacturer'],
            sortable: true,
        },
        {
            name: 'Location',
            style: {
                display: 'flex'
            },
            selector: (row) => {
                return row["location"] ? <div className={"my-2"} style={{
                    alignItems: "center",
                    flexWrap: "wrap",
                    textOverflow: "unset",
                    overflow: "auto",
                    whiteSpace: "wrap",
                    width: "100%",
                    display: "flex"
                }}>{createPlaceList(convertJsonStringToArray(row["location"]), handleLocationBubbleDelete, colorList, row["component_id"], true)}</div> : undefined
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
            sortFunction: sortQuant
        },
    ];

    const conditionalRowStyles = {
        when: true,
        style: {
            padding: '5px 0',
        },
    }

    return (
        <div className="w-100">
            {data && <DataTable
				data={data}
				columns={columns}
				onSort={(column) => {
                    const sortedData = [...data].sort((a, b) => (a[column.selector] > b[column.selector] ? 1 : -1));
                    // @ts-ignore
                    setData(sortedData);
                }}
				conditionalRowStyles={conditionalRowStyles}
			/>}
        </div>)
};
export default App;