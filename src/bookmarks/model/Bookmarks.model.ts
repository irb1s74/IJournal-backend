import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';
import { Post } from '../../post/model/Post.model';

interface BookmarksCreationAttrs {
  userId: number;
  postId: number;
}

@Table({ tableName: 'bookmarks', updatedAt: false })
export class Bookmarks extends Model<Bookmarks, BookmarksCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Post)
  postId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Users)
  userId: number;

  @BelongsTo(() => Post)
  post: Post;

  @BelongsTo(() => Users)
  user: Users;
}
