drop table if exists datasets, description;

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
	foreign key (set_id) references description (set_id)
		on delete cascade
);