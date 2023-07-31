import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProjectHome from './pages/projects/ProjectHome';
import ProjectFriend from './pages/projects/ProjectFriend';
import ProjectForm from './pages/projects/ProjectForm';
import ProjectData from './pages/projects/ProjectData';
import StateForm from './pages/states/StateForm';
import SprintForm from './pages/sprints/SprintForm';
import EpicForm from './pages/epics/EpicForm';
import StoryForm from './pages/stories/StoryForm';
import TaskForm from './pages/tasks/TaskForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/project/home",
    element: <ProjectHome />,
  },
  {
    path: "/project/data/:code",
    element: <ProjectData />,
  },
  {
    path: "/project/dataFriend/:code",
    element: <ProjectFriend />,
  },
  {
    path: "/project/edit/:id",
    element: <ProjectForm />,
  },
  {
    path: "/state/create",
    element: <StateForm />,
  },
  {
    path: "/state/edit/:id",
    element: <StateForm />,
  },
  {
    path: "/sprint/create",
    element: <SprintForm />,
  },
  {
    path: "/sprint/edit/:id",
    element: <SprintForm />,
  },
  {
    path: "/epic/create",
    element: <EpicForm />,
  },
  {
    path: "/epic/edit/:id",
    element: <EpicForm />,
  },
  {
    path: "/story/create",
    element: <StoryForm />,
  },
  {
    path: "/story/edit/:id",
    element: <StoryForm />,
  },
  {
    path: "/task/create",
    element: <TaskForm />,
  },
  {
    path: "/task/edit/:id",
    element: <TaskForm />,
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
