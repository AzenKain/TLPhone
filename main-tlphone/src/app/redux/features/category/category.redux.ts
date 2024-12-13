
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SchemaProductType } from "@/types";

type InitialState = {
  value: SchemaProductType[];
  categoryDisplay: SchemaProductType;
}

const initialState: InitialState = {
  value: [],
  categoryDisplay: {
    id: '-1',
    name: '',
    isDisplay: false,
    detail: []
  }
}

export const CategoryRedux = createSlice({
  name: 'CategoryRedux',
  initialState,
  reducers: {

    RemoveACategory: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(it => it.id !== action.payload);
    },
    AddACategory: (state, action: PayloadAction<SchemaProductType>) => {
      let indexValue2 = state.value.findIndex(it => it.id === action.payload.id)
      if (indexValue2 !== -1) {
        state.value[indexValue2] = action.payload
      }
      else {
        state.value.push(action.payload)
      }
    },
    AddListCategory: (state, action: PayloadAction<SchemaProductType[]>) => {
      state.value = action.payload
    },
    UpdateCategoryDisplay: (state, action: PayloadAction<SchemaProductType>) => {
      state.categoryDisplay = action.payload
    }
  }
})

export const { AddACategory, AddListCategory, RemoveACategory, UpdateCategoryDisplay  } = CategoryRedux.actions;

export default CategoryRedux.reducer;