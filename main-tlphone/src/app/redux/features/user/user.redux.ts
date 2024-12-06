
import { UserType } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: UserType;
}

const initialState: InitialState = {
  value: {
    details: {
      id: "-1",
      imgDisplay: "/images/user/user-06.png",
    },
    heart: [],
    id: "-1",
    email: "",
    secretKey: "",
    isDisplay: false,
    role: [],
    cart: {
      id: "-1",
      cartProducts: [],
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
};

export const UserRedux = createSlice({
    name: 'UserRedux',
    initialState,
    reducers: {
      UpdateUser: (state, action: PayloadAction<UserType>) => {
        state.value = action.payload
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