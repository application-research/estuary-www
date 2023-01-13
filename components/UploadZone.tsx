import styles from '@components/UploadZone.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import LoaderSpinner from '@components/LoaderSpinner';

const MODES = {
  1: 'WAITING',
  2: 'ACTIVE',
  3: 'PROCESSING',
};

function traverseFileTree(item, path) {
  path = path || '';
  if (item.isFile) {
    item.file(function (file) {
      console.log('File:', path + file.name);
    });
  } else if (item.isDirectory) {
    var dirReader = item.createReader();
    dirReader.readEntries(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], path + item.name + '/');
      }
    });
  }
}

export default class UploadZone extends React.Component<any> {
  state = {
    mode: MODES[1],
  };

  dropRef = React.createRef<any>();
  dirty = false;

  componentDidMount() {
    let ref = this.dropRef.current as Element;

    ref.addEventListener('dragenter', this.handleDragIn);
    ref.addEventListener('dragleave', this.handleDragOut);
    ref.addEventListener('dragover', this.handleDrag);
    ref.addEventListener('drop', this.handleDrop);

    window.addEventListener('dragover', this._handleNegate);
    window.addEventListener('drop', this._handleNegate);
  }

  componentWillUnmount() {
    window.removeEventListener('dragover', this._handleNegate);
    window.removeEventListener('drop', this._handleNegate);
    window.removeEventListener('beforeunload', this._handleUnloadCheck);
  }

  _handleNegate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  _handleUnloadCheck = (e) => {
    e.preventDefault();
    e.returnValue = '';
  };

  handleSelectFile = async (e) => {
    e.persist();

    this.setState({
      ...this.state,
      mode: MODES[3],
    });

    if (e.target.files.length == 0) {
      return;
    }

    await this.handlePushFiles(e.target.files);
  };

  handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      ...this.state,
      mode: MODES[3],
    });

    if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) {
      return;
    }

    await this.handlePushFiles(e.dataTransfer.files);
  };

  handlePushFiles = async (files) => {
    for await (const file of files) {
      if (!file.type && file.size % 4096 == 0) {
        window.alert(`Estuary does not support folder upload at the moment, skipping "${file.name}"`);
        continue;
      }

      await this.props.onFile(file);
    }

    if (!this.dirty) {
      this.dirty = true;
      window.addEventListener('beforeunload', this._handleUnloadCheck);
    }

    this.setState({
      ...this.state,
      mode: MODES[1],
    });
  };

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      ...this.state,
      mode: MODES[2],
    });
  };

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      ...this.state,
      mode: MODES[2],
    });
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      ...this.state,
      mode: MODES[1],
    });
  };

  renderDropZone = (mode) => {
    if (mode === MODES[2]) {
      return (
        <div className={styles.drop} style={{ background: `var(--main-primary)`, color: `var(--main-background)` }}>
          <div className={styles.top}>Drop your files here!</div>
        </div>
      );
    }

    if (mode === MODES[3]) {
      return (
        <div className={styles.drop} style={{ background: `var(--main-text)`, color: `var(--main-background)` }}>
          <div className={styles.top}>
            <LoaderSpinner style={{ height: 24, width: 24, marginRight: 16 }} /> Processing...
          </div>
        </div>
      );
    }

    return (
      <div className={styles.drop}>
        <div className={styles.top}>Drag and drop your files here.</div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div ref={this.dropRef}>{this.renderDropZone(this.state.mode)}</div>
        <input multiple className={styles.invisible} onChange={this.handleSelectFile} type="file" id="FILE_UPLOAD_TARGET" />
        {this.state.mode === MODES[1] ? (
          <div className={styles.actions}>
            <Button htmlFor="FILE_UPLOAD_TARGET" type="file" style={{ marginRight: 24, marginBottom: 24 }}>
              Add a file
            </Button>

            <Button
              style={{
                marginBottom: 24,
                background: 'var(--main-button-background-secondary)',
                color: 'var(--main-button-text-secondary)',
              }}
              href="/upload-cid"
            >
              Use a CID instead
            </Button>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}
