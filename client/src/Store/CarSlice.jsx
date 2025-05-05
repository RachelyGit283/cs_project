import { createSlice } from '@reduxjs/toolkit'

const initVal = {
    car: []
}

const CarSlice = createSlice({
    name: 'cars',
    initialState: initVal,
    reducers: {
        add:(state, action) => {
            state.car.push(action.payload);
        },
        remove:(state, action) => {
            state.car.splice(action.payload, 1);
        }
    }
})

export const { add,remove} = CarSlice.actions
export default CarSlice.reducer
