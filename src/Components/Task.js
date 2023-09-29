import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, DialogContentText } from '@mui/material';
import { Delete, Edit, AddCircle, Close } from '@mui/icons-material';
import axios from 'axios';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', status: 'Pending',assignee:localStorage.getItem('username') });
  const [editTask, setEditTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const  token=localStorage.getItem('token')

  useEffect(() => {
    // Fetch task data from your backend API
    axios.get('http://127.0.0.1:8000/tasks/', {
        headers: {
            Authorization: `Token ${token}`// Set the token in the headers
        }})
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleAddTask = () => {
    let username=localStorage.getItem('username')
    setNewTask({ title: '', description: '', due_date: '', status: 'Pending' ,assignee:username});
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (editTask) {
      // Check if required fields are filled when editing
      if (!editTask.title || !editTask.due_date) {
        alert('Title and Due Date are required.');
        return;
      }

      // Update the task on the backend
      axios.put(`http://127.0.0.1:8000/tasks/${editTask.id}/`,editTask,{
        headers: {
            Authorization: `Token ${token}`// Set the token in the headers
        }})
        .then(() => {
          // Update the task in the local state
          const updatedTasks = tasks.map((task) => (task.id === editTask.id ? editTask : task));
          setTasks(updatedTasks);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    } else if (newTask.title && newTask.due_date) {
      // Add a new task to the backend
      axios.post('http://127.0.0.1:8000/tasks/',newTask,{
        headers: {
            Authorization: `Token ${token}`// Set the token in the headers
        }}, )
        .then((response) => {
          // Update the local state with the newly created task
          setTasks([...tasks, response.data]);
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    } else {
      alert('Title and Due Date are required.');
      return;
    }

    setDialogOpen(false);
    setEditTask(null);
    setNewTask({ title: '', description: '', due_date: '', status: 'Pending' });
  };

  const handleDeleteTask = (task) => {
    setConfirmDelete(task);
  };

  const handleConfirmDelete = () => {
    // Delete the task from the backend
    axios.delete(`http://127.0.0.1:8000/tasks/${confirmDelete.id}/`,{
        headers: {
            Authorization: `Token ${token}`// Set the token in the headers
        }})
      .then(() => {
        // Update the local state by removing the deleted task
        const updatedTasks = tasks.filter((t) => t.id !== confirmDelete.id);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });

    setConfirmDelete(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditTask(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Task Manager</h2>

      <div className="mb-3" style={{float:'left'}}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircle />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}   PaperProps={{ style: { width: '400px' } }}>
        <DialogTitle style={{textAlign:'center'}}> 
        {editTask ? 'Edit Task' : 'Add Task'}
          {editTask ? (
            <IconButton color="secondary" style={{ position: 'absolute', right: '16px', top: '8px' }} onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          ) : null}
          {!editTask ? (
            <IconButton color="secondary" style={{ position: 'absolute', right: '16px', top: '8px' }} onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
        <InputLabel>Title</InputLabel>
          <TextField
            fullWidth
            required
            value={editTask ? editTask.title : newTask.title}
            onChange={(e) => {
              if (editTask) {
                setEditTask({ ...editTask, title: e.target.value });
              } else {
                setNewTask({ ...newTask, title: e.target.value });
              }
            }}
            style={{ marginBottom: '16px' }}
          />
          <InputLabel>Description</InputLabel>
          <TextField
            fullWidth
            value={editTask ? editTask.description : newTask.description}
            onChange={(e) => {
              if (editTask) {
                setEditTask({ ...editTask, description: e.target.value });
              } else {
                setNewTask({ ...newTask, description: e.target.value });
              }
            }}
            style={{ marginBottom: '16px' }}
          />
         <InputLabel>Due Date</InputLabel>
          <TextField
            fullWidth
            type="date"
            required
            value={editTask ? editTask.due_date : newTask.due_date}
            onChange={(e) => {
              if (editTask) {
                setEditTask({ ...editTask, due_date: e.target.value });
              } else {
                setNewTask({ ...newTask, due_date: e.target.value });
              }
            }}

          />
        <InputLabel >Status</InputLabel>
          <FormControl fullWidth>
            <Select
              value={editTask ? editTask.status : newTask.status}
              onChange={(e) => {
                if (editTask) {
                  setEditTask({ ...editTask, status: e.target.value });
                } else {
                  setNewTask({ ...newTask, status: e.target.value });
                }
              }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleSaveTask}>
            Save
          </Button>
          <Button color="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => handleEditTask(task)}
                    style={{marginRight:'10px'}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Task;
