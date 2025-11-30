import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
items: MenuItem[] | undefined;
ngOnInit() {
        this.items = [
            {
        label: 'Clientes',
        icon: 'pi pi-fw pi-users',
        routerLink: '/clients',
      },
      {
        label: 'Vendedores',
        icon: 'pi pi-fw pi-qrcode',
        routerLink: '/sellers'
      },
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-shopping-bag',
        routerLink: '/products'
      },
      {
        label: 'categorias',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/categories'
      },
      {
        label : 'Etiquetas',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/tags'
      },
      {
        label : 'Etiquetas de productos',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/productTags'
      },
      {
        label : 'Pedido',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/orders'
      },

      {
        label : 'Detalles de pedidos',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/orderDetails'
      },
      {
        label : 'Envios',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/shipments'
      },
      {
        label : 'Pagos',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/payments'
      },
      {
        label : 'Reseñas',
        icon : 'pi pi-fw pi-chart-bar',
        routerLink: '/reviews'
      }
    
        ];
    }
}