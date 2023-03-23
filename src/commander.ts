import { Command } from '@commander-js/extra-typings';
import { injectable } from 'inversify';

@injectable()
export default class Commander extends Command {};