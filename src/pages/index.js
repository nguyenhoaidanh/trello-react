import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import BasicLayout from '@/layouts/basic';

const styles = {
  card: {
    maxWidth: 345
  },
  media: {
    height: 140,
    objectFit: 'cover'
  }
};

@connect(({ user }) => ({
  user: user.user,
  role: user.role,
  board: user.board,
  fetchStatus: user.status
}))
@withStyles(styles)
class Index extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrentUser',
      payload: {}
    });
    dispatch({
      // clear list when back to home page
      type: 'list/clear',
      payload: {}
    });
  }

  componentWillReceprops(props) {
    const { dispatch } = props;
    dispatch.user.fetchCurrentUser();
  }

  render() {
    const { fetchStatus, user = {}, board = [] } = this.props;
    if (!user && fetchStatus === undefined) return 'Loading...';
    return <BasicLayout board={board} />;
  }
}

export default Index;
