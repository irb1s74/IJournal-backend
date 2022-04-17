import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { Post } from './model/Post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postsRepository: typeof Post,
    private fileService: FileService
  ) {}

  async getPost() {
    return this.postsRepository.findAll();
  }

  async createPost(req) {
    return this.postsRepository.create({ userId: req.user.id });
  }

  async addImage(image: any) {
    const fileName = await this.fileService.createFile(image, 'posts');
    return {
      success: 1,
      file: {
        url: `http://localhost:5000/posts/${fileName}`,
      },
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
}
