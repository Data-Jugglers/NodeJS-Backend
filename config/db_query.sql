drop table if exists datasets, description, sub_datasets, sub_sub_datasets, users, views;

CREATE TABLE description(
	set_id serial not null unique,
	primary key (set_id),
	source_link varchar(256),
	description_link varchar(256),
	description varchar(1500)
);
CREATE TABLE datasets(
	data_id serial not null unique,
	set_id int,
    primary key (data_id),
	measurement_date varchar(256) not null,
    data decimal not null,
	string varchar(512),
	foreign key (set_id) references description (set_id)
		on delete cascade
);
CREATE TABLE sub_datasets(
	data_id serial not null unique,
	sector_set_id int,
	-- primary key (set_id),
	category varchar(256) not null,
	data decimal not null,
	foreign key (sector_set_id) references datasets (data_id)
		on delete cascade
);
CREATE TABLE sub_sub_datasets(
	data_id serial not null unique,
	sub_sector_set_id int,
	category varchar(256) not null,
	data decimal not null,
	foreign key (sub_sector_set_id) references sub_datasets (data_id)
		on delete cascade
);
CREATE TABLE users(
	user_id serial not null unique,
	primary key (user_id),
	username varchar(256) not null,
	password varchar(256) not null
);
CREATE TABLE views(
	view_id int not null unique,
	primary key (view_id),
	viewJson json,
	user_id int not null,
	foreign key (user_id) references users (user_id)
		on delete cascade
);
