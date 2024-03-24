import { Core } from '@core/Core';
import { generateUUID } from '@utils/utils';

const core = new Core();

interface IAction {
  id: string;
  action: 'wait-click' | 'click' | 'fill' | ' type';
  element: string;
  text?: string;
}

interface ITest {
  url: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  actions: IAction[];
}

export async function navigate(test: ITest): Promise<void> {
  await core.navigate(test.url, test.isSaveEveryScreenshot);
  await handleActions(test.actions, test.isSaveEveryScreenshot);
  await closeBrowser(test.isSaveLastScreenshot);
}

async function closeBrowser(isSaveLastScreenshot: boolean): Promise<void> {
  if (isSaveLastScreenshot) {
    await core.screenshot(`close-${generateUUID()}`);
  }
  await core.closeBrowser();
}

async function handleActions(actions: IAction[], isSaveEveryScreenshot?: boolean): Promise<void> {
  for (const action of actions) {
    switch (action.action) {
      case 'wait-click':
        await core.waitForClick(action.element, action.id, isSaveEveryScreenshot);
        break;
      default:
        break;
    }
  }
}
