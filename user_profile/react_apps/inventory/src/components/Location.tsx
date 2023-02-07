import React, {useEffect} from 'react';
// @ts-ignore
import {useMutation} from '@tanstack/react-query'
// @ts-ignore
import Cookies from 'js-cookie'
// @ts-ignore
import {createPlaceList} from '../../../../../components/react_app/src/components/Row'
// @ts-ignore
import {DebounceInput} from 'react-debounce-input';

const Location = ({
                      handleLocationBubbleDelete,
                      colorList,
                      item,
                      editLocationId,
                      handleEdit,
                      handleLocationChange,
                      locationArray,
                      location
                  }) => {

    const locationList = createPlaceList(
        locationArray,
        handleLocationBubbleDelete,
        colorList,
        item["component_id"],
        true)

    const csrftoken = typeof Cookies.get("csrftoken") === 'string' ? Cookies.get("csrftoken") : '';

    const {mutate: updateMutate, status: updateStatus} = useMutation(async () => {
        const response = await fetch(`/users/update_inventory_location/${item.id}`, {
            method: "PATCH",
            body: JSON.stringify({component_id: item["component_id"], location: locationArray}),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        });
        return response.json();
    }, {
        onSuccess: (response) => {
            console.log(response.json())
        }
    });

    useEffect(() => updateMutate(), [locationArray])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center overflow-visible">
                {editLocationId !== item.id ?
                        <>
                            {!!locationList.length && <div className="d-flex align-items-center flex-wrap overflow-auto white-space-wrap my-2">
                                {locationList}
                            </div>}
                            <button type="button"
                                    style={{maxHeight: "31px", marginLeft: !!locationList.length ? "15px" : "0"}}
                                    className="btn btn-sm btn-outline-secondary h-auto py-1"
                                    onClick={() => handleEdit(item.id, locationArray)}>{!!locationList.length ? "edit" : "add location"}
                            </button>
                        </> :
                        <div className="d-flex flex-column mt-2">
                            <div className="d-flex w-75">
                                <DebounceInput className='w-100 me-1'
                                       id={`location_${item.id}`}
                                       value={location.remainder || ""}
                                       type="text"
                                       onChange={(event) => handleLocationChange(event)}
                                />
                            </div>
                            <div className="d-flex align-items-center flex-wrap overflow-auto white-space-wrap my-2">
                                {locationList}
                            </div>
                        </div>
                }
            </div>
        </>
    );
}

export default Location;
