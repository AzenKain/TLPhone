
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ColorDetailType, ProductType, TagsDetailType} from "@/types";
import {SearchProductDto} from "@/lib/dtos/Product";

type InitialState = {
    listProduct: ProductType[];
    productDisplay: ProductType;
    filter: SearchProductDto;
    colorList: ColorDetailType[];
    attributesList: TagsDetailType[];
}

const initialState: InitialState = {
    listProduct: [],
    colorList: [],
    attributesList: [],
    productDisplay: {
        name: "",
        id: '',
        isDisplay: false,
        details: {
            id: '',
            imgDisplay: undefined,
            color: undefined,
            variants: undefined,
            brand: undefined,
            attributes: undefined,
            description: undefined,
            tutorial: undefined
        }
    },
    filter: {
        name: "",
        rangeMoney: [0, 100000000],
        index: 1,
        count: 20,
        sort: 'updated_at_desc'
    }
}

export const ProductRedux = createSlice({
    name: 'ProductRedux',
    initialState,
    reducers: {
        RemoveAProduct: (state, action: PayloadAction<string>) => {
            state.listProduct = state.listProduct.filter(it => it.id !== action.payload);
        },
        AddAProduct: (state, action: PayloadAction<ProductType>) => {
            let indexValue2 = state.listProduct.findIndex(it => it.id === action.payload.id)
            if (indexValue2 !== -1) {
                state.listProduct[indexValue2] = action.payload
            }
            else {
                state.listProduct.push(action.payload)
            }
        },
        AddListProduct: (state, action: PayloadAction<ProductType[]>) => {
            state.listProduct = action.payload
        },
        UpdateProductDisplay: (state, action: PayloadAction<ProductType>) => {
            state.productDisplay = action.payload
        },
        UpdateFilter: (state, action: PayloadAction<SearchProductDto>) => {
            state.filter = action.payload
        },
        AddAllAttributes: (state, action: PayloadAction<TagsDetailType[]>) => {
            state.attributesList = action.payload
        },
        AddAllColor: (state, action: PayloadAction<ColorDetailType[]>) => {
            state.colorList = action.payload
        },
    }
})

export const { AddAProduct, AddListProduct, RemoveAProduct, UpdateProductDisplay, UpdateFilter, AddAllAttributes, AddAllColor } = ProductRedux.actions;

export default ProductRedux.reducer;