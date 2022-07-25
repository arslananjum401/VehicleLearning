import axios from "axios";

export const AddToWishList = (Wish) => async (dispatch) => {

    try {
        dispatch({
            type: "AddWishRequest"
        });

        const { data } = await axios.post('/wishlist',
            { Wish }
        );


        dispatch({
            type: "AddWishSuccess",
            payload: data
        });
    } catch (error) {
        dispatch({
            type: "AddWishFailure",
            padload: error
        })
    }

}
export const GetAllWishesList = () => async (dispatch) => {

    try {
        dispatch({
            type: "GetAllWishesRequest"
        });

        const { data } = await axios.get('/wishlist' );


        dispatch({
            type: "GetAllWishesSuccess",
            payload: data
        });
    } catch (error) {
        dispatch({
            type: "GetAllWishesFailure",
            padload: error
        })
    }

}
export const RemoveFromWishList = (WishId) => async (dispatch) => {

    try {
        dispatch({
            type: "RemoveWishRequest"
        });

        const {data}  = await axios.delete('/wishlist',{ data: {WishId} });

console.log(data);
        dispatch({
            type: "RemoveWishSuccess",
            payload: data
        });
    } catch (error) {
        dispatch({
            type: "RemoveWishFailure",
            padload: error
        })
    }

}