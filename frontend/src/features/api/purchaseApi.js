import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "https://e-learning-mbha.onrender.com/api/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // 1. Create PayPal checkout session
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),

    // 2. Capture PayPal payment - FIXED
    capturePayment: builder.mutation({
      query: (payload) => {
        // Log what we're receiving from the component
        console.log("RTK capturePayment received payload:", payload);
        
        // Handle both formats: string or {orderId: string}
        const orderId = typeof payload === 'string' ? payload : payload.orderId;
        
        console.log("Normalized orderId for API request:", orderId);
        
        return {
          url: "/checkout/capture-payment",
          method: "POST",
          body: { orderId },
        };
      },
    }),

    // 3. Get course details + purchase status
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    // 4. Get all purchased courses
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCapturePaymentMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;