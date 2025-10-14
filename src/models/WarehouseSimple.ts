import { Model, DataTypes } from 'sequelize';

export class WarehouseSimple extends Model {
  public id!: number;
  public name!: string;
  public location!: string;
  public is_active!: boolean;

  static initialize(sequelize: any) {
    WarehouseSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      tableName: 'warehouses',
      timestamps: false
    });
  }
}
