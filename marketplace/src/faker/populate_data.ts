import { faker } from '@faker-js/faker';
import { Client } from '../models/Client';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Seller } from '../models/Seller';
import { Order } from '../models/Order';
import { OrderDetail } from '../models/OrderDetail';
import { Tag } from '../models/Tag';
import { ProductTag } from '../models/ProductTag';
import { Review } from '../models/Review';
import { sequelize } from '../database/connection'; // Importar la instancia de Sequelize

async function createFakeData() {
    // Sincroniza la base de datos, borrando todo y recreándolo.
    // Esto asegura un estado limpio en cada ejecución.
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada y reiniciada.');

    // Crear vendedores falsos
    const sellers = [];
    for (let i = 0; i < 10; i++) {
        const seller = await Seller.create({
            name: faker.company.name(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            password: faker.internet.password(),
            status: 'ACTIVE',
        });
        sellers.push(seller);
    }

    // Crear categorías falsas
    const categories = [];
    for (let i = 0; i < 5; i++) {
        const category = await Category.create({
            name: faker.commerce.department(),
            status: 'ACTIVE',
        });
        categories.push(category);
    }

    // Crear clientes falsos
    const clients = [];
    for (let i = 0; i < 20; i++) {
        const client = await Client.create({
            name: faker.person.fullName(),
            address: faker.location.streetAddress(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            code: faker.string.alphanumeric(10),
            status: 'ACTIVE',
        });
        clients.push(client);
    }

    // Crear etiquetas (tags) falsas
    const tags = [];
    for (let i = 0; i < 15; i++) {
        const tag = await Tag.create({
            name: faker.lorem.word(),
            status: 'ACTIVE',
        });
        tags.push(tag);
    }

    // Crear productos falsos
    const products = [];
    for (let i = 0; i < 50; i++) {
        const product = await Product.create({
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription(),
            id_seller: sellers[faker.number.int({ min: 0, max: sellers.length - 1 })].id,
            id_category: categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
            status: 'ACTIVE',
        });
        products.push(product);
    }

    // Crear órdenes falsas
    for (let i = 0; i < 30; i++) {
        const order = await Order.create({
            id_client: clients[faker.number.int({ min: 0, max: clients.length - 1 })].id,
            total: parseFloat(faker.commerce.price()),
            status: 'PENDING',
            statuss: 'ACTIVE'
        });

        // Crear detalles de orden para cada orden
        const numberOfProducts = faker.number.int({ min: 1, max: 5 });
        const usedProductIds = new Set<number>();

        for (let j = 0; j < numberOfProducts; j++) {
            let product;
            do {
                product = products[faker.number.int({ min: 0, max: products.length - 1 })];
            } while (usedProductIds.has(product.id));
            usedProductIds.add(product.id);

            await OrderDetail.create({
                id_order: order.id,
                id_product: product.id,
                quantity: faker.number.int({ min: 1, max: 10 }),
                price: parseFloat(faker.commerce.price()),
                status: 'ACTIVE'
            });
        }
    }

    // Crear asociaciones de productos y etiquetas
    for (const product of products) {
        const numberOfTags = faker.number.int({ min: 1, max: 4 });
        const usedTagIds = new Set<number>();
        for (let j = 0; j < numberOfTags; j++) {
            let tag;
            do {
                tag = tags[faker.number.int({ min: 0, max: tags.length - 1 })];
            } while (usedTagIds.has(tag.id));
            usedTagIds.add(tag.id);

            await ProductTag.create({
                id_product: product.id,
                id_tag: tag.id,
                status: 'ACTIVE'
            });
        }
    }

    // Crear reseñas de productos
    for (let i = 0; i < 100; i++) {
        const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
        const client = clients[faker.number.int({ min: 0, max: clients.length - 1 })];

        // Opcional: Evitar que un mismo cliente deje múltiples reseñas en el mismo producto
        const existingReview = await Review.findOne({ where: { id_product: product.id, id_client: client.id } });
        if (!existingReview) {
            await Review.create({
                id_product: product.id,
                id_client: client.id,
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: faker.lorem.sentence(),
                status: 'ACTIVE',
            });
        }
    }
}

createFakeData().then(() => {
    console.log('Datos falsos creados exitosamente');
}).catch((error) => {
    console.error('Error al crear datos falsos:', error);
});