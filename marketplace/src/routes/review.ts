import { Router, Application } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middleware/auth";

export class ReviewRoutes {
  public reviewController: ReviewController = new ReviewController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/reviews")
      .get(this.reviewController.getAllReviews)
      .post(this.reviewController.createReview);

    app.route("/api/reviews/:id")
      .get(this.reviewController.getReviewById)
      .patch(this.reviewController.updateReview)
      .delete(this.reviewController.deleteReview);

    app.route("/api/reviews/:id/logic")
      .delete(this.reviewController.deleteReviewAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Reviews")
      .get(authMiddleware, this.reviewController.getAllReviews)
      .post(authMiddleware, this.reviewController.createReview);

    app.route("/api/ocul/Reviews/:id")
      .get(authMiddleware, this.reviewController.getReviewById)
      .patch(authMiddleware, this.reviewController.updateReview)
      .delete(authMiddleware, this.reviewController.deleteReview);

    app.route("/api/Reviews/:id/logic")
      .delete(authMiddleware, this.reviewController.deleteReviewAdv);
  }
}
