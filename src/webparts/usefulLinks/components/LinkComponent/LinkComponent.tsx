import * as React from 'react';
import { ILinkComponentProps } from './ILinkComponentProps';
import styles from './LinkComponent.module.scss';

export default class LinkComponent extends React.Component<ILinkComponentProps> {
  public render(): React.ReactElement<ILinkComponentProps> {
    console.log(this.props);

    return (
      <a href={this.props.link.Link.Url}>
        <div className={styles.container}>
          {this.props.link.Img && (
            <div className={styles.image}>
              <img
                src={
                  this.props.link.image.serverUrl +
                  this.props.link.image.serverRelativeUrl
                }
                alt={this.props.link.image.fileName}
              />
            </div>
          )}
          <div>{this.props.link.Title}</div>
          <div>{this.props.link.Description}</div>
        </div>
      </a>
    );
  }
}
