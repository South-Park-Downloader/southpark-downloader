import {AsyncContainerModule, injectable, interfaces} from 'inversify';
import Provider from './provider.js';
import container from './container.js';

@injectable()
export default class ProviderManager {
  /**
   * Includes all Providers 'known' to the application.
   */
  private providers: Provider[] = [];

  /**
   * Adds the given Provider.
   */
  add(provider: new () => Provider) {
    this.providers.push(new provider());
  }

  /**
   * Removes the given Provider.
   */
  remove(provider: Provider) {
    const index = this.providers.indexOf(provider);
    if (index !== -1) {
      delete this.providers[index];
    }
  }

  /**
   * Register all providers.
   */
  async register(): Promise<void> {
    /* Register all providers at once */
    const promises = this.providers.map((provider: Provider) =>
      container.loadAsync(
        new AsyncContainerModule(
          async (
            bind: interfaces.Bind,
            unbind: interfaces.Unbind,
            isBound: interfaces.IsBound,
            rebind: interfaces.Rebind,
            unbindAsync: interfaces.UnbindAsync,
            onActivation: interfaces.Container['onActivation'],
            onDeactivation: interfaces.Container['onDeactivation']
          ) => {
            provider.register(bind, unbind, isBound, rebind, unbindAsync);
          }
        )
      )
    );

    /* Add all providers as modules to the container */
    await Promise.all(promises);
  }

  /**
   * Boot all providers.
   */
  async boot(): Promise<void> {
    /* Boot all providers at once */
    const promises = this.providers.map((provider: Provider) =>
      provider.boot(container)
    );

    /* Wait for boot to finish */
    await Promise.all(promises);
  }
}
