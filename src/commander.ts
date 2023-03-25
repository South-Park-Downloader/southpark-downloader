import { Command, OptionValues } from '@commander-js/extra-typings';
import { injectable } from 'inversify';

@injectable()
export default class Commander<Args extends any[] = [], Opts extends OptionValues = {}> extends Command<Args, Opts> {
  //
};
