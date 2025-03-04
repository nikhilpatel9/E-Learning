import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { signInWithGoogle } from "../firebase";

const USER_API = "http://localhost:8080/api/user/";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.error("Login failed:", error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET"
            }),
            async onQueryStarted(_, { dispatch}) {
                try { 
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        googleLogin: builder.mutation({
            async queryFn(_, { dispatch }) {
                try {
                    const googleResult = await signInWithGoogle();
                    if (!googleResult.success) {
                        return { error: { message: "Google Sign-In failed" } };
                    }
        
                    const response = await fetch(`${USER_API}google-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(googleResult.user)
                    });
        
                    const data = await response.json();
                    if (!data.success) {
                        return { error: { message: data.message || "Google login failed" } };
                    }
        
                    dispatch(userLoggedIn({ user: data.user }));
                    localStorage.setItem("user", JSON.stringify(data.user)); // Persist user data
        
                    return { data };
                } catch (error) {
                    return { error: { message: error.message || "Something went wrong" } };
                }
            }
        }),
        
        loadUser: builder.query({
            query: () => ({
                url: "profile",
                method: "GET",
                
               
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData,
                credentials: "include"
            })
        })
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;
