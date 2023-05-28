import * as React from 'react';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

// import styles from './UsefulLinks.module.scss';
import { IUsefulLinksProps } from './IUsefulLinksProps';
import { IUsefulLinksState } from './IUsefulLinksState';
// import { Items } from '@pnp/sp/items';

// import { escape } from '@microsoft/sp-lodash-subset';

export default class UsefulLinks extends React.Component<
  IUsefulLinksProps,
  IUsefulLinksState
> {
  constructor(props: IUsefulLinksProps) {
    super(props);
    this.state = {
      links: [],
    };
  }

  public componentDidMount() {
    this.loadLinks();
  }

  private async loadLinks() {
    try {
      const sp = spfi().using(SPFx(this.props.context));
      const items = await sp.web.lists
        .getByTitle('UsefulLinks2')
        .items.select('Title')();
      this.setState({ links: items });
      console.log(items);
    } catch (error) {
      console.log('Ошибка при загрузке данных:', error);
    }
  }

  public render(): React.ReactElement<IUsefulLinksProps> {
    console.log(this.props.context);

    return (
      <div>
        {this.state.links.map((link: any) => {
          return <div>{link.Title}</div>;
        })}
      </div>
    );
  }
}
