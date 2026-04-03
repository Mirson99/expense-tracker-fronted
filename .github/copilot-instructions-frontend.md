# Frontend Copilot Instructions

You are an expert React developer. Generate code that strictly adheres to the following modern standards and architectural decisions.

## Guidelines:

Consistency first: Always align your suggestions with the existing patterns, styling, and logic found in this repository.

If multiple architectural approaches are possible, implement the one most consistent with the tech stack below, but clearly state the alternatives in the summary of your changes.

Modern Standards: Use the latest stable practices relevant to the technologies used in this project.


## Tech Stack
- Framework: React (latest, version 19+)
- Language: TypeScript (strict mode enabled)
- Styling: Tailwind CSS
- Data Fetching & Server State: TanStack Query (React Query)

## Hard Rules & Constraints


### 1. Data Fetching
- NEVER use `useEffect` for data fetching.
- ALWAYS use TanStack Query (`useQuery`, `useMutation`) for asynchronous state management and server interactions.
- Keep data fetching logic encapsulated in custom hooks (e.g., `useGetUser`).

### 2. Styling
- Use Tailwind CSS utility classes for styling.
- Do not use inline styles (`style={{...}}`) unless dynamically calculating a value that Tailwind cannot handle (like a highly specific transform value based on cursor position).
