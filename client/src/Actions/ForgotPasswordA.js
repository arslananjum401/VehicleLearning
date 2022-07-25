import axios from "axios";
export const SendForgotPasswordreq = (ForgotInfo) => async (dispatch) => {
    if (ForgotInfo.User === undefined) {
        ForgotInfo.User = "Student"
    }
    try {
        dispatch({
            type: 'ForgotPasswordRequest',
        })
        const data = await fetch('/forgot/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ForgotInfo)

        })
        const ParsedData = await data.json()

        if (ParsedData.success === true) {
 
            dispatch({
                type: "ForgotPasswordSuccess",
                payload: ParsedData
            })
        }else if(ParsedData.success === false){
            dispatch({
                type: "ForgotPasswordFailure",
                payload: ParsedData
            })
        }
    } catch (error) {
        console.log(error)
       
    }
}




export const CheckResetToken = (ResetToken) => async (dispatch) => {

    try {

        dispatch({
            type: "CheckResetTokenRequest"
        })

        const { data } = await axios.get(`/forgot/password/${ResetToken}`)
        dispatch({
            type: "CheckResetTokenSuccess",
            payload: data
        })
    } catch (error) {
        dispatch({
            type: "CheckResetTokenFailure",
            payload: error.response.data
        })

    }
}



export const ResetPasswordA = (ResetToken,Password) => async (dispatch) => {

    try {

        dispatch({
            type: "ResetTokenRequest"
        })

        const { data } = await axios.put(`/forgot/password/${ResetToken}`,{
            Password
        })

        dispatch({
            type: "ResetTokenSuccess",
            payload: data
        })
    } catch (error) {
        dispatch({
            type: "ResetTokenFailure",
            payload: error
        })

    }
}