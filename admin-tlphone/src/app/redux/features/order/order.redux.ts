import { OrderType } from '@/types/order';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { SearchProductDto } from "@/lib/dtos/Product";
import { ConfirmOrderDto, SearchOrderDto } from "@/lib/dtos/order";

type InitialState = {
    value: OrderType[];
    itemSelect: OrderType | null;
    filter: SearchOrderDto;
    orderInput: ConfirmOrderDto;
}

const initialState: InitialState = {
  value: [],
  itemSelect: null,
  filter: {
    orderId: "",
    rangeMoney: [0, 10000000000],
    index: 0,
    count: 15,
    sort: "updated_at_desc",
  },
  orderInput: {
    orderId: 0,
    orderList: [],
  },
};

export const OrderRedux = createSlice({
    name: 'OrderRedux',
    initialState,
    reducers: {
        AddListOrder: (state, action: PayloadAction<OrderType[]>) => {
            state.value = action.payload;
        },
        UpdateOrder: (state, action: PayloadAction<OrderType>) => {
            let index2 = state.value.findIndex(it => it.id === action.payload.id) 
            if (index2 === -1) { 
                state.value.push(action.payload)
            }
            else {
                state.value[index2] = action.payload
            }
        },
        SearchOrder: (state, action: PayloadAction<SearchOrderDto>) => {
            state.filter = action.payload
        },
        UpdateOrderInput: (state, action: PayloadAction<ConfirmOrderDto>) => {
            state.orderInput = action.payload
        },
        UpdateItemSelect: (state, action: PayloadAction<OrderType | null>) => {
          state.itemSelect = action.payload
        }
    }
})

export const { AddListOrder, UpdateOrder, SearchOrder, UpdateOrderInput, UpdateItemSelect } = OrderRedux.actions;

export default OrderRedux.reducer;