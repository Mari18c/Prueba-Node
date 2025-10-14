import { Model, DataTypes } from 'sequelize';

export class ProductSimple extends Model {
  public id!: number;
  public sku!: string;
  public name!: string;
  public price!: number;
  public is_active!: boolean;

  static initialize(sequelize: any) {
    ProductSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'products',
      timestamps: false
    });
  }
}
