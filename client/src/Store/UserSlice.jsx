// import { createSlice } from '@reduxjs/toolkit'

// const initVal = {
//     user: {}
// }

// const UserSlice = createSlice({
//     name: 'user',
//     initialState: initVal,
//     reducers: {
//         add:(state, action) => {
//             state.user=action.payload;
//         },
//         remove:(state, action) => {
//             state.car={};
//         }
//     }
// })

// export const { add,remove} = UserSlice.actions
// export default UserSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
const i={
    user:null
}
const UserSlice = createSlice({
    name: 'user',
    initialState: i,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        logOut(state, action) {
            state.user = null;
        }
    }
});

export const { setUser, logOut } = UserSlice.actions
export default UserSlice.reducer