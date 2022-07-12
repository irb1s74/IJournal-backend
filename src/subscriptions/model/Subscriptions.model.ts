import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Users } from '../../users/model/Users.model';

interface SubscriptionsCreationAttrs {
  userId: number;
  subscriberId: number;
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
