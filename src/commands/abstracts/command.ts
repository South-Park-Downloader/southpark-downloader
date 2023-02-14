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
  public args: { [name: string]: { type: string, description?: string } } = {};

  /**
   * The options of the command.
   */
  public options: { [name: string]: { type?: string, description?: string } } = {};

  /**
   * Execute the command.
   */
  public abstract execute(): Promise<number|void>;
}
