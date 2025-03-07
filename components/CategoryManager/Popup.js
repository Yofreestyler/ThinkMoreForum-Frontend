import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  // makeStyles,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Controls from './controls/Controls';

const StyDialog = styled(Dialog)`
  padding: 16px;
  position: absolute;
  top: 40px;
`;

const DialogWrapper = styled(DialogTitle)`
  padding-right: 0px;
`;

const Popup = (props) => {
  const { children, openPopup, setOpenPopup } = props;
  // const classes = useStyles();
  return (
    <StyDialog
      open={openPopup}
      maxWidth="md"
      // classes={{ paper: classes.dialogWrapper }}
    >
      <DialogWrapper>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            llll
          </Typography>
          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogWrapper>
      <DialogContent dividers>{children}</DialogContent>
    </StyDialog>
  );
};

export default Popup;
