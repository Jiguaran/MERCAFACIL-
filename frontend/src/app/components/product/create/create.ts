import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../../../services/product';
import { CategoryService } from '../../../services/category'; // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { SellerService } from '../../../services/seller';  // <-- IMPORTANTE, para poder crear un puente para editar y crear
import { SelectModule } from 'primeng/select'; //importamos el selectModule para poder elegir lo que quiero usar y poner



@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule,SelectModule,], //importamos el SelectModule
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading: boolean = false;

  categories: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CATEGORIAS
  sellers: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE VENDEDORES

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private categoryService: CategoryService,   // <-- INYECTAMOS SERVICIO
    private sellerService: SellerService    // <-- INYECTAMOS SERVICIO
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      id_seller: ['', [Validators.required]],
      id_category: ['', [Validators.required]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void { //ponemos el ngOnInit para cargar las categorias
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data.map(c => ({
        label: c.name,
        value: c.id
      }));
    });
  
    this.sellerService.getAllSellers().subscribe((data) => { //ponemos el servicio para cargar los vendedores
      this.sellers = data.map(s => ({
        label: s.name,
        value: s.id
      }));
    });
  }
  
  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const productData = this.form.value;

      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el producto'
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
    this.router.navigate(['/products']);
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
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Formato no válido';
      if (field.errors['minlength']) return 'minimo 10 DIGITOS';
    }
    return '';
  }
}