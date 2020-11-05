export interface IPage {
  toHtml(): Promise<HTMLElement> | HTMLElement;
  destroy?(): Promise<void> | void;
  beforeRenderElement?(): Promise<void> | void;
  afterRenderElement?(): Promise<void> | void;
}

export interface IRouter {
  /**
   * To navigate to a different URL, use router.push.
   *
   * @param{string} path - Url address to go to a new page.
   * @public
   */
  push(path: string): Promise<void>;

  /**
   * This function returns the states of the browser history.
   *
   * @public
   * @returns {Object} - history state
   */
  getStateHistory(): { [key: string]: string };
}

export interface IPageParams {
  stateHistory: { [key: string]: string };
  router: IRouter;
}

export type TLazyLoadingPage = () => Promise<{
  new (params: IPageParams): IPage;
}>;

export type TSimplePage = { new (params: IPageParams): IPage };

export interface IRoute {
  path: string;
  page: TSimplePage | TLazyLoadingPage;
  state?: { [key: string]: string };
}

export interface IRouterParams {
  el: HTMLElement;
  routes: IRoute[];
}
