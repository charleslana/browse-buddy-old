export interface IAction {
  id: string;
  action: 'wait-click' | 'click' | 'fill' | ' type';
  element: string;
  text?: string;
}

export interface ITest {
  url: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  actions: IAction[];
}
