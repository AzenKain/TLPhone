import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {OrderType} from "@/types";

type InitialState = {
    value: OrderType[];
    tmpValue: OrderType[];
    filter : string;
}

const initialState: InitialState = {
    value: [],
    tmpValue: [],
    filter: "All single"
}

const compareByNewest = (a: OrderType, b: OrderType) => {
    const createdAtA = new Date(a.created_at ?? "").getTime();
    const createdAtB = new Date(a.created_at ?? "").getTime();
    if (createdAtA === undefined || createdAtB === undefined) {
        return 0;
    }
    return createdAtB - createdAtA;
};

export const OrderRedux = createSlice({
    name: 'OrderRedux',
    initialState,
    reducers: {
        AddListOrder: (state, action: PayloadAction<OrderType[]>) => {
            state.value = action.payload;
            state.value.sort(compareByNewest)
            state.tmpValue = action.payload;
        },
        UpdateOrder: (state, action: PayloadAction<OrderType>) => {
            let index = state.tmpValue.findIndex(it => it.id === action.payload.id)
            if (index === -1) {
                state.tmpValue.push(action.payload)
            }
            else {
                state.tmpValue[index] = action.payload
            }
        },
        AddFilterOrder: (state, action: PayloadAction<string>) => {
            state.filter = action.payload
            if (action.payload === "All single") {
                state.value = state.tmpValue;
            }
            else {
                state.value = state.tmpValue.filter(it => it.status?.toUpperCase() === action.payload.toUpperCase())
                state.value.sort(compareByNewest)
            }
        },
        FindById: (state, action: PayloadAction<string>) => {
            if (action.payload === "") {
                state.value = state.tmpValue;
                if (state.filter === "All single") {
                   return;
                }
                state.value = state.tmpValue.filter(it => it.status?.toUpperCase() === state.filter.toUpperCase())
                state.value.sort(compareByNewest)
                return;
            }

            state.value = state.tmpValue.filter(it =>
                it.orderUid?.toUpperCase().includes(
                    action.payload.replace(/ /g, '').toUpperCase()
                )
            );
        }
    }
})

export const { AddListOrder, AddFilterOrder, FindById, UpdateOrder } = OrderRedux.actions;

export default OrderRedux.reducer;