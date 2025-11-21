import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../database/connection";
import { Resource } from "./Resource";
import { Role } from "./Role";


export class ResourceRole extends Model {
  public id!: number;
  public resource_id!: number;
  public role_id!: number;
  public is_active!: "ACTIVE" | "INACTIVE";
}

export interface ResourceRoleI {
  id?: number;
  resource_id: number;
  role_id: number;
  is_active: "ACTIVE" | "INACTIVE";
}

ResourceRole.init(
  {
    is_active: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "resource_roles",
    sequelize: sequelize,
    timestamps: false,
  }
);

Resource.hasMany(ResourceRole, {
  foreignKey: "resource_id",
  sourceKey: "id",
});
ResourceRole.belongsTo(Resource, {
  foreignKey: "resource_id",
  targetKey: "id",
});

Role.hasMany(ResourceRole, {
  foreignKey: "role_id",
  sourceKey: "id",
});
ResourceRole.belongsTo(Role, {
  foreignKey: "role_id",
  targetKey: "id",
});