create table list_item (
    list_item_id integer primary key,
    list_id integer not null references list(list_id) on delete cascade,
    user_id integer not null references user(user_id) on delete cascade,
    list_item_description text not null,
    list_item_completed integer not null default 0,
    list_item_completed_at integer,
    list_item_created_at integer not null
)