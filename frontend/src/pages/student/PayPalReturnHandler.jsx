/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCapturePaymentMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


const PayPalReturnHandler = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [debugInfo, setDebugInfo] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [capturePayment, { isLoading, isSuccess, isError, error }] = useCapturePaymentMutation();
  
  useEffect(() => {
   
    const urlParams = new URLSearchParams(location.search)
    const allParams = {};
    urlParams.forEach((value, key) => {
      allParams[key] = value;
    });
    const orderId = urlParams.get("token") || urlParams.get("orderID") || urlParams.get("paymentId");
    const debugData = {
      fullUrl: window.location.href,
      searchParams: location.search,
      allParams,
      extractedOrderId: orderId
    };
    setDebugInfo(debugData);
    
    
    if (!orderId) {
      console.error("No order ID found in URL parameters");
      setPaymentStatus("failed");
      toast.error("Payment information missing from URL");
      setTimeout(() => {
        navigate(`/course-detail/${courseId}`);
      }, 5000);
      return;
    }
    
    // Capture the payment
    const handlePaymentCapture = async () => {
      try {
       
        // Try with explicit object structure
        const response = await capturePayment({ orderId }).unwrap();
        
        
        setPaymentStatus("completed");
      } catch (err) {
        console.error("Payment capture failed:", err);
        console.error("Error details:", {
          status: err?.status,
          data: err?.data,
          message: err?.message,
          error: err
        });
        setPaymentStatus("failed");
      }
    };
    
    handlePaymentCapture();
  }, [courseId, location.search, capturePayment, navigate]);
  
  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment successful! You now have access to this course.");
    }
    
    if (isError) {
      console.error("RTK Query error:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message || error?.error
      });
      
      toast.error(error?.data?.message || "Payment processing failed");
      setTimeout(() => {
        navigate(`/course-detail/${courseId}`);
      }, 5000);
    }
  }, [isSuccess, isError, error, navigate, courseId]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {isLoading || paymentStatus === "processing" ? (
        <>
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <h2 className="mt-4 text-2xl font-bold">Processing Your Payment</h2>
          <p className="mt-2 text-muted-foreground">
            Please wait while we confirm your payment with PayPal...
          </p>
        </>
      ) : paymentStatus === "completed" ? (
        <>
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Payment Successful!</h2>
          <p className="mt-2 text-muted-foreground">
            You now have full access to this course.
          </p>
          <button
            onClick={() => navigate(`/course-progress/${courseId}`)}
            className="mt-6 px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md border border-transparent
                        bg-gradient-to-r from-blue-600 to-blue-500 text-white
                        hover:from-blue-700 hover:to-blue-600 hover:shadow-lg
                        dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500
                        focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
            🚀 Start Learning
            </button>

        </>
      ) : (
        <>
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Payment Failed</h2>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t process your payment. You&apos;ll be redirected back to the course page.
          </p>
          
          {/* Debug Information (only in development) */}
          {import.meta.env.NODE_ENV !== 'production' && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md w-full max-w-lg">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
              {error && (
                <>
                  <h3 className="font-semibold mt-3 mb-2">Error Details:</h3>
                  <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded">
                    {JSON.stringify({
                      status: error?.status,
                      data: error?.data,
                      message: error?.message || error?.error
                    }, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PayPalReturnHandler;