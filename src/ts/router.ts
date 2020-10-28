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

  constructor(private params: IRouterParams) {
    this.init();
  }

  /**
   * This method is called when the class constructor fires.
   * @private
   */
  private init(): void {
    this.push(window.location.pathname);
  }

  /**
   * To navigate to a different URL, use router.push.
   *
   * @param{string} path - Url address to go to a new page.
   * @public
   */
  public push(path: string): void {
    const response: IRoute | null = findADynamicOrSimpleRoute(
      path,
      this.params.routes,
    );

    if (response) this.render(response);
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
    window.history.pushState(route.state, '', route.path);

    if (route.page.prototype) {
      this.page = new (route.page as TSimplePage)({
        router: this,
        stateHistory: this.getStateHistory(),
      });

      this.updateRootElement();
    } else {
      const Page = await (route.page as TLazyLoadingPage)();

      this.page = new Page({
        router: this,
        stateHistory: this.getStateHistory(),
      });

      this.updateRootElement();
    }
  }

  /**
   * Updates the content of the html element.
   * @private
   */
  private updateRootElement(): void {
    this.params.el.textContent = '';
    this.params.el.append(this.page.toHtml());
  }
}
