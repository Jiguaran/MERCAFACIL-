import { Request, Response } from "express";
import { ProductTag, ProductTagI } from "../models/ProductTag";

export class ProductTagController {
  // Get all productTag with status "ACTIVE"
  public async getAllProductTags(req: Request, res: Response) {
    try {
      const producTags: ProductTagI[] = await ProductTag.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ producTags });
    } catch (error) {
      res.status(500).json({ error: "Error fetching productTags" });
    }
  }

  // Get a productTag by ID

  public async getProductTagById(req: Request, res: Response) {
    try {
      const { id_product, id_tag } = req.params;

      const productTag = await ProductTag.findOne({
        where: { 
          id_tag: id_tag,
          id_product: id_product,
          status: 'ACTIVE' 
        },
      });
      // CORREGIDO 3: Usamos la variable correcta 'productTag'.
      if (productTag) {
        // CORREGIDO 4: Devolvemos el objeto correcto.
        res.status(200).json({ productTag });
      } else {
        // CORREGIDO 5: El mensaje de error es específico para productTag.
        res.status(404).json({ error: "productTag not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching product Tag" });
    }
  }


  // Create a new productTag
  public async createProductTag(req: Request, res: Response) {
    const { id, id_product, id_tag, status } = req.body;
    try {
      let body: ProductTagI = {
        id_product,
        id_tag,
        status,
      };

      const newProductTag = await ProductTag.create({ ...body });
      res.status(201).json(newProductTag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a productTag
  public async updateProductTag(req: Request, res: Response) {
    const { id_product, id_tag } = req.params;
    const { status } = req.body;
    try {
      // CORRECTO: Buscar en el modelo ProductTag.
      const productTagExist = await ProductTag.findOne({
        where: { 
          id_product: id_product, 
          id_tag: id_tag,
          status: 'ACTIVE' // Asumiendo que solo actualizamos los activos.
        },
      });

      // CORRECTO: Si la instancia existe...
      if (productTagExist) {
        // ...la actualizamos con los nuevos datos.
        await productTagExist.update({ status });
        res.status(200).json(productTagExist);
      } else {
        // CORRECTO: Mensaje de error específico.
        res.status(404).json({ error: "ProductTag not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a productTag physically
public async deleteProductTag(req: Request, res: Response) {
  try {
    // 1. Obtienes ambos IDs de la URL
    const { id_product, id_tag } = req.params;

    // 2. Usas findOne con un 'where' que incluye AMBOS campos de la clave
    const productTagToDelete = await ProductTag.findOne({
      where: {
        id_product: id_product,
        id_tag: id_tag
      }
    });

    if (productTagToDelete) {
      // 3. Si lo encuentras, lo destruyes
      await productTagToDelete.destroy();
      res.status(200).json({ message: "productTag To deleted successfully" });
    } else {
      res.status(404).json({ error: "productTag not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting productTag" });
  }
}

  // Delete a Product logically (change status to "INACTIVE")
  public async deleteProductTagAdv(req: Request, res: Response) {
    try {
      const { id_product, id_tag  } = req.params;
      const productTagToUpdate = await ProductTag.findOne({
        where: {
          id_product: id_product,
          id_tag: id_tag,
          status: 'ACTIVE' },
      });

      if (productTagToUpdate) {
        await productTagToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "productTag marked as inactive" });
      } else {
        res.status(404).json({ error: "productTag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking productTag as inactive" });
    }
  }
}