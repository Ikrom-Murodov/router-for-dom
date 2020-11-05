import {
  IPage,
  IRoute,
  IRouterParams,
  TLazyLoadingPage,
  TSimplePage,
} from '@/interface';

import { findADynamicOrSimpleRoute } from '@/utils';

export class Router {
  /**
   * This field stores the page.
   * @private
   */
  private page!: IPage;

  /**
   * This field stores the current html element.
   * @private
   */
  private htmlElement!: HTMLElement;

  constructor(private params: IRouterParams) {
    this.init();
  }

  /**
   * This method is called when the class constructor fires.
   * @private
   */
  private async init(): Promise<void> {
    await this.push(window.location.pathname);

    document.body.addEventListener('click', async (event) => {
      const element: HTMLElement = event.target as HTMLElement;
      const url = element.getAttribute('data-router-link');

      if (url) await this.push(url);
    });
  }

  /**
   * To navigate to a different URL, use router.push.
   *
   * @param{string} path - Url address to go to a new page.
   * @public
   */
  public async push(path: string): Promise<void> {
    const response: IRoute | null = findADynamicOrSimpleRoute(
      path,
      this.params.routes,
    );

    if (response) {
      await this.render(response);
    }
  }

  /**
   * This function returns the states of the browser history.
   *
   * @public
   * @returns {Object} - history state
   */
  public getStateHistory(): { [key: string]: string } {
    return window.history.state;
  }

  /**
   * Creates an instance of the page and passes it the required parameters,
   *  and then updates the content of the html element.
   *
   * @param {Object} route
   * @return {Promise<void>}
   * @private
   */
  private async render(route: IRoute): Promise<void> {
    await this.destroy();
    this.activeClass('remove');
    window.history.pushState(route.state, '', route.path);
    this.activeClass('add');

    if (route.page.prototype) {
      this.page = new (route.page as TSimplePage)({
        router: this,
        stateHistory: this.getStateHistory(),
      });

      await this.updateRootElement();
    } else {
      const Page = await (route.page as TLazyLoadingPage)();

      this.page = new Page({
        router: this,
        stateHistory: this.getStateHistory(),
      });

      await this.updateRootElement();
    }
  }

  /**
   * Adds or removes a class from an html element depending on the parameter.
   * @param {string} type - remove or add a class
   * @private
   */
  private activeClass(type: 'add' | 'remove'): void {
    const elements = document.querySelectorAll(
      `[data-router-link="${window.location.pathname}"]`,
    );

    if (elements) {
      elements.forEach((element) => {
        element.classList[type]('active-class');
      });
    }
  }

  /**
   * Updates the content of the html element.
   * @private
   */
  private async updateRootElement(): Promise<void> {
    await this.beforeRenderElement();

    this.htmlElement = await this.page.toHtml();
    this.params.el.append(this.htmlElement);

    await this.afterRenderElement();
  }

  // hooks

  /**
   * This hook will fire after push method has been called.
   * @private
   * @return {Promise<void>}
   */
  private async destroy(): Promise<void> {
    if (this.page?.destroy) {
      await this.page.destroy();
      this.htmlElement?.remove();
    } else {
      this.htmlElement?.remove();
    }
  }

  /**
   * This hook will fire before changing the content of the html element.
   * @private
   * @return {Promise<void>}
   */
  private async beforeRenderElement(): Promise<void> {
    if (this.page?.beforeRenderElement) {
      await this.page.beforeRenderElement();
    }
  }

  /**
   * This hook will fire after changing content of html element.
   * @private
   * @return {Promise<void>}
   */
  private async afterRenderElement(): Promise<void> {
    if (this.page?.afterRenderElement) {
      await this.page.afterRenderElement();
    }
  }
}
