import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class PermissionEntity {
  @Prop({
    required: true,
    index: true,
    uppercase: true,
    unique: true,
    trim: true,
  })
  @Field()
  code: string;

  @Prop({
    required: true,
    lowercase: true,
  })
  @Field()
  name: string;

  @Prop({
    required: false,
  })
  @Field()
  description?: string;

  @Prop({
    required: true,
    default: true,
  })
  @Field(()=>Boolean)
  isActive: boolean;
}

export const PermissionDatabaseName = 'permissions';
export const PermissionSchema = SchemaFactory.createForClass(PermissionEntity);

export type PermissionDocument = PermissionEntity & Document;

// Hooks
PermissionSchema.pre<PermissionDocument>('save', function (next) {
  this.code = this.code.toUpperCase();
  this.name = this.name.toLowerCase();
  next();
});
