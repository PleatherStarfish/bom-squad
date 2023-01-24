import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { useMutation } from '@tanstack/react-query'
// @ts-ignore
import Cookies from 'js-cookie'

const ItemQuantity = ({ item, editQuantityId, handleEdit }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const csrftoken = typeof Cookies.get("csrftoken") === 'string' ? Cookies.get("csrftoken") : '';

    const { mutate, status } = useMutation(async () => {
        const response = await fetch(`/users/update_inventory_quantity/${item.id}`, {
            method: "PATCH",
            body: JSON.stringify({quantity}),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        });
        return response.json();
    }, {
        onSuccess: () => {
            handleEdit(undefined);
            setQuantity(quantity);
        }
    });

    return (
        <div className="d-flex justify-content-between overflow-visible"
             style={editQuantityId !== item.id ? {width: "100px"} : {width: "130px"}}>
            {editQuantityId !== item.id ?
                <>
                    <span>{item.quantity}</span>
                    <button type="button" className="btn btn-sm btn-outline-secondary py-1 px-2"
                            onClick={() => handleEdit(item.id)}>edit
                    </button>
                </> :
                <>
                    <input className='w-50 me-1'
                           type="number"
                           value={quantity}
                           min="0"
                           style={{minWidth: "50px"}}
                           onChange={e => setQuantity(e.target.value)}
                    />
                    <button type="button" className="btn btn-sm btn-outline-secondary py-1 px-2"
                            onClick={() => mutate()}>{status === 'loading' ? 'loading...' : 'update'}
                    </button>
                </>
            }
        </div>
    );
}

export default ItemQuantity;
