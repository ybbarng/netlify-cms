import PropTypes from 'prop-types';
import React from 'react';
import { Editor as Slate } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { debounce } from 'lodash';
import Toolbar from '../Toolbar/Toolbar';
import { Sticky } from '../../../../UI/Sticky/Sticky';

export default class RawEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Plain.deserialize(this.props.value || ''),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.value.equals(nextState.value);
  }

  handleChange = change => {
    if (!this.state.value.document.equals(change.value.document)) {
      this.handleDocumentChange(change);
    }
    this.setState({ value: change.value });
  };

  /**
   * When the document value changes, serialize from Slate's AST back to plain
   * text (which is Markdown) and pass that up as the new value.
   */
  handleDocumentChange = debounce(change => {
    const value = Plain.serialize(change.value);
    this.props.onChange(value);
  }, 150);

  /**
   * If a paste contains plain text, deserialize it to Slate's AST and insert
   * to the document. Selection logic (where to insert, whether to replace) is
   * handled by Slate.
   */
  handlePaste = (e, data, change) => {
    if (data.text) {
      const fragment = Plain.deserialize(data.text).document;
      return change.insertFragment(fragment);
    }
  };

  handleToggleMode = () => {
    this.props.onMode('visual');
  };

  render() {
    return (
      <div className="nc-rawEditor-rawWrapper">
        <Sticky
          className="nc-visualEditor-editorControlBar"
          classNameActive="nc-visualEditor-editorControlBarSticky"
          fillContainerWidth
        >
          <Toolbar onToggleMode={this.handleToggleMode} disabled rawMode />
        </Sticky>
        <Slate
          className="nc-rawEditor-rawEditor"
          value={this.state.value}
          onChange={this.handleChange}
          onPaste={this.handlePaste}
        />
      </div>
    );
  }
}

RawEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onMode: PropTypes.func.isRequired,
  value: PropTypes.string,
};
