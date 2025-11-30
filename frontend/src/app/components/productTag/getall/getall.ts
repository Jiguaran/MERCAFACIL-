import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProductTagI } from '../../../models/productTag';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ProductTagService} from '../../../services/productTag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-productTag-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  productTags: ProductTagI[] = [];
  loading: boolean = false;

  constructor(
    private productTagService: ProductTagService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductTags();
  }

  loadProductTags(): void {
    this.loading = true;
    this.productTagService.getAllProductTags().subscribe({
      next: (productTags) => {
        this.productTags = productTags;
        this.productTagService.updateLocalProductTags(productTags);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ProductTags:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las Etiquetas de Producto'
        });
        this.loading = false;
      }
    });
  }

deleteProductTag(productTag: ProductTagI): void {
  this.confirmationService.confirm({
    message: `¿Está seguro de eliminar esta relación Product-Tag?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      if (productTag) {
        this.productTagService.deleteProductTag(
          productTag.id_product,
          productTag.id_tag
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Relación Product-Tag eliminada correctamente'
            });

            this.loadProductTags();
          },
          error: (error) => {
            console.error('Error deleting ProductTag:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la relación Product-Tag'
            });
          }
        });
      }
    }
  });
}

    


deletelogicalProductTag(productTag: ProductTagI): void {
  this.confirmationService.confirm({
    message: `¿Está seguro de eliminar la etiqueta del producto ${productTag.id_product} con la etiqueta ${productTag.id_tag}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {

      this.productTagService.deleteProductTag(productTag.id_product, productTag.id_tag)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Etiqueta de producto eliminada correctamente'
            });
            this.loadProductTags();
          },
          error: (error) => {
            console.error('Error deleting product tag:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la etiqueta de producto'
            });
          }
        });
    }
  });
}

}