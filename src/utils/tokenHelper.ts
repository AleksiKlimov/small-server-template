/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import CustomError from '../exceptions/CustomError';
import errorText from '../utils/consts/error';
import config from '../config';

const create = (id: number) => {
  return jwt.sign({ id }, config.token.secret, { algorithm: 'HS512', expiresIn: '1h' });
};

const decode = (token: string) => {
  try {
    const payload = jwt.verify(token, config.token.secret) as { id: number };
    console.log(payload);
    return payload;
  } catch (error) {
    throw new CustomError(StatusCodes.FORBIDDEN, errorText.USER_SIGN_IN);
  }
};

export default {
  create,
  decode,
};
