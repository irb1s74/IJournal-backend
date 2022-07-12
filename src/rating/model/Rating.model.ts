import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';
import { Post } from '../../post/model/Post.model';

interface RatingCreationAttrs {
  userId: number;
  subscriberId: number;
  ratingType: string;
}

@Table({ tableName: 'rating', updatedAt: false })
export class Rating extends Model<Rating, RatingCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Post)
  postId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Users)
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  ratingType: string;

  @BelongsTo(() => Post)
  post: Post;
}
