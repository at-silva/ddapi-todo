create table user(
    user_id integer primary key,
    user_username text not null,
    user_password text not null,
    unique(user_username)
)