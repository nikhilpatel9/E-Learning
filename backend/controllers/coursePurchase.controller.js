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
        
        return_url: `http://localhost:5173/course-progress/${courseId}`,
        cancel_url: `http://localhost:5173/course-detail/${courseId}`,
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

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});
    const capture = await client.execute(captureRequest);

    const metadata = JSON.parse(capture.result.purchase_units[0].custom_id || "{}");
    const { userId, courseId } = metadata;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Invalid order metadata" });
    }

    const existingPurchase = await CoursePurchase.findOne({ paymentId: orderId });
    if (existingPurchase) {
      return res.status(400).json({ message: "Payment already captured" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
      status: "completed",
      paymentId: orderId,
    });
    await newPurchase.save();

    if (course.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } }
    );

    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Payment captured and course access granted",
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    return res.status(500).json({ message: "Payment capture failed" });
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