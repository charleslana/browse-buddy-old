import { Core } from '@core/Core';
import { generateUUID } from '@utils/utils';
import { IAction, INavigationResult, ITest } from '@interface/ITest';

const core = new Core();

const navigationResults: INavigationResult[] = [];

export async function navigate(test: ITest): Promise<INavigationResult[]> {
  const navigate = await core.navigate(test.url, test.isSaveEveryScreenshot);
  navigationResults.push({
    action: 'navigate',
    title: 'Navegar para',
    message: `Navegação para url: ${test.url} com sucesso`,
    image: navigate.result,
    duration: navigate.duration,
  });
  await handleActions(test.actions, test.isSaveEveryScreenshot);
  await closeBrowser(test.isSaveLastScreenshot);
  const resultsToReturn = navigationResults.slice();
  navigationResults.length = 0;
  return resultsToReturn;
}

async function closeBrowser(isSaveLastScreenshot: boolean): Promise<void> {
  if (isSaveLastScreenshot) {
    await core.screenshot(`close-${generateUUID()}`);
  }
  await core.closeBrowser();
}

async function handleActions(actions: IAction[], isSaveEveryScreenshot?: boolean): Promise<void> {
  let waitForClick;
  for (const action of actions) {
    switch (action.action) {
      case 'wait-click':
        waitForClick = await core.waitForClick(action.element, action.id, isSaveEveryScreenshot);
        navigationResults.push({
          action: 'wait-click',
          title: 'Esperar e Clicar',
          message: `Aguardar e clicar no elemento: ${action.element} com sucesso`,
          image: waitForClick.result,
          duration: waitForClick.duration,
        });
        break;
      default:
        break;
    }
  }
}
