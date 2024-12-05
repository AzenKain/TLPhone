
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  SchemaProductDetailType, SchemaProductType } from "@/types";

type InitialState = {
  value: SchemaProductType[];
  tmpValue: SchemaProductType[];
  detailsInput: SchemaProductDetailType[]
}

const initialState: InitialState = {
  value: [],
  tmpValue: [],
  detailsInput: []
}

export const CategoryRedux = createSlice({
  name: 'CategoryRedux',
  initialState,
  reducers: {
    RemoveADetail: (state, action: PayloadAction<SchemaProductDetailType>) => {
      state.detailsInput = state.detailsInput.filter(it => it.id != action.payload.id)
    },
    AddADetail: (state, action: PayloadAction<SchemaProductDetailType>) => {
      let indexValue2 = state.detailsInput.findIndex(it => it.id === action.payload.id)
      if (indexValue2 !== -1) {
        state.detailsInput[indexValue2] = action.payload
      }
      else {
        state.detailsInput.push(action.payload)
      }
    },
    AddListDetail: (state, action: PayloadAction<SchemaProductDetailType[]>) => {
      state.detailsInput = action.payload
    },
    RemoveACategory: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(it => it.id !== action.payload);
      state.tmpValue = state.tmpValue.filter(it => it.id !== action.payload);
    },
    AddACategory: (state, action: PayloadAction<SchemaProductType>) => {
      let indexValue = state.value.findIndex(it => it.id === action.payload.id)
      if (indexValue !== -1) {
        let newProductList = [...state.value];
        newProductList[indexValue] = action.payload;
        state.value = newProductList
      }
      else {
        let newProductList = [...state.value, action.payload]
        state.value = newProductList
      }
      let indexValue2 = state.tmpValue.findIndex(it => it.id === action.payload.id)
      if (indexValue2 !== -1) {
        state.tmpValue[indexValue2] = action.payload
      }
      else {
        state.tmpValue.push(action.payload)
      }
    },
    AddListCategory: (state, action: PayloadAction<SchemaProductType[]>) => {
      let newProductList = [...action.payload]
      state.value = newProductList
      state.tmpValue = newProductList
    },
    SearchCategory: (state, action: PayloadAction<{value: string, filter: string}>) => {
      if (action.payload.filter == 'all') {
        state.value = state.tmpValue;
      }
      else if (action.payload.filter == "id") {
        state.value = state.tmpValue.filter(it => it.id?.toLowerCase().includes(action.payload.value.toLowerCase()));
      }
      else if (action.payload.filter == "name") {
        state.value = state.tmpValue.filter(it => it.name?.toLowerCase().includes(action.payload.value.toLowerCase()));
      }
      else if (action.payload.filter == "category") {
        state.value = state.tmpValue.filter(it => it.category?.toLowerCase().includes(action.payload.value.toLowerCase()));
      }
    }
  }
})

export const {SearchCategory, AddACategory, AddListCategory, RemoveACategory, AddListDetail, AddADetail, RemoveADetail  } = CategoryRedux.actions;

export default CategoryRedux.reducer;