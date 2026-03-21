import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  mobile: string;
  currentStep: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        mobile: string;
        currentStep: number;
      }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        mobile: action.payload.mobile,
        currentStep: action.payload.currentStep,
      };
      state.loading = false;
    },

    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('mobile');
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const mobile = localStorage.getItem('mobile');
      const currentStepStr = localStorage.getItem('currentStep');

      if (token && mobile) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = {
          mobile,
          currentStep: currentStepStr ? parseInt(currentStepStr, 10) : 1,
        };
      }
      state.loading = false;
    },

    // Update current step
    updateStep: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.currentStep = action.payload;
        localStorage.setItem('currentStep', action.payload.toString());
      }
    },
  },
});

export const { loginSuccess, logout, initializeAuth, updateStep } = authSlice.actions;
export default authSlice.reducer;
