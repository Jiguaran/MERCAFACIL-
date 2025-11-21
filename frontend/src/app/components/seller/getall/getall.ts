import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { SellerI } from '../../../models/seller';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { SellerService } from '../../../services/seller';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-seller-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  sellers: SellerI[] = [];
  loading: boolean = false;

  constructor(
    private sellerService: SellerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.loading = true;
    this.sellerService.getAllSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
        this.sellerService.updateLocalSellers(sellers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los vendedores'
        });
        this.loading = false;
      }
    });
  }

  deleteSeller(seller: SellerI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el vendedor ${seller.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (seller.id) {
          this.sellerService.deleteSeller(seller.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Vendedor eliminado correctamente'
              });
              this.loadSellers();
            },
            error: (error) => {
              console.error('Error deleting seller:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el vendedor'
              });
            }
          });
        }
      }
    });
  }
}