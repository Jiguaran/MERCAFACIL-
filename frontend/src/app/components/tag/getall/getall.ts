import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagI } from '../../../models/tag';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TagService } from '../../../services/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-tag-getall',
  imports: [TableModule, CommonModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './getall.html',
  styleUrl: './getall.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService]
})
export class Getall implements OnInit {
  tags: TagI[] = [];
  loading: boolean = false;

  constructor(
    private tagService: TagService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.loading = true;
    this.tagService.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.tagService.updateLocalTags(tags);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las etiquetas'
        });
        this.loading = false;
      }
    });
  }

  deleteTag(tag: TagI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar etiqueta ${tag.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (tag.id) {
          this.tagService.deleteTag(tag.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Etiqueta eliminada correctamente'
              });
              this.loadTags();
            },
            error: (error) => {
              console.error('Error deleting tag:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar la etiqueta'
              });
            }
          });
        }
      }
    });
  }
}