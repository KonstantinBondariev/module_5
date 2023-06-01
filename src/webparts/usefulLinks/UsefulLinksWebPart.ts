import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UsefulLinksWebPartStrings';
import UsefulLinks from './components/UsefulLinks';
import { IUsefulLinksProps } from './components/IUsefulLinksProps';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

export interface IUsefulLinksWebPartProps {
  description: string;
  list: string;
}

export default class UsefulLinksWebPart extends BaseClientSideWebPart<IUsefulLinksWebPartProps> {
  private _isDarkTheme: boolean = false;
  public sharepointLists: { key: string; text: string }[] = [];

  public render(): void {
    const element: React.ReactElement<IUsefulLinksProps> = React.createElement(
      UsefulLinks,
      {
        description: this.properties.description,
        title: '',
        context: this.context,
        isDarkTheme: this._isDarkTheme,
        list: this.properties.list,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    const sp = spfi().using(SPFx(this.context));
    console.log(sp);
    this.loadLists();
  }

  private async loadLists() {
    try {
      const sp = spfi().using(SPFx(this.context));
      const lists = await sp.web.lists();

      this.sharepointLists = lists.map((item) => ({
        key: item.Id,
        text: item.Title,
      }));
    } catch (error) {
      console.log('Ошибка при загрузке данных:', error);
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        '--bodyText',
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty(
        '--linkHovered',
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneDropdown('list', {
                  label: 'Выберите список',
                  options: this.sharepointLists,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
