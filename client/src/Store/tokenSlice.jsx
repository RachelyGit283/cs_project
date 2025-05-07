// import { createSlice } from '@reduxjs/toolkit'
// const i={
// token:null
// }
// const tokenSlice = createSlice({
//     name: 'token',
//     initialState: i,
//     reducers: {
//         setToken(state, action) {
//             state.token = action.payload
            
//         },
//         logOut(state, action) {
//             state.token = null;
//         }
//     }
// })

// export const { setToken, logOut } = tokenSlice.actions
// export default tokenSlice.reducer












//  import { createSlice } from '@reduxjs/toolkit';

// // טוען את ה-TOKEN מ-LocalStorage אם הוא קיים, אחרת שומר אותו כ-null
// const i = {
//     token: localStorage.getItem('authToken') || null,

// };

// const tokenSlice = createSlice({
//     name: 'token',
//     initialState: i,
//     reducers: {
//         setToken(state, action) {
//             state.token = action.payload;
//             // שמירה ב-LocalStorage
//             localStorage.setItem('authToken', action.payload);
//         },
//         logOut(state) {
//             state.token = null;
//             // מחיקת ה-TOKEN מ-LocalStorage
//             localStorage.removeItem('authToken');
//         },
//     },
// });

// export const { setToken, logOut } = tokenSlice.actions;
// export default tokenSlice.reducer;
// const i = {
//     token: null,
//      // אין צורך לטעון מ-localStorage
// };

// const TokenSlice = createSlice({
//     name: 'token',
//     initialState: i,
//     reducers: {
//         setToken(state, action) {
//             state.token = action.payload;
//         },
        
//         logOut(state) {
//             state.token = null;
//         },
//     },
// });

// export const { setToken, logOut } = TokenSlice.actions;
// export default TokenSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'
const i={
token:null,
user:{},
role:""
}
const tokenSlice = createSlice({
    name: 'token',
    initialState: i,
    reducers: {
        setToken(state, action) {
            state.token = action.payload
        },
        setUser(state, action) {
            state.user = action.payload
        },
        setRole(state, action) {
            state.role = action.payload
        },
        logOut(state, action) {
            state.token = null;
            state.user = null;
            state.role = null;

        }
    }
})

export const { setToken, logOut,setUser,setRole } = tokenSlice.actions
export default tokenSlice.reducer