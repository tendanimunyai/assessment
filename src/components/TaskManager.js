/**
 * I didn't get enough time to make it modular
 * The idea was to decouple this js file into
 * api.js - which does api calls
 * context - which manages the state.
 * taskItem - which represent specific task
 * taskForm - which contains the edit text box and buttons
 *
 */
import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_URL = "http://localhost:8080/api/taskmanager/operations/v1";

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState("");

    useEffect(() => {
        axios.get(API_URL + "/findAll")
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the tasks!", error);
            });
    }, []);

    /**
     * Handles task creation
     */
    const createTask = () => {
        if (newTask.trim()) {
            axios.post(API_URL + "/save", {description: newTask, text: newTask, name: newTask})
                .then((response) => {
                    setTasks([...tasks, response.data]);
                    setNewTask(""); // Clear the input field
                })
                .catch((error) => {
                    console.error("There was an error adding the task!", error);
                });
        }
    };

    /**
     * Delete task
     * @param taskId
     */
    const deleteTask = (taskId) => {
        const url = API_URL + "/task/" + taskId;
        axios.delete(url)
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== taskId));
            })
            .catch((error) => {
                console.error("There was an error deleting the task!", error);
            });
    };

    /**
     *
     * @param taskId
     * @param taskText
     */
    const updateTask = (taskId, taskText) => {
        setEditMode(true);
        setEditTaskId(taskId);
        setEditTaskText(taskText);
    };

    /**
     * saveEditedTask - Save edited task
     */
    const saveEditedTask = () => {

        axios.patch(`${API_URL}/update/${editTaskId}`, {text: editTaskText})
            .then((response) => {
                setTasks(tasks.map((t) => (t.id === editTaskId ? response.data : t)));
                setEditMode(false);
                setEditTaskId(null);
                setEditTaskText("");
            })
            .catch((error) => {
                console.error("There was an error saving the edited task!", error);
            });
    };

    /**
     *  Cancel Edit task
     */
    const cancelEdit = () => {
        setEditMode(false);
        setEditTaskId(null);
        setEditTaskText("");
    };

    return (
        <div className="main">
            <h1>Task Manager</h1>

            {!editMode ? (
                <div>
                    <TextField
                        label="New Task"
                        variant="outlined"
                        fullWidth
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        style={{marginBottom: 20}}
                    />
                    <Button variant="contained" color="primary" onClick={createTask}>Add Task</Button>
                </div>
            ) : (
                <div>
                    <TextField
                        label="Edit Task"
                        variant="outlined"
                        fullWidth
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        style={{marginBottom: 20}}
                    />
                    <Button variant="contained" color="primary" onClick={saveEditedTask}>Save</Button>
                    <Button variant="outlined" onClick={cancelEdit} style={{marginLeft: 10}}>Cancel</Button>
                </div>
            )}

            <List style={{marginTop: 10}}>
                {tasks.map((task) => (
                    <ListItem key={task.id}>
                        <ListItemText className="textBox" primary={task.text}/>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" color="primary" onClick={() => updateTask(task.id, task.text)}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton edge="end" color="secondary" onClick={() => deleteTask(task.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default TaskManager;
