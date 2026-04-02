
import { ComponentHarness } from '@angular/cdk/testing';

export class TabsHarness extends ComponentHarness {

  static hostSelector = 'tabs';

  private getButtons = this.locatorForAll('button.tab-link');

  async getTabLabels(): Promise<string[]> {
    const buttons = await this.getButtons();
    return Promise.all(buttons.map(button => button.text()));
  }

  async getActiveTabLabel(): Promise<string | null> {
    const buttons = await this.getButtons();

    for (const button of buttons) {
      if (await button.hasClass('active')) {
        return button.text();
      }
    }

    return null;
  }

  async clickTabByIndex(index: number) {
    const buttons = await this.getButtons();

    if (index < 0 || index >= buttons.length) {
      throw new Error(`No tab found at index ${index}. Found ${buttons.length} tabs.`);
    }

    await buttons[index].click();
  }

}
