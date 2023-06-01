import * as React from 'react';
import * as ReactDom from 'react-dom';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import LinkComponent from './LinkComponent/LinkComponent';
import { IUsefulLinksProps } from './IUsefulLinksProps';
import { IUsefulLinksState, LinkItem } from './IUsefulLinksState';
import styles from './UsefulLinks.module.scss';

export default class UsefulLinks extends React.Component<
  IUsefulLinksProps,
  IUsefulLinksState
> {
  private domElement: HTMLElement;

  constructor(props: IUsefulLinksProps) {
    super(props);
    this.state = {
      links: [],
      invalidListFormat: false,
    };
    this.domElement = document.createElement('div');
  }

  public componentDidMount() {
    this.loadLinks();
  }

  private async loadLinks() {
    try {
      const sp = spfi().using(SPFx(this.props.context)); // использовать родительский контекст
      const links: LinkItem[] = await sp.web.lists
        .getById(this.props.list)
        .items.select('Title', 'Link', 'Description', 'Img')();

      links.forEach((link) => (link.image = JSON.parse(link.Img)));
      this.setState({ links, invalidListFormat: false });
    } catch (error) {
      this.setState({ links: [], invalidListFormat: true });
      console.log('Ошибка при загрузке данных:', error);
    }
  }

  public render(): React.ReactElement<IUsefulLinksProps> {
    return (
      <div className={styles.container}>
        {!this.state.invalidListFormat && (
          <div className={styles.links}>
            {this.state.links.map((link: LinkItem) => (
              <LinkComponent key={link.Id} link={link} />
            ))}
          </div>
        )}

        {this.state.invalidListFormat && (
          <div className={styles.container}>
            this list does not meet the requirements
          </div>
        )}
      </div>
    );
  }

  public componentDidUpdate(prevProps: IUsefulLinksProps) {
    if (prevProps.list !== this.props.list) {
      this.loadLinks();
    }
  }

  public componentWillUnmount() {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
