export interface IAction {
  id: string;
  action: 'wait-click' | 'click' | 'fill' | 'type';
  element: string;
  text?: string;
}

export interface ITest {
  url: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  actions: IAction[];
}

export interface INavigationResult {
  action: 'navigate' | 'wait-click' | 'click' | 'fill' | 'type' | 'end';
  title: string;
  message: string;
  image?: string;
  duration?: number;
}

export interface IExecutionResult {
  result?: string;
  duration: number;
}
