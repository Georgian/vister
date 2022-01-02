create table transaction (
    id bigint not null auto_increment,
    date date,
    reference varchar(100),
    category varchar(20),
    amount float,
    currency varchar(3),
    account varchar(20),
    person varchar(20),
    comment varchar(255),
    primary key (id)
);

create table importer (

)
