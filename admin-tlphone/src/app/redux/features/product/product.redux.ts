import { ColorDetailType, ProductType, ProductVariantType, TagsDetailType } from "@/types/product";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchProductDto } from "@/lib/dtos/Product";

type InitialState = {
    value: ProductType[];
    attributesInput: TagsDetailType[];
    variantInput: ProductVariantType[];
    colorInput: ColorDetailType[];
    colorList: ColorDetailType[];
    attributesList: TagsDetailType[];
    filter: SearchProductDto;
}

const initialState: InitialState = {
    value: [],
    attributesInput: [],
    variantInput: [],
    colorInput: [],
    colorList: [],
    attributesList: [],
    filter: {
        name: "",
        rangeMoney: [0, 100000000],
        index: 0,
        count: 10,
        sort: 'updated_at_desc'
    }
}

export const ProductRedux = createSlice({
    name: 'ProductRedux',
    initialState,
    reducers: {
        RemoveAColor: (state, action: PayloadAction<ColorDetailType>) => {
            state.colorInput = state.colorInput.filter(it => it.id != action.payload.id)
        },
        AddAColor: (state, action: PayloadAction<ColorDetailType>) => {
            let indexValue2 = state.colorInput.findIndex(it => it.id === action.payload.id)
            if (indexValue2 !== -1) {
                state.colorInput[indexValue2] = action.payload
            }
            else {
                state.colorInput.push(action.payload)
            }
        },
        AddListColor: (state, action: PayloadAction<ColorDetailType[]>) => {
            state.colorInput = action.payload
        },
        RemoveAVariant: (state, action: PayloadAction<ProductVariantType>) => {
            state.variantInput = state.variantInput.filter(it => it.id != action.payload.id)
        },
        AddAVariant: (state, action: PayloadAction<ProductVariantType>) => {
            let indexValue2 = state.variantInput.findIndex(it => it.id === action.payload.id)
            if (indexValue2 !== -1) {
                state.variantInput[indexValue2] = action.payload
            }
            else {
                state.variantInput.push(action.payload)
            }
        },
        AddListVariants: (state, action: PayloadAction<ProductVariantType[]>) => {
            state.variantInput = action.payload
        },
        RemoveAAttribute: (state, action: PayloadAction<TagsDetailType>) => {
            state.attributesInput = state.attributesInput.filter(it => it.id != action.payload.id)
        },
        AddAAttribute: (state, action: PayloadAction<TagsDetailType>) => {
            let indexValue2 = state.attributesInput.findIndex(it => it.id === action.payload.id)
            if (indexValue2 !== -1) {
                state.attributesInput[indexValue2] = action.payload
            }
            else {
                state.attributesInput.push(action.payload)
            }
        },
        AddListAttributes: (state, action: PayloadAction<TagsDetailType[]>) => {
            state.attributesInput = action.payload
        },
        AddAllAttributes: (state, action: PayloadAction<TagsDetailType[]>) => {
            state.attributesList = action.payload
        },
        AddAllColor: (state, action: PayloadAction<ColorDetailType[]>) => {
            state.colorList = action.payload
        },
        RemoveProduct: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter(it => it.id !== action.payload);
        },
        AddProduct: (state, action: PayloadAction<ProductType>) => {
            let indexValue = state.value.findIndex(it => it.id === action.payload.id)
            if (indexValue !== -1) {;
                state.value[indexValue] =  action.payload
            }
            else {
                state.value.push(action.payload)
            }
        },
        AddListProduct: (state, action: PayloadAction<ProductType[]>) => {
            state.value = action.payload
        },
        UpdateFilter: (state, action: PayloadAction<SearchProductDto>) => {
            state.filter = action.payload
        }
    }
})

export const {
    RemoveProduct, AddProduct, AddListProduct, UpdateFilter,
    RemoveAAttribute, AddAAttribute, AddListAttributes,
    RemoveAVariant, AddAVariant, AddListVariants,
    RemoveAColor, AddListColor, AddAColor, AddAllAttributes, AddAllColor
} = ProductRedux.actions;

export default ProductRedux.reducer;