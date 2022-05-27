import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { Post } from './model/Post.model';
import { Op } from 'sequelize';
import { Users } from '../users/model/Users.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postsRepository: typeof Post,
    private fileService: FileService
  ) {
  }

  async getPost() {
    return this.postsRepository.findAll({
      where: {
        publish: true
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: Users,
        attributes: { exclude: ['password', 'id'] }
      }
    });
  }

  async getDrafts(req) {
    return this.postsRepository.findAll({
      where: {
        [Op.and]: [
          { publish: false },
          { userId: req.user.id }
        ]
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: Users,
        attributes: { exclude: ['password', 'id'] }
      }
    });
  }

  async createPost(req) {
    return this.postsRepository.create({ userId: req.user.id });
  }

  async addImage(image: any) {
    const fileName = await this.fileService.createFile(image, 'posts');
    return {
      success: 1,
      file: {
        url: `http://localhost:5000/posts/${fileName}`
      }
    };
  }

  async updatePost(dto, request) {
    const post = await this.postsRepository.findByPk(dto.postId);
    if (post.userId !== request.user.id) {
      return new HttpException(
        { message: 'Вы не являетесь автором поста' },
        HttpStatus.BAD_REQUEST
      );
    }
    post.data = dto.data;
    post.save();
    return new HttpException(post, HttpStatus.OK);
  }

  async makePublishPost(postId) {
    try {
      const post = await this.postsRepository.findByPk(postId);
      post.publish = true;
      post.save();
      return new HttpException(post, HttpStatus.OK);

    } catch (e) {
      return new HttpException({ 'error': e }, HttpStatus.BAD_REQUEST);
    }
  }

  async deletePost(postId) {
    try {
      await this.postsRepository.destroy({ where: { id: postId } });
      return new HttpException({ message: 'post has been deleted' }, HttpStatus.OK);
    } catch (e) {
      return new HttpException({ 'error': e }, HttpStatus.BAD_REQUEST);
    }
  }
}
