import { BaseEncodingOptions } from 'fs';

declare type ReaddirOptions = (BaseEncodingOptions & {
  withFileTypes?: false | undefined;
}) | BufferEncoding | null | undefined;
