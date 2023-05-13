import {interfaces} from 'inversify';
import {Container} from './container.js';

export default abstract class Provider {
  abstract register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void>;

  abstract boot(container: Container): Promise<void>;

  serviceIdentifier(): interfaces.ServiceIdentifier<symbol> {
    return Symbol.for(this.constructor.name);
  }
}
