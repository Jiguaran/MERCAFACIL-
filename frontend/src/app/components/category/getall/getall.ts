import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CategoryI } from '../../../models/category';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  categories: CategoryI[] = [];
  loading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoryService.updateLocalCategories(categories);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las categorias'
        });
        this.loading = false;
      }
    });
  }

  deleteCategory(category: CategoryI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar categoria ${category.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (category.id) {
          this.categoryService.deleteCategory(category.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Categoria eliminada correctamente'
              });
              this.loadCategories();
            },
            error: (error) => {
              console.error('Error deleting category:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar la categoria'
              });
            }
          });
        }
      }
    });
  }
}