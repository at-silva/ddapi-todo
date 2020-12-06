create table list (
    list_id integer primary key,
    user_id integer not null references user(user_id) on delete cascade,
    list_title text not null,
    list_created_at integer not null
)