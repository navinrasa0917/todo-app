# TaskFlow - JavaScript To-Do List

A client-side To-Do List application built to demonstrate:

- Create, Read, Update and Delete (CRUD)
- `window.localStorage` persistence
- All / Active / Completed filtering
- Dynamic DOM element creation
- Event delegation
- State-driven rendering
- Responsive UI

## How to run

No installation is required.

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. Add tasks and test the filters, edit, delete and complete features.
4. Refresh the page. Your tasks will still be there because they are stored in localStorage.

## Files

- `index.html` - page structure
- `style.css` - responsive styling
- `script.js` - application state, CRUD logic, filtering and localStorage

## Assignment mapping

| Requirement | Implementation |
|---|---|
| Create | Add Task form |
| Read | `renderTasks()` |
| Update | Edit button + checkbox |
| Delete | Delete button + Clear completed |
| Persistence | `localStorage` |
| Filtering | All / Active / Completed |
| Dynamic DOM | JavaScript rendering |
| Event delegation | `taskList` click/change/keydown listeners |
