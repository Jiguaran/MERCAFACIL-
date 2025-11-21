import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReviewService } from '../../../services/review';
import { ClientI } from '../../../models/client';
import { ClientService } from '../../../services/client'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { ProductService } from '../../../services/product'; 
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner


@Component({
  selector: 'app-review-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})

export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE PRODUCTOS
  clients: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CLIENTES

  reviewId: number = 0;
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private messageService: MessageService,
    private clientService: ClientService,   // <-- INYECTAMOS SERVICIO
    private productService: ProductService    // <-- INYECTAMOS SERVICIO

  ) {
    this.form = this.fb.group({
      comment: ['', [Validators.required,]],
      rating: ['', [Validators.required,]],
      id_product: ['', [Validators.required,]],
      id_client: ['', [Validators.required,]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reviewId = parseInt(id);
      this.loadReview();
    }

    this.clientService.getAllClients().subscribe((data) => {
      this.clients = data.map(c => ({
        label: c.name,
        value: c.id
      }));
    });

    this.productService.getAllProducts().subscribe((data) => { //ponemos el servicio para cargar los productos
      this.products = data.map(p => ({
        label: p.name,
        value: p.id
      }));
    });
  }

  loadReview(): void {
    this.loading = true;
    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (review) => {
        this.form.patchValue(review);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading review:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el producto'
        });
        this.loading = false;
      }
    });
  }

   submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const reviewData = this.form.value;

      this.reviewService.updateReview(this.reviewId, reviewData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reseña actualizada correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/reviews']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la reseña'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/reviews']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email no válido';
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato no válido';
      if (field.errors['maxlength']) return 'debe ser como máximo 10 caracteres';
    }
    return '';
  }
}
