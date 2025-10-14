import { Model, DataTypes } from 'sequelize';

export class OrderSimple extends Model {
  public id!: number;
  public order_number!: string;
  public client_id!: number;
  public warehouse_id!: number;
  public status!: 'PENDIENTE' | 'EN_TRANSITO' | 'ENTREGADA';

  static initialize(sequelize: any) {
    OrderSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('PENDIENTE', 'EN_TRANSITO', 'ENTREGADA'),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'orders',
      timestamps: false
    });
  }
}
