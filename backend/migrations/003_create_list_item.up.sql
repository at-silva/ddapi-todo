create table list_item (
    list_id integer not null references list(list_id),
    list_item_id integer primary key,
    list_item_description text not null,
    list_item_completed integer not null default 0,
    list_item_completed_at integer,
    list_item_created_at integer not null
)