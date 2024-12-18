
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
    },
  },
};

export const UserRedux = createSlice({
    name: 'UserRedux',
    initialState,
    reducers: {
      UpdateUser: (state, action: PayloadAction<UserType | null>) => {
          if (action.payload == null) {
              return initialState
          }
          state.value = action.payload
      },

    }
})

export const { UpdateUser } = UserRedux.actions;

export default UserRedux.reducer;