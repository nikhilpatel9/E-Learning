import paypal from "@paypal/checkout-server-sdk";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// ✅ Create Checkout Session (No DB entry here)
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
     
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: course.coursePrice.toFixed(2),
          },
          description: course.courseTitle,
          custom_id: JSON.stringify({ userId, courseId }), // ⬅️ Store metadata
        },
      ],
      
      application_context: {
        // UPDATED: Return URL now points to our payment handler
        return_url: `https://e-learning-mbha.onrender.com/payment/success/${courseId}`,
        cancel_url: `https://e-learning-mbha.onrender.com/course-detail/${courseId}`,
      },
    });

    const order = await client.execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === "approve")?.href;

    return res.status(200).json({
      success: true,
      url: approvalUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// ✅ Capture Payment and Create Purchase
export const capturePayment = async (req, res) => {
  try {
   
    const { orderId } = req.body;
    
    if (!orderId) {
      console.error("Missing orderId in request body:", req.body);
      return res.status(400).json({ 
        message: "Missing order ID in request", 
        receivedPayload: req.body 
      });
    }

    
    const existingPurchase = await CoursePurchase.findOne({ paymentId: orderId });
    if (existingPurchase) {
      
      return res.status(200).json({ 
        success: true,
        message: "Payment already processed",
        purchase: existingPurchase
      });
    }

    
    try {
      // Create and execute the PayPal capture request
      const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
      captureRequest.requestBody({});
       const capture = await client.execute(captureRequest);
      
      // Extract metadata from the order
      const customIdRaw = capture.result.purchase_units[0].payments;
        const customId = customIdRaw.captures[0].custom_id;
       
      
      let metadata;
      try {
        metadata = JSON.parse(customId || "{}");
        
      } catch (jsonError) {
        console.error("Error parsing custom_id JSON:", jsonError, "Raw value:", customIdRaw);
        return res.status(400).json({ 
          message: "Error parsing order metadata", 
          rawCustomId: customIdRaw 
        });
      }
      
      const { userId, courseId } = metadata;
      
      if (!userId || !courseId) {
        console.error("Missing userId or courseId in metadata:", metadata);
        return res.status(400).json({ 
          message: "Missing userId or courseId in metadata", 
          metadata: metadata 
        });
      }
      
      // Look up the course
    
      const course = await Course.findById(courseId);
      if (!course) {
        console.error("Course not found with ID:", courseId);
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Look up the user
     
      const user = await User.findById(userId);
      if (!user) {
       
        return res.status(404).json({ message: "User not found" });
      }

      
      try {
        const newPurchase = new CoursePurchase({
          courseId,
          userId,
          amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
          status: "completed",
          paymentId: orderId,
        });
        
        await newPurchase.save();
        
      } catch (dbError) {
        console.error("Error creating purchase record:", dbError);
        return res.status(500).json({ 
          message: "Failed to create purchase record", 
          error: dbError.message 
        });
      }

      // Update lecture access
      try {
        if (course.lectures && course.lectures.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: course.lectures } },
            { $set: { isPreviewFree: true } }
          );
         
        }
      } catch (lectureError) {
        console.error("Error updating lecture access:", lectureError);
        // Continue with the process even if this fails
      }

      // Update user enrolled courses
      try {

        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { enrolledCourses: courseId } }
        );
        
      } catch (userError) {
        console.error("Error updating user enrolled courses:", userError);
        // Continue with the process even if this fails
      }

      // Update course enrolled students
      try {
       
        await Course.findByIdAndUpdate(
          courseId,
          { $addToSet: { enrolledStudents: userId } }
        );
       
      } catch (courseError) {
        console.error("Error updating course enrolled students:", courseError);
        // Continue with the process even if this fails
      }

      // Return success response
     
      return res.status(200).json({
        success: true,
        message: "Payment captured and course access granted"
      });
      
    } catch (paypalError) {
      console.error("PayPal API error:", paypalError);
      
      // More detailed error response
      let errorDetails = {
        name: paypalError.name,
        message: paypalError.message
      };
      
      if (paypalError.statusCode) {
        errorDetails.statusCode = paypalError.statusCode;
      }
      
      if (paypalError.details) {
        errorDetails.details = paypalError.details;
      }
      
      return res.status(400).json({ 
        message: "PayPal payment capture failed", 
        paypalError: errorDetails 
      });
    }
  } catch (error) {
    console.error("Server error in capturePayment:", error);
    return res.status(500).json({ 
      message: "Server error processing payment", 
      error: error.message 
    });
  }
};
// ✅ Check course detail & whether it's purchased (only 'completed')
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all completed purchases
export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({ purchasedCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};