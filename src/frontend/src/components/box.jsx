import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import BoxService from '../services/box';

import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'material-ui-icons/Add';
import Linkify from 'react-linkify';
import TextTruncate from 'react-text-truncate';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import ActionDeleteIcon from 'material-ui-icons/Delete';

const styles = theme => ({
  root: {
    width: '100%',
  },
  avatar: {
    backgroundColor: red[500],
    float: 'left'
  },
  buttonAdd: {
    margin: theme.spacing.unit,
    flip: false,
    position: 'absolute',
    top: 32,
    right: 32,
  },
  previewCard: {
    float: 'left',
    margin: '0.5em',
    width: '20em',
    height: '12em',
  },
  card: {
    float: 'left',
    margin: '0.5em',
    maxWidth: '20em',
  },
  dialog: {
    width: '30em',
  },
  dialogMessage: {
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  greeting: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start ',
    width: '100%',
    height: '3em',
    marginTop: '1em', // top right bottom left
    marginBottom: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
  greetingName: {
    margin: theme.spacing.unit
  },
  greetingAvatar: {
  },
  greetingCount: {
    margin: theme.spacing.unit,
    marginLeft: '5em',
  },
  showCursor: {
    cursor: 'pointer'
  }
});

class Box extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    boxkey: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      status: 0, // 0: none, 1: loading, 2: loaded - ok, 3: loaded - error
      box: null,
      dialogOpen: false,
      itemMessage: '',
      itemSubject: '',
      itemID: '',

      showItemDialogOpen: false,
      editItemDialogOpen: false,

      currentItem: null,
      currentItemEditing: false,
    };
  }

  componentDidMount() {
    this.loadBox();
  }

  componentWillUnmount() {
    BoxService.next(null);
  }


  deleteCurrentItem = () => {
    const { boxkey } = this.props;

    const body = JSON.stringify({});

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);

    fetch(`/api/boxes/${boxkey}/items/${this.state.itemID}`, {
      method: 'DELETE',
      headers,
      body,
    }).then(rsp => {
      if (rsp.ok) {
        this.hideDialog();
        this.loadBox();
        this.setState({
          dialogOpen: false,
          itemMessage: '',
          itemSubject: '',
          itemID: '',

          showItemDialogOpen: false,
          editItemDialogOpen: false,

          currentItem: null,
          currentItemEditing: false,
        });
      } else {
        console.log(`Error creating new box: ${rsp.status} - ${rsp.statusText}`);
      }
    });
  };

  editCurrentItem = () => {
    this.setState({ editItemDialogOpen: true });
  }

  getAuthorInitials = (nickname) => {
    return nickname
      .split(/\s+/)
      .map(word => word.substr(0, 1))
      .reduce((initials, letter) => `${initials}${letter}`, '');
  }

  hideDialog = () => {
    this.setState({ dialogOpen: false, itemMessage: '' });
  }

  hideShowItemDialog = () => {
    this.setState({ showItemDialogOpen: false, currentItem: null });
  };

  hideEditItemDialog = () => {
    this.setState({ editItemDialogOpen: false });
  };

  loadBox = () => {
    this.setState({ status: 1 });
    fetch(`/api/boxes/${this.props.boxkey}`).then(rsp => {
      if (rsp.ok) {
        rsp.json().then(box => {
          BoxService.next(box);
          this.setState({ box, status: 2 });
        });
      } else {
        this.setState({ status: 3 });
      }
    });
  }

  saveItem = () => {

    const { boxkey } = this.props;

    const body = JSON.stringify({
      message: this.state.itemMessage,
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);

    fetch(`/api/boxes/${boxkey}/items`, {
      method: 'POST',
      headers,
      body,
    }).then(rsp => {
      if (rsp.ok) {
        this.hideDialog();
        this.loadBox();
      } else {
        console.log(`Error creating new box: ${rsp.status} - ${rsp.statusText}`);
      }
    });
  };

  showDialog = () => {
    this.setState({ dialogOpen: true });
  };

  showItemDialog = (item) => {
    this.setState({
      showItemDialogOpen: true,
      currentItem: item,
      itemSubject: item.subject,
      itemMessage: item.message,
      itemID: item.itemID,
    });
  };

  updateItem = () => {
    const { boxkey } = this.props;
    // const itemID = this.state.currentItem ? this.state.currentItem.itemID : '-1';

    const body = JSON.stringify({
      subject: this.state.itemSubject,
      message: this.state.itemMessage,
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);

    fetch(`/api/boxes/${boxkey}/items/${this.state.itemID}`, {
      method: 'PUT',
      headers,
      body,
    }).then(rsp => {
      if (rsp.ok) {
        this.hideDialog();
        this.loadBox();
        this.setState({
          dialogOpen: false,
          itemMessage: '',
          itemSubject: '',
          itemID: '',

          showItemDialogOpen: false,
          editItemDialogOpen: false,

          currentItem: null,
          currentItemEditing: false,
        });
      } else {
        console.log(`Error creating new box: ${rsp.status} - ${rsp.statusText}`);
      }
    });
  };

  updateItemMessage = e => this.setState({itemMessage: e.target.value});
  updateItemSubject = e => this.setState({itemSubject: e.target.value});

  renderBlank = () => {
    return <div className={this.props.classes.root} />;
  };

  renderDialog = () => {

    const { classes } = this.props;

    return (
      <Dialog open={this.state.dialogOpen} onRequestClose={this.hideDialog}>
        <DialogTitle>Neuer Eintrag</DialogTitle>
        <DialogContent className={classes.dialog}>
          <TextField
            className={classes.dialogMessage}
            autoFocus={true}
            margin="dense"
            multiline={true}
            fullWidth={true}
            value={this.state.itemMessage}
            onChange={this.updateItemMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.hideDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={this.saveItem} color="primary" raised={true}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderDialogButton = () => {
    const { classes } = this.props;
    return (
      <Tooltip id="tooltip-icon" title="Neuen Eintrag anlegen">
        <Button
          className={classes.buttonAdd}
          fab={true}
          color="accent"
          aria-label="Neuen Eintrag anlegen"
          onClick={this.showDialog} >
          <AddIcon />
        </Button>
      </Tooltip>
    );
  }

  renderGreeting = () => {

    const { classes } = this.props;
    const { box } = this.state;

    const itemCount = box.items ? box.items.length : 0;

    return (
      <div className={classes.greeting}>
        <div className={classes.greetingName}>
          <Typography type="title">
            Hallo, {box.memberNickname}!
          </Typography>
        </div>
        <div className={classes.greetingAvatar}>
          <Avatar aria-label="Author" className={classes.avatar}>
            {this.getAuthorInitials(box.memberNickname)}
          </Avatar>
        </div>
        <div className={classes.greetingCount}>
          <Typography type="subheading">
            Einträge: {itemCount}
          </Typography>
        </div>
        <div className={classes.flexGrow}/>
      </div>
    );

  }

  renderLoading = () => {
    return (
      <div className={this.props.classes.root}>
        <LinearProgress />
      </div>
    );
  }

  renderLoadedError = () => {
    return (
      <div className={this.props.classes.root}>
        <p>Die Box kann leider nicht gefunden werden.</p>
      </div>
    );
  }

  renderItemDialog = () => {
    const editItemDialogOpen = this.state.editItemDialogOpen;
    return (
      editItemDialogOpen === true ? this.renderEditItemDialog() : this.renderShowItemDialog()
    );
  };

  renderShowItemDialog = () => {
    const item = this.state.currentItem ? this.state.currentItem : {authorNickname: ''};
    const {classes} = this.props;

    return (
      <Dialog open={this.state.showItemDialogOpen} onRequestClose={this.hideShowItemDialog}>
        <Card className={classes.card} >
          <CardHeader
            avatar={
              <Tooltip id="avatar-tooltip" title={item.authorNickname} placement="right">
                <Avatar aria-label="Author" className={classes.avatar}>
                  {this.getAuthorInitials(item.authorNickname)}
                </Avatar>
              </Tooltip>
            }
            title={item.subject}
            subheader={moment(item.creationDate).fromNow()}
            action={
              <div>
                <IconButton onClick={this.deleteCurrentItem}>
                  <ActionDeleteIcon />
                </IconButton>
                <IconButton onClick={this.editCurrentItem}>
                  <ModeEditIcon />
                </IconButton>
              </div>
            }
          />
          <CardContent>
            <Typography component="p">
              <Linkify properties={{target: '_blank'}}>
                {item.message}
              </Linkify>
            </Typography>
          </CardContent>
        </Card>
      </Dialog>
    );
  }

  renderEditItemDialog = () => {
    // const item = this.state.currentItem ? this.state.currentItem : {authorNickname: ''};
    const {classes} = this.props;
    return (
      <Dialog open={this.state.editItemDialogOpen} onRequestClose={this.hideEditItemDialog}>
        <DialogContent className={classes.dialog}>
          <TextField
            className={classes.dialogMessage}
            autoFocus={true}
            margin="dense"
            multiline={false}
            fullWidth={true}
            value={this.state.itemSubject}
            onChange={this.updateItemSubject}
          />
          <TextField
            className={classes.dialogMessage}
            autoFocus={true}
            margin="dense"
            multiline={true}
            fullWidth={true}
            value={this.state.itemMessage}
            onChange={this.updateItemMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.hideEditItemDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={this.updateItem} color="primary" raised={true}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderItem = (index, item) => {
    const { classes } = this.props;

    return (
      <Card className={classes.previewCard} key={`item-${index}`} >
        <CardHeader
          avatar={
            <Tooltip id="avatar-tooltip" title={item.authorNickname} placement="right">
              <Avatar aria-label="Author" className={classes.avatar}>
                {this.getAuthorInitials(item.authorNickname)}
              </Avatar>
            </Tooltip>
          }
          title={item.subject}
          subheader={moment(item.creationDate).fromNow()}
          onClick={() => this.showItemDialog(item)}
          className={classes.showCursor}
        />
        <CardContent>
          <Typography component="p">
            <Linkify properties={{target: '_blank'}}>
              <TextTruncate
                line={3}
                truncateText="…"
                text={item.message}
              />
            </Linkify>
          </Typography>
        </CardContent>
      </Card>
    );
  }

  renderLoadedOK = () => {

    const { classes } = this.props;
    const { box } = this.state;

    const items = box.items ? box.items.sort((a, b) => b.creationDate > a.creationDate) : [];
    const addButton = this.renderDialogButton();
    const greeting = this.renderGreeting();
    const dialog = this.renderDialog();
    const itemDialog = this.renderItemDialog();

    return (
      <div className={classes.root}>
        {addButton}
        {greeting}
        {items.map((item, index) => this.renderItem(index, item))}
        {dialog}
        {itemDialog}
      </div>
    );

  }

  render = () => {

    switch (this.state.status) {
      case 1:
        return this.renderLoading();
      case 2:
        return this.renderLoadedOK();
      case 3:
        return this.renderLoadedError();
    }

    return this.renderBlank();

  }

}

export default withStyles(styles)(Box);
