import { Model, DataTypes } from 'sequelize';

export class ClientSimple extends Model {
  public id!: number;
  public cedula!: string;
  public name!: string;
  public email!: string;

  static initialize(sequelize: any) {
    ClientSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'clients',
      timestamps: false
    });
  }
}
