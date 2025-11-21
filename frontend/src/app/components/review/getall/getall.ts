import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReviewI } from '../../../models/review';
import { ReviewService } from '../../../services/review';

@Component({
  selector: 'app-review-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  reviews: ReviewI[] = [];
  loading: boolean = false;

  constructor(
    private reviewService: ReviewService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.loadReviews();
    
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.reviewService.updateLocalReviews(reviews);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las reseñas'
        });
        this.loading = false;
      }
    });
  }

  deleteReview(review: ReviewI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la reseña #${review.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (review.id) {
          this.reviewService.deleteReview(review.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Reseña eliminada correctamente'
              });
              this.loadReviews();
            },
            error: (error) => {
              console.error('Error deleting review:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar la reseña'
              });
            }
          });
        }
      }
    });
  }
}