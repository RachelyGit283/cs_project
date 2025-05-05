import { createSlice } from '@reduxjs/toolkit'
const i={
rolse:null
}
const rolseSlice = createSlice({
    name: 'rolse',
    initialState: i,
    reducers: {
        setRolse(state, action) {
            state.rolse = action.payload;
        },
        logOut(state, action) {
            state.rolse = null;
        }
    }
});

export const { setRolse, logOut } = rolseSlice.actions
export default rolseSlice.reducer