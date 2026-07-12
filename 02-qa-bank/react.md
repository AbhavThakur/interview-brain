# Q&A Bank - React

## Q: What is the virtual DOM and how does React reconciliation work?

**Tags:** react, core, render

The Virtual DOM is an in-memory representation of real DOM elements. React uses a diffing algorithm (Reconciliation) to compare the new virtual DOM with the previous one, and updates only the changed parts in the real DOM, optimizing performance.