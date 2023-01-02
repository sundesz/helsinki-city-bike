import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '..';

export interface IImportCSVAttribute {
  importCsvId: string;
  fileName: string;
  fileType: string;
  isSuccess: boolean;
  createdAt?: string;
}

// defines the type of the object passed to Sequelize’s model.create
export type IImportCSVInput = Omit<IImportCSVAttribute, 'importCsvId'>;

class ImportCsv
  extends Model<IImportCSVAttribute, IImportCSVInput>
  implements IImportCSVAttribute
{
  public importCsvId!: string;
  public fileName!: string;
  public fileType!: string;
  public isSuccess!: boolean;

  public readonly createdAt!: string;
}

ImportCsv.init(
  {
    importCsvId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSuccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'import_csv_list',
  }
);

export default ImportCsv;
