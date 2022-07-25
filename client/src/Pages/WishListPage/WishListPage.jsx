import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GetAllWishesList } from '../../Actions/WishListA'
import { GetCookie } from '../../Helpers/Coookies'
import { GetLocalStorage } from '../../Helpers/LocalStorage'

const WishListPage = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const { WishList } = useSelector((state) => state.WishListReducer)
    useEffect(() => {
        if (!GetCookie('checkToken')) {
            Navigate('/');
        }
        else if (GetCookie('checkToken') && GetLocalStorage("User").User !== 'Student') {
            Navigate('/');
        }
    }, [Navigate])
    useEffect(() => {
        dispatch(GetAllWishesList());
    })
    console.log(WishList);
    return (
        <div>WishListPage</div>
    )
}

export default WishListPage