import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductTagService } from '../../../services/productTag';
import {ProductService} from '../../../services/product';
import {TagService} from '../../../services/tag'; // <-- IMPORTANTE, para poder crear un puente para editar y crear


@Component({
  selector: 'app-producTag-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, Select, ToastModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  
  products: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE CATEGORIAS
  tags: any[] = [];   // <-- AQUÍ SE GUARDAN EN UN ARRAY LAS OPCIONES DE VENDEDORES

  idp: number = 0;
  idt: number = 0;
  
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productTagService: ProductTagService,
    private messageService: MessageService,
    private productService: ProductService,   // <-- INYECTAMOS SERVICIO
    private tagService: TagService    // <-- INYECTAMOS SERVICIO

  ) {
    this.form = this.fb.group({
      id_product: ['', [Validators.required,]],
      id_tag: ['', [Validators.required,]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const idt = Number(this.route.snapshot.paramMap.get('id_tag'));
    const idp = Number(this.route.snapshot.paramMap.get('id_product'));

    if (idt && idp) {
      this.idp = idp;
      this.idt = idt;

      this.loadProductTag();
    }
    
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data.map(p => ({
        label: p.name,
        value: p.id
      }));
    });
  
    this.tagService.getAllTags().subscribe((data) => { //ponemos el servicio para cargar los vendedores
      this.tags = data.map(t => ({
        label: t.name,
        value: t.id
      }));
    });
  }

loadProductTag(): void {
  this.loading = true;

  this.productTagService.getProductTagById(this.idp, this.idt).subscribe({
    next: (productTag) => {
      this.form.patchValue(productTag); 
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading productTag:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar la relación producto-etiqueta'
      });
      this.loading = false;
    }
  });
}


submit(): void {
  if (this.form.valid) {
    this.loading = true;
    const productTagData = this.form.value;

    this.productTagService.updateProductTag(this.idp, this.idt, productTagData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Relación Product-Tag actualizada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/product-tags']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error updating ProductTag:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la relación'
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
  this.router.navigate(['/productTags']);
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