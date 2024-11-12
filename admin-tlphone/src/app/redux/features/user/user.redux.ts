
import { UserType } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: UserType;
}

const initialState: InitialState = {
    value: {
        imgDisplay: "http://localhost:3434/media/file/user.png",
        heart: []
    }
}

export const UserRedux = createSlice({
    name: 'UserRedux',
    initialState,
    reducers: {
        UpdateUser: (state, action: PayloadAction<UserType>) => {
            return {
                value: {
                    ...action.payload
                }
            }
        },
        AddHeart: (state, action: PayloadAction<string>) => {
            if (!state.value.heart.includes(action.payload)) state.value.heart.push(action.payload);
        },
        RemoveHeart: (state, action: PayloadAction<string>) => {
            state.value.heart = state.value.heart.filter(it => it !== action.payload)
        }
    }
})

export const { UpdateUser, AddHeart, RemoveHeart } = UserRedux.actions;

export default UserRedux.reducer;