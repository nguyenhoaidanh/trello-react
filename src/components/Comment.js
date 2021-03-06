import React, { Fragment } from 'react';
import dateFormat from 'dateformat';
import { connect } from 'react-redux';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Textarea from 'react-textarea-autosize';
import Typography from '@material-ui/core/Typography';

@connect(({ user, card }) => ({
  currentUser: user.user,
  currentCard: card.currentCard
}))
class Comment extends React.Component {
  state = {
    content: '',
    isEdit: false
  };

  edit = e => {
    const { content } = this.props;
    this.setState({
      isEdit: true,
      content
    });
  };

  onSave = e => {
    const {
      dispatch,
      _id: commentId,
      currentUser: { _id: idUserEdit }
    } = this.props;
    const { content } = this.state;
    this.setState({ isEdit: false });
    dispatch({
      type: 'comment/editCommentRequest',
      payload: {
        commentId,
        idUserEdit,
        content
      }
    });
  };

  handleInputChange = e => {
    this.setState({
      content: e.target.value
    });
  };

  render() {
    const styles = {
      avatar: {
        margin: 10
      },
      cardContainer: {
        marginBottom: 8
      },
      orangeAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: deepOrange[500]
      },
      purpleAvatar: {
        margin: 10,
        color: '#fff',
        float: 'left',
        backgroundColor: deepPurple[500]
      },
      username: {
        display: 'inline-block',
        fontColor: 'brown',
        fontWeight: 'bold'
      },
      textarea: {
        resize: 'none',
        width: '100%',
        height: '200px',
        outline: 'none',
        border: 'none',
        overflow: 'hidden',
        borderRadius: '5px',
        padding: '5px'
      },
      bootstrapRoot: {
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ].join(','),
        '&:hover': {
          backgroundColor: '#0069d9',
          borderColor: '#0062cc'
        },
        '&:active': {
          boxShadow: 'none',
          backgroundColor: '#0062cc',
          borderColor: '#005cbf'
        },
        '&:focus': {
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
        }
      },
      margin: {
        float: 'right',
        margin: '0px -10px 3px 0px'
      }
    };

    const { content, imageUrl, username, dateCreated } = this.props;
    const { isEdit } = this.state;
    const body = isEdit ? (
      <div>
        <Textarea
          autoFocus
          value={this.state.content}
          minRows={2}
          onChange={this.handleInputChange}
          style={{ ...styles.textarea, border: '1px solid blue' }}
          name={content}
        />
        <Button
          onClick={this.onSave}
          variant="contained"
          color="primary"
          disableRipple
          style={{ ...styles.margin, ...styles.bootstrapRoot }}
        >
          {' '}
          Lưu{' '}
        </Button>
      </div>
    ) : (
      <div>
        <Typography gutterBottom>{content}</Typography>
        <a style={{ float: 'right', cursor: 'pointer' }} onClick={this.edit}>
          <i className="material-icons md-18" style={{ fontSize: 15 }}>
            edit
          </i>
        </a>
      </div>
    );

    return (
      <Fragment>
        <Avatar style={styles.purpleAvatar} src={imageUrl}>
          {username.substring(0, 2)}
        </Avatar>
        <Typography style={styles.username} gutterBottom>
          {username}
        </Typography>
        <Card style={styles.cardContainer} onClick={this.onClick}>
          <CardContent>{body}</CardContent>
        </Card>
        <Typography align="right">
          {dateFormat(new Date(dateCreated), 'dddd, mmmm dS, yyyy, h:MM:ss TT')}
        </Typography>
        <hr />
      </Fragment>
    );
  }
}

export default Comment;
