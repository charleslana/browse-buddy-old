import fs from 'fs';
import logger from '@utils/logger';
import path from 'path';
import { ElementHandle, Page, PuppeteerError } from 'puppeteer';
import { generateUUID } from '@utils/utils';
import { PageSingleton } from './PageSingleton';

class CoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoreError';
  }
}

export class Core {
  private pageSingleton = PageSingleton.getInstance();
  private _page: Page | null = null;

  public async navigate(url: string, saveScreenshot?: boolean): Promise<void> {
    logger.warn(`Tentando navegar para ${url} ...`);
    try {
      await this.createPage();
      await this.getPage().goto(url, {
        waitUntil: 'domcontentloaded',
      });
      if (saveScreenshot) {
        await this.screenshot(`navigate-${generateUUID()}`);
      }
      logger.info(`Sucesso ao navegar para ${url}`);
    } catch (e) {
      const error = e as unknown as PuppeteerError;
      logger.error(`Erro ao navegar para ${url}: ${error}`);
      throw new CoreError(`Erro ao navegar para ${url}: ${error.message}`);
    }
  }

  public async waitForClick(
    selector: string,
    id?: string,
    saveScreenshot?: boolean
  ): Promise<void> {
    logger.warn(`Tentando aguardar e clicar no elemento com seletor ${selector} ...`);
    try {
      await this.waitForVisible(selector);
      await this.getPage().click(selector);
      if (saveScreenshot) {
        await this.screenshot(`wait-click-${id}`);
      }
      logger.info(`Sucesso ao aguardar e clicar no elemento com seletor ${selector}`);
    } catch (e) {
      const error = e as unknown as PuppeteerError;
      logger.error(`Erro ao aguardar e clicar no elemento com seletor ${selector}: ${error}`);
      throw new CoreError(
        `Erro ao aguardar e clicar no elemento com seletor ${selector}: ${error.message}`
      );
    }
  }

  public async getTitle(): Promise<string> {
    try {
      const title = await this.getPage().title();
      return title;
    } catch (error) {
      throw new CoreError(`Erro ao buscar título da página: ${error}`);
    }
  }

  public async waitForVisible(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.getPage().waitForSelector(selector, { visible: true });
    } catch (error) {
      throw new CoreError(`Erro ao aguardar elemento visível com seletor ${selector}: ${error}`);
    }
  }

  public async waitForNotVisible(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.getPage().waitForSelector(selector, { visible: false });
    } catch (error) {
      throw new CoreError(
        `Erro ao aguardar elemento não visível com seletor ${selector}: ${error}`
      );
    }
  }

  public async waitForHidden(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.getPage().waitForSelector(selector, { hidden: true });
    } catch (error) {
      throw new CoreError(`Erro ao aguardar elemento oculto com seletor ${selector}: ${error}`);
    }
  }

  public async sleep(ms: number): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, ms));
    } catch (error) {
      throw new CoreError(`Erro ao aguardar ${ms} milissegundos: ${error}`);
    }
  }

  public async waitForRequest(url: string): Promise<boolean | undefined> {
    try {
      const finalRequest = await this.getPage().waitForRequest(request =>
        request.url().includes(url)
      );
      return finalRequest.response()?.ok();
    } catch (error) {
      throw new CoreError(`Erro ao aguardar requisição URL: ${url}, ${error}`);
    }
  }

  public async click(element: ElementHandle<Element> | null | undefined): Promise<void> {
    try {
      await element?.click();
    } catch (error) {
      throw new CoreError(`Erro ao clicar no elemento: ${error}`);
    }
  }

  public async findElements(selector: string): Promise<ElementHandle<Element>[]> {
    try {
      return await this.getPage().$$(selector);
    } catch (error) {
      throw new CoreError(`Erro ao encontrar elementos com seletor ${selector}: ${error}`);
    }
  }

  public async screenshot(name: string): Promise<void> {
    logger.warn(`Tentando salvar tela de captura ${name} ...`);
    try {
      const screenshotsDir = this.getScreenshotDir();
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      await this.getPage().screenshot({
        path: path.resolve(screenshotsDir, `${name}.png`),
      });
      logger.info(`Sucesso ao salvar tela de captura ${name}`);
    } catch (error) {
      logger.error(`Erro ao salvar tela de captura: ${error}`);
      throw new CoreError(`Erro ao salvar tela de captura: ${error}`);
    }
  }

  public async closeBrowser(): Promise<void> {
    try {
      await this.pageSingleton.closeBrowser();
    } catch (error) {
      throw new CoreError(`Erro ao fechar o navegador: ${error}`);
    }
  }

  private async createPage(): Promise<void> {
    this._page = await this.pageSingleton.getPage();
  }

  private getPage(): Page {
    return this._page!;
  }

  private getScreenshotDir(): string {
    if (process.platform === 'linux') {
      return path.join(process.env.HOME || '', '.config', 'browse-buddy', 'screenshots');
    } else if (process.platform === 'win32') {
      return path.join(process.env.APPDATA || '', 'browse-buddy', 'screenshots');
    }
    throw new CoreError(`Sistema operacional não suportado: ${process.platform}`);
  }
}