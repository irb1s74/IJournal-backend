import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
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
  subscriberId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => Users, {
    as: 'subscriber',
    foreignKey: 'subscriberId'

  })
  subscriberUser: Users;

  @BelongsTo(() => Users, {
    as: 'subscription',
    foreignKey: 'userId'
  })
  subscriptionUser: Users;
}
