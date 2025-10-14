import { Model, DataTypes } from 'sequelize';

export class WarehouseStockSimple extends Model {
  public id!: number;
  public warehouse_id!: number;
  public product_id!: number;
  public quantity!: number;

  static initialize(sequelize: any) {
    WarehouseStockSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      tableName: 'warehouse_stock',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['warehouse_id', 'product_id']
        }
      ]
    });
  }
}
