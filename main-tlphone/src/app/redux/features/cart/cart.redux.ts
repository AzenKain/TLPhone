
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SchemaProductType } from "@/types";

type InitialState = {
    shippingMethod: string;
    shippingFee: Record<string, number>;
}

const initialState: InitialState = {
    shippingMethod: "standard",
    shippingFee: {
        "standard" : 25000,
        "fast": 75000
    }
}

export const CartRedux = createSlice({
    name: 'CartRedux',
    initialState,
    reducers: {

        UpdateShippingMethod: (state, action: PayloadAction<string>) => {
            const method = ["fast", 'standard']
            if (method.push(action.payload)) {
                state.shippingMethod = action.payload
            }
        }
    }
})

export const { UpdateShippingMethod } = CartRedux.actions;

export default CartRedux.reducer;