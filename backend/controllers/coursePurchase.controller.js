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
            value: (course.coursePrice).toFixed(2),
          },
          description: course.courseTitle,
        },
      ],
      application_context: {
        return_url: `http://localhost:5173/course-progress/${courseId}`,
        cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      },
    });

    const order = await client.execute(request);

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.result.id,
    });
    await newPurchase.save();

    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;

    return res.status(200).json({
      success: true,
      url: approvalUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    const capture = await client.execute(captureRequest);

    const purchase = await CoursePurchase.findOne({
      paymentId: orderId,
    }).populate({ path: "courseId" });

    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    purchase.status = "completed";
    purchase.amount = capture.result.purchase_units[0].payments.captures[0].amount.value;
    await purchase.save();

    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } }
    );

    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } }
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

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(404).json({ purchasedCourse: [] });
    }

    return res.status(200).json({ purchasedCourse });
  } catch (error) {
    console.log(error);
  }
};