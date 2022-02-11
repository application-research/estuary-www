import styles from '@components/UploadList.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

import UploadItem from '@components/UploadItem';

export default class UploadList extends React.Component<any> {
  items = {};

  uploadAll = async () => {
    const items = Object.keys(this.items);

    for (const key of items) {
      const item = this.items[key];
      if (!item.upload) {
        continue;
      }

      item.upload();
    }
  };

  render() {
    return (
      <section className={styles.layout}>
        {this.props.files.map((file) => {
          return <UploadItem host={this.props.host} ref={(a) => (this.items[file.id] = a)} key={file.id} file={file} viewer={this.props.viewer} onRemove={this.props.onRemove} />;
        })}
      </section>
    );
  }
}
