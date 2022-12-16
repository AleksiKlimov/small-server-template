/* eslint-disable no-console */
import type { Handler } from 'express';
import * as yup from 'yup';
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';

import CustomError from '../exceptions/CustomError';
import errorText from '../utils/consts/error';

type ValidationShemaType = {
  [key: string]: yup.StringSchema | yup.NumberSchema | yup.DateSchema;
};

type ValidationType = {
  body?: ValidationShemaType;
  query?: ValidationShemaType;
  params?: ValidationShemaType;
};

type ParamsType = {
  errors: string[];
  path: string;
};

type ErrorType = {
  inner: ParamsType[];
  errors: string[];
};

const createValidationMiddleware = (schema: ValidationType) => {
  const validationMiddleware: Handler = async (req, res, next) => {
    console.log('evemnt');
    try {
      const errors: Array<{
        path: string;
        message?: string;
        key?: string;
      }> = [];
      let textMessage = '';
      const rootShape: Record<string, yup.AnyObjectSchema> = {};
      const keysRequest = [
        ...Object.keys(req.body),
        ...Object.keys(req.params),
        ...Object.keys(req.query),
      ];

      const keysSchema = [
        ...Object.keys(schema.body ? schema.body : {}),
        ...Object.keys(schema.params ? schema.params : {}),
        ...Object.keys(schema.query ? schema.query : {}),
      ];

      const invalidKeys = _.difference(keysRequest, keysSchema);

      Object.entries(schema).forEach(([key, value]) => {
        rootShape[key] = yup.object().shape(value);
      });
      const yupSchema = yup.object(rootShape);
      const handleError = (err: ErrorType) => {
        err.inner.forEach((item) => {
          errors.push({
            message: item.errors.join("'"),
            path: item.path.split('.')[0],
            key: item.path.split('.')[1],
          });
        });
      };
      await yupSchema.validate(req, { abortEarly: false })
        .catch((err) => handleError(err));

      if (invalidKeys.length) {
        textMessage = `Please delete from request next keys ${invalidKeys}`;
      }

      if (errors.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST, errorText.USER_INVALID_REQUEST, { textMessage, errors },
        );
      }

      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return validationMiddleware;
};

export default createValidationMiddleware;
