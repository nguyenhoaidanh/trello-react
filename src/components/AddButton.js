import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { connect } from 'react-redux';

import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

@connect(({ user, board }) => ({
  currentUser: user.user,
  boardInfo: board.boardInfo
}))
class AddButton extends Component {
  state = {
    formOpen: false,
    text: ''
  };

  openForm = () => {
    this.setState({
      formOpen: true
    });
  };

  closeForm = () => {
    this.setState({
      formOpen: false
    });
  };

  handleInputChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  handleAddList = () => {
    const { text } = this.state;
    if (text) {
      console.log('add list button pressed');
      const { dispatch, currentUser, boardInfo } = this.props;
      dispatch({
        type: 'list/addListRequest',
        payload: {
          name: text,
          ownerId: currentUser._id,
          boardId: boardInfo._id
        }
      });
      this.setState({
        text: ''
      });
      this.closeForm();
    }
  };

  handleAddCard = () => {
    const { text } = this.state;
    if (text) {
      console.log('add card button pressed');
      const { dispatch, idList, currentUser } = this.props;
      dispatch({
        type: 'card/addCardRequest',
        payload: {
          title: text,
          ownerId: currentUser._id,
          listId: idList
        }
      });
      this.setState({
        text: ''
      });
      this.closeForm();
    }
  };

  render() {
    const styles = {
      openFormButtonGroup: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 3,
        height: 36,
        width: 272,
        paddingLeft: 10
      },
      formButtonGroup: {
        marginTop: 8,
        display: 'flex',
        alignItems: 'center'
      }
    };

    const renderAddButton = () => {
      const { color, list } = this.props;
      const buttonText = list ? 'Thêm danh sách khác' : 'Thêm thẻ khác';
      const textOpacity = list ? 1 : 0.5;
      const textColor = list ? 'while' : 'inherit';
      const buttonBackground = list ? 'rgba(0,0,0,.15)' : 'inherit';

      return (
        <div
          onClick={this.openForm}
          style={{
            ...styles.openFormButtonGroup,
            opacity: textOpacity,
            color: textColor,
            backgroundColor: buttonBackground
          }}
        >
          <Icon style={{ color: color }}>add</Icon>
          <p style={{ minWidth: 272, color: color }}>{buttonText}</p>
        </div>
      );
    };

    const renderCard = () => {
      const { list } = this.props;
      const placeHolder = list
        ? 'Nhập tiêu đề danh sách'
        : 'Nhập tiêu đề cho thẻ';
      const buttonTitle = list ? 'Thêm danh sách' : 'Thêm thẻ';
      const { text } = this.state;

      return (
        <div>
          <Card
            style={{
              minHeight: 65,
              minWidth: 272,
              padding: '6px 8px 2px'
            }}
          >
            <Textarea
              placeholder={placeHolder}
              autoFocus
              onBlur={this.closeForm}
              value={text}
              onChange={this.handleInputChange}
              onKeyPress={ev => {
                if (ev.key === 'Enter' && text !== '') {
                  if (list) this.handleAddList();
                  else this.handleAddCard();
                }
              }}
              style={{
                resize: 'none',
                width: '100%',
                outline: 'none',
                border: 'none',
                overflow: 'hidden'
              }}
            />
          </Card>
          <div style={styles.formButtonGroup}>
            <Button
              variant="contained"
              onMouseDown={list ? this.handleAddList : this.handleAddCard}
              style={{ color: 'white', backgroundColor: '#5aac44' }}
            >
              {buttonTitle}
            </Button>
            <Icon
              style={{
                marginLeft: 8,
                cursor: 'pointer'
              }}
            >
              close
            </Icon>
          </div>
        </div>
      );
    };

    const { formOpen } = this.state;
    return formOpen ? renderCard() : renderAddButton();
  }
}

export default AddButton;
