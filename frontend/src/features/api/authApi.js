import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn,  } from "../authSlice";
import { signInWithGoogle } from "../firebase";


const USER_API = "http://localhost:8080/api/user/"

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"login",
                method:"POST",
                body:inputData
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
        googleLogin: builder.mutation({
            async queryFn(_, { dispatch }) {
                try {
                    const googleResult = await signInWithGoogle();
                    
                    if (googleResult.success) {
                        // Send Google user data to your backend
                        const response = await fetch(`${USER_API}google-login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(googleResult.user)
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            dispatch(userLoggedIn({ user: data.user }));
                            return { data };
                        }
                        return { error: data.message };
                    }
                } catch (error) {
                    return { error: error.message };
                }
            }
        }),
    })
});
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginMutation,
} = authApi;