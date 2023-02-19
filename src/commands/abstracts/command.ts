import { injectable } from 'inversify';

@injectable()
export default abstract class Command {
  /**
   * The name of the command.
   */
  public abstract name: string;

  /**
   * The description of the command.
   */
  public abstract description: string;

  /**
   * The arguments of the command.
   */
  public args: { [name: string]: { description?: string, defaultValue?: any } } = {};

  /**
   * The options of the command.
   */
  public options: { [flags: string]: { description?: string, defaultValue?: any } } = {};

  /**
   * Execute the command.
   */
  public abstract execute(): Promise<number|void>;
}
