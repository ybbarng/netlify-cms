import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Map, fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { resolveWidget } from '../Widgets';
import ControlHOC from '../Widgets/ControlHOC';
import { sanitizeSlug } from "../../lib/urlHelper";

function isHidden(field) {
  return field.get('widget') === 'hidden';
}

export default class ControlPane extends Component {
  componentValidate = {};
  processControlRef(fieldName, wrappedControl) {
    if (!wrappedControl) return;
    this.componentValidate[fieldName] = wrappedControl.validate;
  }

  validate = () => {
    this.props.fields.forEach((field) => {
      if (isHidden(field)) return;
      this.componentValidate[field.get("name")]();
    });
  };

  controlFor(field) {
    const {
      entry,
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveAsset,
      autoFields,
    } = this.props;
    const widget = resolveWidget(field.get('widget'));
    const fieldName = field.get('name');
    const value = entry.getIn(['data', fieldName]);
    if (autoFields && autoFields.has(fieldName) && !value) {
      onChange(fieldName, autoFields.get(fieldName));
    }
    const metadata = fieldsMetaData.get(fieldName);
    const errors = fieldsErrors.get(fieldName);
    const labelClass = errors ? 'nc-controlPane-label nc-controlPane-labelWithError' : 'nc-controlPane-label';
    if (entry.size === 0 || entry.get('partial') === true) return null;

    function onChangeField(changeFieldName, newValue, newMetadata) {
      onChange(changeFieldName, newValue, newMetadata);
      if (fieldName === 'title') {
        const slug = newValue.toLocaleLowerCase()
        .replace(/[.\s]/g, '-');
        onChange('path', `/posts/${ sanitizeSlug(slug) }`, newMetadata);
      }
    }
    return (
      <div className="nc-controlPane-control">
        <label className={labelClass} htmlFor={fieldName}>{field.get('label')}</label>
        <ul className="nc-controlPane-errors">
          {
            errors && errors.map(error =>
              error.message &&
              typeof error.message === 'string' &&
              <li key={error.message.trim().replace(/[^a-z0-9]+/gi, '-')}>{error.message}</li>
            )
          }
        </ul>
        <ControlHOC 
          controlComponent={widget.control}
          field={field}
          value={value}
          mediaPaths={mediaPaths}
          metadata={metadata}
          onChange={(newValue, newMetadata) => onChangeField(fieldName, newValue, newMetadata)}
          onValidate={this.props.onValidate.bind(this, fieldName)}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onAddAsset={onAddAsset}
          onRemoveAsset={onRemoveAsset}
          getAsset={getAsset}
          ref={this.processControlRef.bind(this, fieldName)}
        />
      </div>
    );
  }

  render() {
    const { collection, fields } = this.props;
    if (!collection || !fields) {
      return null;
    }

    return (
      <div className="nc-controlPane-root">
        {
          fields.map((field, i) => {
            if (isHidden(field)) {
              return null;
            }
            return <div key={i} className="nc-controlPane-widget">{this.controlFor(field)}</div>;
          })
        }
      </div>
    );
  }
}

ControlPane.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  fieldsErrors: ImmutablePropTypes.map.isRequired,
  mediaPaths: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onRemoveAsset: PropTypes.func.isRequired,
  autoFields: ImmutablePropTypes.map,
};
