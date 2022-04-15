import { Column, Table, DataType, Model, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Users } from '../../users/model/Users.model'


interface PostCreationAttrs {
    userId: number;
}


@Table({ tableName: 'post', updatedAt: true, createdAt: true })
export class Post extends Model<Post, PostCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number

    @Column({ type: DataType.STRING, allowNull: true })
    title: string;

    @Column({ type: DataType.ARRAY(DataType.JSON), allowNull: true })
    data: [];

    @Column({ type: DataType.STRING, allowNull: true })
    rating: string;

    @BelongsTo(() => Users)
    author: Users
}
