import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';

interface PostCreationAttrs {
  userId: number;
}

@Table({ tableName: 'post', updatedAt: true, createdAt: true })
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: {}
  })
  data: [];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  publish: boolean;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 0 })
  rating: string;

  @BelongsTo(() => Users)
  author: Users;
}
