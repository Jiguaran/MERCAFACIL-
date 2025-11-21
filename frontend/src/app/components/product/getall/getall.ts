import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProductI } from '../../../models/product';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ProductService} from '../../../services/product';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-product-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  products: ProductI[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.productService.updateLocalProducts(products);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading Products:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los productos'
        });
        this.loading = false;
      }
    });
  }

  deleteProduct(product: ProductI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el producto ${product.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (product.id) {
          this.productService.deleteProduct(product.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto eliminado correctamente'
              });
              this.loadProducts();
            },
            error: (error) => {
              console.error('Error deleting product:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el producto'
              });
            }
          });
        }
      }
    });
  }
}