import authApp from "../auth.js";
import docApp from "./docs.js";
import profileApp from "./profile/profile.route.js";
import subTaskApp from "./subtasks/subtasks.route.js";
import tagsApp from "./tags/tags.route.js";
import tasksList from "./taskList/tasksList.route.js";
import todosApp from "./todos/todos.route.js";

export {
  todosApp,
  authApp,
  subTaskApp,
  tasksList,
  tagsApp,
  profileApp,
  docApp,
};
