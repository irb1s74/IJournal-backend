import { Column, Table, DataType, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';

interface SubscriptionsCreationAttrs {
  userId: string;
  subscriberId: string;
}

@Table({ tableName: 'subscriptions', updatedAt: false })
export class Subscriptions extends Model<Subscriptions, SubscriptionsCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Users)
  subscriberId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Users)
  userId: number;

  @BelongsTo(() => Users)
  user: Users[];


  // @HasMany(() => likes)
  // likes: []

  // @BelongsToMany(() => Role, () => UserRoles,)
  // roles: Role[];
  //


}
