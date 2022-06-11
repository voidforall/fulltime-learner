# Comments API Design Doc

| Name    | Path               | Verb   | Purpose                            |
|---------|--------------------|--------|------------------------------------|
| Index   | /comments          | GET    | Display all comments               |
| New     | /comments/new      | GET    | Form to create new comment         |
| Create  | /comments          | POST   | Creates new comment on server      |
| Show    | /comments/:id      | GET    | Details for one specific comment   |
| Edit    | /comments/:id/edit | GET    | Form to edit specific comment      |
| Update  | /comments/:id      | PATCH  | Updates specific comment on server |
| Destroy | /comments/:id      | DELETE | Deletes specific item on server    |