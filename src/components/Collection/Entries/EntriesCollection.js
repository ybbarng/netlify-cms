import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { loadEntries } from 'Actions/entries';
import { selectEntries } from 'Reducers';
import Entries from './Entries';

class EntriesCollection extends React.Component {
  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    publicFolder: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number,
    entries: ImmutablePropTypes.list,
    isFetching: PropTypes.bool.isRequired,
    viewStyle: PropTypes.string,
  };

  componentDidMount() {
    const { collection, dispatch } = this.props;
    if (collection) {
      dispatch(loadEntries(collection));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { collection, dispatch } = this.props;
    if (nextProps.collection !== collection) {
      dispatch(loadEntries(nextProps.collection));
    }
  }

  render () {
    const { dispatch, collection, entries, publicFolder, page, isFetching, viewStyle } = this.props;

    return (
      <Entries
        collections={collection}
        entries={entries}
        publicFolder={publicFolder}
        page={page}
        onPaginate={() => dispatch(loadEntries(collection, page))}
        isFetching={isFetching}
        collectionName={collection.get('label')}
        viewStyle={viewStyle}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { name, collection, viewStyle } = ownProps;
  const { config } = state;
  const publicFolder = config.get('public_folder');
  const page = state.entries.getIn(['pages', collection.get('name'), 'page']);

  const entries = selectEntries(state, collection.get('name'));
  const isFetching = state.entries.getIn(['pages', collection.get('name'), 'isFetching'], false);

  return { publicFolder, collection, page, entries, isFetching, viewStyle };
}

export default connect(mapStateToProps)(EntriesCollection);
