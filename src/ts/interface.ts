import { Router } from '@/router';

export interface IPage {
  toHtml(): HTMLElement;
}

export interface IPageParams {
  stateHistory: { [key: string]: string };
  router: Router;
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
