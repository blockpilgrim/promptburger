export const CONTEXT_PLACEHOLDER = `Context or background info surrounding the task. What's the situation, what exists today, and/or why does this matter?

e.g. "We're migrating a Node.js monolith to microservices. The auth module is the first to be extracted. Currently using express-session with Redis."`

export const TASK_PLACEHOLDER = `Your core task or objective — what you want built, changed, or figured out. The meatier the details, the better the result.

e.g. "Refactor the auth module to use JWT tokens instead of sessions. Add refresh token rotation. Update all middleware that checks auth."`

export const CONSTRAINTS_PLACEHOLDER = `Rules, constraints, or preferences — exactly how you want it prepared.

e.g. "Use existing project patterns. No new dependencies. Keep backward compatibility with the v2 API."`

export const EXAMPLES_PLACEHOLDER = `Nothing elevates a prompt like a good example. Input/output pairs, code samples, or format references.

e.g. "Here's how existing endpoints are structured:
GET /api/users → returns { users: User[], total: number }
POST /api/users → accepts { name, email } → returns User"`
