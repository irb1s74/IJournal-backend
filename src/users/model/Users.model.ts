import { Column, Table, DataType, Model, HasMany, BelongsTo } from 'sequelize-typescript';
import { Post } from '../../post/model/Post.model';
import { Subscriptions } from '../../subscriptions/model/Subscriptions.model';

interface UsersCreationAttrs {
  email: string;
  nickname: string;
  password: string;
}

@Table({ tableName: 'users', updatedAt: false })
export class Users extends Model<Users, UsersCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  nickname: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @Column({ type: DataType.STRING, allowNull: true })
  banner: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  aboutUser: string;

  @HasMany(() => Post)
  posts: Post[];


  @HasMany(() => Subscriptions, {
    as: 'subscriber',
    foreignKey: 'id'
  })
  subscriber: Subscriptions[];

  @HasMany(() => Subscriptions, {
    as: 'subscription',
    foreignKey: 'id'
  })
  subscription: Subscriptions[];
}
