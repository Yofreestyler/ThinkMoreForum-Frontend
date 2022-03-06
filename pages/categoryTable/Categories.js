import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
// import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Search } from '@material-ui/icons';
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from '@material-ui/core';
import CategoryForm from './CategoryForm';
// import PageHeader from '../../components/CategoryManager/PageHeader';
import useTable from '../../components/CategoryManager/useTable';
import * as categoryServices from '../../services/categoryService';
import Controls from '../../components/CategoryManager/controls/Controls';
import Popup from '../../components/CategoryManager/Popup';
import Notification from '../../components/CategoryManager/Notification';
import ConfirmDialog from '../../components/CategoryManager/ConfirmDialog';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: '75%',
  },
  newButton: {
    position: 'absolute',
    right: '10px',
  },
}));

const headCells = [
  { id: 'title', label: 'Category Title' },
  { id: 'description', label: 'Description' },
  { id: 'color', label: 'Color' },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

const Category = () => {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  // false = add, true = edit
  const [records, setRecords] = useState(null);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  useEffect(() => {
    const getCategory = async () => {
      const { data: categoriesInfo } =
        await categoryServices.getAllCategories();
      setRecords(categoriesInfo);
    };
    getCategory();
  }, []);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const { TblContainer, TblHead, TblPagination } = useTable(
    records,
    headCells,
    filterFn,
  );

  const handleSearch = (e) => {
    const { target } = e;
    setFilterFn({
      fn: (items) => {
        if (target.value === '') return items;
        return items.filter((x) =>
          x.title.toLowerCase().includes(target.value),
        );
      },
    });
  };

  const add = async (category, resetForm) => {
    categoryServices.insertCategory(category);
    // else categoryServices.updateEmployee(category);
    resetForm();
    const { data: categoriesInfo } = await categoryServices.getAllCategories();
    setRecords(categoriesInfo);
    setRecordForEdit(null);
    setOpenPopup(false);
    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      type: 'success',
    });
  };
  const edit = async (category, resetForm) => {
    categoryServices.updateCategory(category);
    console.log(`adc edit`);
    // else categoryServices.updateEmployee(category);
    resetForm();
    const { data: categoriesInfo } = await categoryServices.getAllCategories();
    setRecords(categoriesInfo);
    setRecordForEdit(null);
    setOpenPopup(false);
    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      type: 'success',
    });
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    categoryServices.deleteCategory(id);
    const { data: categoriesInfo } = await categoryServices.getAllCategories();
    setRecords(categoriesInfo);
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      type: 'error',
    });
  };

  if (records === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search Category"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.Button
            text="Add Category"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {records.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Are you sure to delete this record?',
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(item.id);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title="Category Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CategoryForm
          recordForEdit={recordForEdit}
          addOrEdit={recordForEdit ? edit : add}
        />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};
export default Category;
