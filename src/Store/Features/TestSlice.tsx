import { createSlice } from "@reduxjs/toolkit";
// import { UseToken } from "../../Storage/UseToken";
// import api from "../../Constant/Api";
// const { setItem } = UseToken("token");
interface LoginState {
    // logins: object;
    user: any;
    load: boolean | undefined;
    error: string;
}
const initialState: LoginState = {
    // logins: getItem(),
    load: false,
    user: {},
    error: "",
};

// export const getUserInfo = createAsyncThunk("user/UserInfo", async () => {});

export const TestSlice = createSlice({
    name: "Login",
    initialState,
    reducers: {
        addToken: (state, { payload }) => {
            console.log(state, payload);
        },
    },
});

export const { addToken } = TestSlice.actions;
export default TestSlice.reducer;
