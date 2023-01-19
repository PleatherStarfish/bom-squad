// @ts-ignore
import React, {useState, useEffect} from "react";
// @ts-ignore
import {useQuery} from "@tanstack/react-query";
// @ts-ignore
import Cookies from "js-cookie";
// @ts-ignore
import DataTable from 'react-data-table-component';


const App = () => {

    const [data, setData] = useState();
    const [status, setStatus] = useState('idle');
    const [editLocationId, setEditLocationId] = useState<number | undefined>(undefined)

    const csrftoken = Cookies.get("csrftoken");

    const handleEdit = (id) => {
        setEditLocationId(id)
    }

    useEffect(() => {
        const fetchData = async () => {
            setStatus('loading');
            try {
                const res = await fetch(`/users/user_inventory/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    }
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setData(data);
                    setStatus('success');
                } else {
                    throw new Error(res.statusText);
                }
            } catch (error) {
                setStatus('error');
                console.log(error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
    if (data && data["location"]) {
      // @ts-ignore
      const locationList = data["location"].split(",")
      const arrayLength = locationList.length;
      console.log(arrayLength)

      // const placeList = location[value]["location"].map(
      //   (name: string, index: React.Key) => {
      //     let close = null;
      //     if (index !== arrayLength - 1) {
      //       close = (
      //         <svg
      //           xmlns="http://www.w3.org/2000/svg"
      //           width="16"
      //           height="16"
      //           fill="currentColor"
      //           className="bi bi-arrow-right"
      //           viewBox="0 0 16 16"
      //         >
      //           {" "}
      //           <path
      //             fillRule="evenodd"
      //             d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
      //           />{" "}
      //         </svg>
      //       );
      //     }
      //
      //     return (
      //       <div
      //         key={index}
      //         style={{ display: "inline-block", whiteSpace: "nowrap" }}
      //       >
      //         <>
      //           <div
      //             style={{
      //               fontSize: "10px",
      //               display: "inline-block",
      //               padding: "3px 6px",
      //               color: "white",
      //               backgroundColor: colorList[index] || "gray",
      //               border: "1px solid black",
      //               borderRadius: ".8em",
      //               margin: "3px 0 0 0",
      //             }}
      //           >
      //             <b>{name}</b>
      //             <CloseButton
      //               id={`deleteLocationButton_${value}_${index}`}
      //               style={{ fontSize: "0.8em", marginLeft: "3px" }}
      //               variant="white"
      //               onClick={(e: object) => handleLocationBubbleDelete(e)}
      //             />
      //           </div>
      //           {close}
      //         </>
      //       </div>
      //     );
      //   }
      // );
      // setLocationList(placeList);
    }
  }, [data])

    if (status === 'loading') {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        return <div>Error: {status}</div>
    }

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
            selector: (row) => row['location'],
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (item) => {
                return (<div className="d-flex justify-content-between"
                            style={{width: "100px"}}>{editLocationId !== item.id ?
                    <><span>{item.quantity}</span>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-1 px-2"
                                onClick={() => handleEdit(item.id)}>edit
                        </button>
                    </> :
                    <><input className='w-50 me-1'
                             type="number"
                             value={item.quantity} min="0" style={{minWidth: "50px"}}/>
                        <button type="button" className="btn btn-outline-secondary py-1 px-2">update</button>
                    </>
                }
                </div>)
            },
            sortable: true,
        },
    ];

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
			/>}
        </div>)
};
export default App;