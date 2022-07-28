import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';
import { Rating } from '../../rating/model/Rating.model';

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

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Users)
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title:string;

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

  @BelongsTo(() => Users)
  author: Users;

  @HasMany(() => Rating)
  rating: Rating;
}
