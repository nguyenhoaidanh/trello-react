import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from 'material-ui-pickers';

import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import AutoCompleteTextField from '@/components/AutoCompleteTextField';

// this form user for sub form in card detail
const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    //  Use the system font instead of the default Roboto font.
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
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase);

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    color: 'brown'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: 5,
    marginRight: 5
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  grid: {
    width: '60%'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  bootstrapFormLabel: {
    fontSize: 18
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  button: {
    magin: 7
  }
});

const customStyle = {
  root: {
    flexGrow: 1
  },
  title: {
    color: 'brown'
  },

  textField: {
    marginLeft: 5,
    marginRight: 5
  },
  button: {
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10
  },
  margin: {
    width: 130,
    marginLeft: 9,
    marginTop: -15
  }
};

@connect(({ card, user, list, board }) => ({
  currentCard: card.currentCard,
  currentUser: user.user,
  lists: list.lists,
  boardInfo: board.boardInfo,
  cards: card.cards
}))
@withStyles(styles)
class DialogForm extends React.Component {
  state = {
    labelColor: null,
    labelText: '',
    username: null,
    deadline: null,
    selectedName: '',
    order: '',
    listId: '',
    totalCard: 0
  };

  handleClose = () => {
    this.props.onClose(null);
  };

  handleChange = e => {
    const { lists, cards } = this.props;
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'listId') {
      //  if select listId, count num of card
      for (var x of lists) {
        if (x._id === value) this.setState({ totalCard: cards[value].length });
      }
    }
    this.setState({ [name]: value });
  };

  handleDateChange = date => {
    this.setState({ deadline: date });
  };

  onSave = kind => {
    const {
      dispatch,
      currentCard: { _id: cardId },
      currentUser: { _id: idUserEdit }
    } = this.props;
    const { deadline, labelText, labelColor } = this.state;
    dispatch({
      type: 'card/editCardRequest',
      payload: {
        cardId,
        idUserEdit,
        deadline,
        label: {
          labelColor,
          labelText
        }
      }
    });
    this.props.onClose(null);
  };

  checkKind(nextProps, obj) {
    if (nextProps.kind === 'ADD_MEMBER_FORM') {
      obj.isMemberForm = true;
    } else if (nextProps.kind === 'ADD_LABEL_FORM') {
      obj.isLabelForm = true;
    } else if (nextProps.kind === 'ADD_DEADLINE_FORM') {
      obj.isDeadlineForm = true;
    } else if (nextProps.kind === 'MOVE_FORM') {
      obj.isMoveForm = true;
    } else if (nextProps.kind === 'DELETE_FORM') {
      obj.isDeleteForm = true;
    }
  }

  move = () => {
    const { order, listId: newListId } = this.state;
    if (order === null || newListId === null) return false;

    const {
      dispatch,
      currentCard: { _id: cardId, listId: oldListId },
      currentUser: { _id: idUserMove }
    } = this.props;
    dispatch({
      type: 'card/moveCardRequest',
      payload: {
        cardId,
        newListId,
        oldListId,
        idUserMove,
        order
      }
    });

    this.props.onClose(null);
  };

  delete = () => {
    const {
      dispatch,
      currentCard: { _id: cardId },
      currentUser: { _id: idUserRemove },
      boardInfo: { _id: boardId }
    } = this.props;
    dispatch({
      type: 'card/deleteCardRequest',
      payload: { cardId, idUserRemove }
    });
    this.props.onClose(null); // close sub form
    dispatch({
      type: 'card/toggleModal', // toggle modal detail card
      payload: { card: null }
    });
    // update list
    dispatch({
      type: 'list/fetchListOfBoard',
      payload: {
        boardId
      }
    });
  };

  clickLabel = e => {
    var btn = document.getElementsByName('label');
    for (var x of btn) x.innerHTML = '';
    e.target.innerHTML = `<i style={{float:'right'}}>✔</i>`;
    this.setState({ labelColor: e.target.style.backgroundColor });
  };

  render() {
    const {
      classes,
      lists,
      onClose,
      currentCard,
      selectedName,
      // react warn for these when use other below
      currentUser,
      boardInfo,
      dispatch,
      ...other
    } = this.props;
    const { deadline, totalCard } = this.state;
    var obj = {};
    this.checkKind(this.props, obj); // because component will receive props not work ??????????
    var title, form;

    if (obj.isMemberForm) {
      title = 'Thêm thành viên';
      form = <AutoCompleteTextField kind="card" />;
    } else if (obj.isLabelForm) {
      title = 'Thêm nhãn';
      form = (
        <div style={customStyle.textField}>
          <TextField
            margin="dense"
            label="Thêm tên nhãn"
            style={styles.textField}
            value={this.state.labelText}
            fullWidth
            onChange={this.handleChange}
            variant="outlined"
            name="labelText"
          />
          <br />
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'red', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'yellow', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'orange', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>{' '}
          <br />
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'blue', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'green', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: '#d27af4', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>{' '}
          <br />
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: '#1eedab', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'gray', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <Button
            onClick={this.clickLabel}
            name="label"
            variant="contained"
            style={{ backgroundColor: 'brown', height: 35, width: 100 }}
            className={classes.button}
          >
            {' '}
          </Button>
          <br />
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => this.onSave('label')}
          >
            Lưu
          </Button>
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="secondary"
            onClick={this.handleClose}
          >
            Hủy bỏ
          </Button>
        </div>
      );
    } else if (obj.isDeadlineForm) {
      title = 'Thêm Deadline';
      form = (
        <div style={customStyle.textField}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <DatePicker
                style={customStyle.margin}
                required
                margin="normal"
                label="Date picker"
                value={deadline}
                onChange={this.handleDateChange}
              />
              <TimePicker
                required
                style={customStyle.margin}
                margin="normal"
                label="Time picker"
                value={deadline}
                onChange={this.handleDateChange}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => this.onSave('deadline')}
          >
            Lưu
          </Button>
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="secondary"
            onClick={this.handleClose}
          >
            Hủy bỏ
          </Button>
        </div>
      );
    } else if (obj.isMoveForm) {
      title = 'Di chuyển';
      form = (
        <div style={customStyle.textField}>
          <FormControl className={classes.margin}>
            <InputLabel
              htmlFor="age-customized-native-simple"
              className={classes.bootstrapFormLabel}
            >
              Danh sách
            </InputLabel>
            <Select
              autoWidth
              required
              style={{ width: 200 }}
              value={this.state.listId}
              onChange={this.handleChange}
              input={<BootstrapInput name="listId" />}
            >
              {lists.map(ls => {
                if (ls._id === currentCard.listId)
                  return (
                    <MenuItem key={ls._id} value={ls._id}>
                      {ls.name}
                      <i className="material-icons">done </i>
                    </MenuItem>
                  );
                else
                  return (
                    <MenuItem key={ls._id} value={ls._id}>
                      {ls.name}
                    </MenuItem>
                  );
              })}
            </Select>
          </FormControl>

          <FormControl className={classes.margin}>
            <InputLabel
              htmlFor="age-customized-select"
              className={classes.bootstrapFormLabel}
            >
              {' '}
              Thứ tự{' '}
            </InputLabel>
            <Select
              required
              value={this.state.order}
              onChange={this.handleChange}
              input={<BootstrapInput name="order" />}
            >
              {(function() {
                var t = [];
                for (var x = 0; x <= totalCard; x++)
                  t.push(
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  );
                return t;
              })()}
            </Select>
          </FormControl>
          <br />
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="primary"
            onClick={this.move}
          >
            Lưu
          </Button>
          <Button
            style={customStyle.button}
            size="small"
            variant="contained"
            color="secondary"
            onClick={this.handleClose}
          >
            Hủy bỏ
          </Button>
        </div>
      );
    } else if (obj.isDeleteForm) {
      title = 'Bạn muốn xóa Task này chứ?';
      form = (
        <div>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <i className="material-icons"> warning </i> Task này sẽ bị xóa
              vĩnh viễn !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.delete}
              style={customStyle.button}
              size="small"
              variant="contained"
              color="primary"
              autoFocus
            >
              {' '}
              Đồng ý{' '}
            </Button>
            <Button
              onClick={this.handleClose}
              style={customStyle.button}
              size="small"
              variant="contained"
              color="secondary"
            >
              {' '}
              Hủy{' '}
            </Button>
          </DialogActions>
        </div>
      );
    }
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">
          <Typography align="center" style={styles.title}>
            {title}
          </Typography>
        </DialogTitle>
        <div>{form}</div>
      </Dialog>
    );
  }
}

DialogForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedName: PropTypes.string
};

@connect(({ card }) => ({ subForm: card.subForm }))
class CustomForm extends React.Component {
  state = {
    open: false,
    selectedName: '',
    kind: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      kind: nextProps.subForm.kind,
      open: nextProps.subForm.open
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = value => {
    this.setState({ selectedName: value, open: false, kind: null });
    const { dispatch } = this.props;
    dispatch({
      type: 'card/toggleSubForm',
      payload: { kind: null, open: false }
    });
  };

  render() {
    const { open, selectedName, kind } = this.state;
    if (!open) return null;
    return (
      <div>
        <DialogForm
          onClose={this.handleClose}
          selectedName={selectedName}
          open={open}
          kind={kind}
        />
      </div>
    );
  }
}
export default CustomForm;
