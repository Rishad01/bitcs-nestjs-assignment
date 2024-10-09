// import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
// import { ObjectSchema } from 'joi';

// @Injectable()
// export class JoiValidationPipe implements PipeTransform {
//   constructor(private schema: ObjectSchema) {}

//   transform(value: any) {
//     const { error } = this.schema.validate(value);
//     if (error) {
//       throw new BadRequestException(`Validation failed: ${error.message}`);
//     }
//     return value; 
//   }
// }


import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
   
    const { error, value: validatedValue } = this.schema.validate(value, { 
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      //console.log(error)
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    //console.log(validatedValue);
    return validatedValue;
  }
}
