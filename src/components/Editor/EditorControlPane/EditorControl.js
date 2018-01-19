import React from 'react';
import { partial } from 'lodash';
import c from 'classnames';
import { resolveWidget } from 'Lib/registry';
import Widget from './Widget';
import { sanitizeSlug } from "../../../lib/urlHelper";

export default class EditorControl extends React.Component {
  state = {
    activeLabel: false,
  };

  render() {
    const {
      value,
      field,
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      onValidate,
      processControlRef,
      autoFields,
    } = this.props;
    const widgetName = field.get('widget');
    const widget = resolveWidget(widgetName);
    const fieldName = field.get('name');
    const metadata = fieldsMetaData && fieldsMetaData.get(fieldName);
    if (autoFields && autoFields.has(fieldName) && !value) {
      onChange(fieldName, autoFields.get(fieldName));
    }

    function onChangeField(changeFieldName, newValue, newMetadata) {
      onChange(changeFieldName, newValue, newMetadata);
      if (fieldName === 'title') {
        const slug = newValue.toLocaleLowerCase()
        .replace(/[.\s]/g, '-');
        onChange('path', `/posts/${ sanitizeSlug(slug) }`, newMetadata);
      }
    }

    const errors = fieldsErrors && fieldsErrors.get(fieldName);
    return (
      <div className="nc-controlPane-control">
        <ul className="nc-controlPane-errors">
          {
            errors && errors.map(error =>
              error.message &&
              typeof error.message === 'string' &&
              <li key={error.message.trim().replace(/[^a-z0-9]+/gi, '-')}>{error.message}</li>
            )
          }
        </ul>
        <label
          className={c({
            'nc-controlPane-label': true,
            'nc-controlPane-labelActive': this.state.styleActive,
            'nc-controlPane-labelWithError': !!errors,
          })}
          htmlFor={fieldName}
        >
          {field.get('label')}
        </label>
        <Widget
          classNameWrapper={c({
            'nc-controlPane-widget': true,
            'nc-controlPane-widgetActive': this.state.styleActive,
            'nc-controlPane-widgetError': !!errors,
          })}
          classNameWidget="nc-controlPane-widget"
          classNameWidgetActive="nc-controlPane-widgetNestable"
          classNameLabel="nc-controlPane-label"
          classNameLabelActive="nc-controlPane-labelActive"
          controlComponent={widget.control}
          field={field}
          value={value}
          mediaPaths={mediaPaths}
          metadata={metadata}
          onChange={(newValue, newMetadata) => onChangeField(fieldName, newValue, newMetadata)}
          onValidate={onValidate && partial(onValidate, fieldName)}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onRemoveInsertedMedia={onRemoveInsertedMedia}
          onAddAsset={onAddAsset}
          getAsset={getAsset}
          hasActiveStyle={this.state.styleActive}
          setActiveStyle={() => this.setState({ styleActive: true })}
          setInactiveStyle={() => this.setState({ styleActive: false })}
          ref={processControlRef && partial(processControlRef, fieldName)}
          editorControl={EditorControl}
        />
      </div>
    );
  }
}
