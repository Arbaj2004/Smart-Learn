import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        updateProfilePic: (state, action) => {
            if (state.user) {
                state.user.profilePic = action.payload;
                // Update localStorage with the new state
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
});

export const { loginSuccess, logout, updateProfilePic } = userSlice.actions;

export default userSlice.reducer;