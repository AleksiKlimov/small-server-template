import { StatusCodes } from 'http-status-codes';

import type { RequestHandler } from 'express';
import type UserType from '../../db/entities/User';
import CustomError from '../../exceptions/CustomError';

import tokenWorker from '../../utils/tokenHelper';
import hashHelper from '../../utils/hashHelper';
import dB from '../../db';

type BodyType = {
  email: string;
  password: string;
};

type ParamsType = Record<string, never>;

type QueryType = Record<string, never>;

type ResponseType = {
  user: UserType;
  token: string;
};

type HandlerType = RequestHandler<ParamsType, ResponseType, BodyType, QueryType>;

const loginUser: HandlerType = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await dB.user
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new CustomError(StatusCodes.BAD_REQUEST, 'user not found');
    }
    const flag = hashHelper.checkPassword(password, user.password);
    delete user.password;

    if (!flag) {
      throw new CustomError(StatusCodes.BAD_REQUEST, 'password invalid, please enter correct passwpord, and repeat request ');
    }

    const token = tokenWorker.create(user.id);
    res.status(StatusCodes.OK).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export default loginUser;