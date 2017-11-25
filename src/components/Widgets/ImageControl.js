import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from "react-immutable-proptypes";
import uuid from 'uuid/v4';
import { truncateMiddle } from '../../lib/textHelper';
import AssetProxy, { createAssetProxy } from '../../valueObjects/AssetProxy';

const MAX_DISPLAY_LENGTH = 50;

export default class ImageControl extends React.Component {
  constructor(props) {
    super(props);
    this.controlID = uuid();
  }

  shouldComponentUpdate(nextProps) {
    /**
     * Always update if the value changes.
     */
    if (this.props.value !== nextProps.value) {
      return true;
    }

    /**
     * If there is a media path for this control in the state object, and that
     * path is different than the value in `nextProps`, update.
     */
    const mediaPath = nextProps.mediaPaths.get(this.controlID);
    if (mediaPath && (nextProps.value !== mediaPath)) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    const { mediaPaths, value } = nextProps;
    const mediaPath = mediaPaths.get(this.controlID);
    if (mediaPath && mediaPath !== value) {
      this.props.onChange(mediaPath);
    }
  }

  handleClick = (e) => {
    const { field, onOpenMediaLibrary } = this.props;
    return onOpenMediaLibrary({ controlID: this.controlID, forImage: true, privateUpload: field.get('private') });
  };

  renderFileName = () => {
    const { value } = this.props;
    return value ? truncateMiddle(value, MAX_DISPLAY_LENGTH) : null;
  };

  render() {
    const fileName = this.renderFileName();
    return (
      <div className="nc-fileControl-imageUpload">
        <span className="nc-fileControl-message" onClick={this.handleClick}>
          {fileName ? fileName : 'Click here to select an image from the image library'}
        </span>
      </div>
    );
  }
}

ImageControl.propTypes = {
  field: PropTypes.object.isRequired,
  mediaPaths: ImmutablePropTypes.map.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemoveAsset: PropTypes.func.isRequired,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  value: PropTypes.node,
};
