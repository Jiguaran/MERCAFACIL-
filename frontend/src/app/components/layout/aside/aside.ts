import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './aside.html'
})
export class Aside implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Gestión Comercial',
        items: [
            {
                label: 'Clientes',
                icon: 'pi pi-users',
                routerLink: '/clients',
            },
            {
                label: 'Vendedores',
                icon: 'pi pi-briefcase', 
                routerLink: '/sellers'
            }
        ]
      },
      {
        label: 'Inventario',
        items: [
            {
                label: 'Productos',
                icon: 'pi pi-box',
                routerLink: '/products'
            },
            {
                label: 'Categorías',
                icon: 'pi pi-th-large', 
                routerLink: '/categories'
            },
            {
                label: 'Etiquetas',
                icon: 'pi pi-hashtag', 
                routerLink: '/tags'
            },
            {
                label: 'Etiquetas Producto',
                icon: 'pi pi-link', 
                routerLink: '/productTags'
            }
        ]
      },
      {
        label: 'Ventas y Distribución',
        items: [
            {
                label: 'Pedidos',
                icon: 'pi pi-shopping-cart', 
                routerLink: '/orders'
            },
            {
                label: 'Detalles Pedidos',
                icon: 'pi pi-list',
                routerLink: '/orderDetails'
            },
            {
                label: 'Envíos',
                icon: 'pi pi-truck',  
                routerLink: '/shipments'
            }
        ]
      },
      {
        label: 'Finanzas y Feedback',
        items: [
            {
                label: 'Pagos',
                icon: 'pi pi-wallet',  
                routerLink: '/payments'
            },
            {
                label: 'Reseñas',
                icon: 'pi pi-star',  
                routerLink: '/reviews'
            }
        ]
      }
    ];
  }
}