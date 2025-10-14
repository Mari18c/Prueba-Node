import { Model, DataTypes } from 'sequelize';

export class UserSimple extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'ADMIN' | 'ANALYST';

  static initialize(sequelize: any) {
    UserSimple.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'ANALYST'),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'users',
      timestamps: false
    });
  }
}
