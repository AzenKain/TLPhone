
import { UserType } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: UserType[];
    tmpValue: UserType[];
}

const initialState: InitialState = {
    value: [],
    tmpValue: []
}

export const ListUser = createSlice({
    name: 'ListUser',
    initialState,
    reducers: {
        AddListUser: (state, action: PayloadAction<UserType[]>) => {
            state.value = action.payload;
            state.tmpValue = action.payload;
        },
        UpdateAUser: (state, action: PayloadAction<UserType>) => {
            let index = state.tmpValue.findIndex(it => it.id === action.payload.id)
            if (index !== -1) {
                state.value[index] = action.payload;
                state.tmpValue[index] = action.payload;
            }
            else {
                state.value.push(action.payload);
                state.tmpValue.push(action.payload);
            }
        },
        SearchUser: (state, action: PayloadAction<{value: string, filter: string}>) => {
            console.log(action.payload)
            if (action.payload.filter == 'all') {
                state.value = state.tmpValue;
            }
            else if (action.payload.filter == "firstName") {
                state.value = state.tmpValue.filter(it => it.details?.firstName?.toLowerCase().includes(action.payload.value.toLowerCase()));
            }
            else if (action.payload.filter == "lastName") {
                state.value = state.tmpValue.filter(it => it.details?.lastName?.toLowerCase().includes(action.payload.value.toLowerCase()));
            }
            else if (action.payload.filter == "phoneNumber") {
                state.value = state.tmpValue.filter(it => it.details?.phoneNumber?.toLowerCase().includes(action.payload.value.toLowerCase()));
            }
            else if (action.payload.filter == "email") {
                state.value = state.tmpValue.filter(it => it.email?.toLowerCase().includes(action.payload.value.toLowerCase()));
            }
        }
    }
})

export const { AddListUser, UpdateAUser, SearchUser } = ListUser.actions;

export default ListUser.reducer;