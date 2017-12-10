import React from 'react';
import { shallow } from 'enzyme';
import EditorToolbar from '../EditorInterface/EditorToolbar';

describe('EntryEditorToolbar', () => {
  it('should have the Save button disabled initally, and the Cancel button enabled', () => {
    const component = shallow(
      <EntryEditorToolbar
        onPersist={() => {}}
        onCancelEdit={() => {}}
        onDelete={() => {}}
      />
    );
    const tree = component.html();
    expect(tree).toMatchSnapshot();
  });

  it('should enable the Save button', () => {
    const component = shallow(
      <EntryEditorToolbar
        enableSave
        onPersist={() => {}}
        onCancelEdit={() => {}}
        onDelete={() => {}}
      />
    );
    const tree = component.html();
    expect(tree).toMatchSnapshot();
  });

  it('should disable and update label of Save button when persisting', () => {
    const component = shallow(
      <EntryEditorToolbar
        isPersisting
        onPersist={() => {}}
        onCancelEdit={() => {}}
        onDelete={() => {}}
      />
    );
    const tree = component.html();
    expect(tree).toMatchSnapshot();
  });
});
