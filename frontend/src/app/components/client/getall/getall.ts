import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ClientI } from '../../../models/client';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-client-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  clients: ClientI[] = [];
  loading: boolean = false;

  constructor(
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientService.updateLocalClients(clients);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes'
        });
        this.loading = false;
      }
    });
  }

  deleteClient(client: ClientI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el cliente ${client.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (client.id) {
          this.clientService.deleteClient(client.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cliente eliminado correctamente'
              });
              this.loadClients();
            },
            error: (error) => {
              console.error('Error deleting client:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el cliente'
              });
            }
          });
        }
      }
    });
  }
}