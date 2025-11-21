create table admins
(
    id        int auto_increment
        primary key,
    nume      varchar(100) not null,
    prenume   varchar(100) not null,
    telefon   varchar(20)  not null,
    cod_acces varchar(255) not null comment 'Hashed password using password_hash()',
    constraint telefon
        unique (telefon)
);

create table barbers
(
    id           int auto_increment
        primary key,
    nume         varchar(100) not null,
    specializare varchar(255) null,
    imagine      varchar(255) null
);

create table appointments
(
    id             int auto_increment
        primary key,
    nume           varchar(100)                        null,
    telefon        varchar(20)                         null,
    service        varchar(100)                        not null,
    date           date                                not null,
    time           time                                not null,
    barber_id      int                                 not null,
    created_at     timestamp default CURRENT_TIMESTAMP null,
    client_nume    varchar(100)                        null,
    client_prenume varchar(100)                        null,
    client_telefon varchar(20)                         null,
    constraint appointments_ibfk_1
        foreign key (barber_id) references barbers (id)
            on delete cascade
);

create index barber_id
    on appointments (barber_id);

create table holidays
(
    id        int auto_increment
        primary key,
    barber_id int  not null,
    date      date not null,
    constraint unique_barber_date
        unique (barber_id, date),
    constraint holidays_ibfk_1
        foreign key (barber_id) references barbers (id)
            on delete cascade
);

create table services
(
    id       int auto_increment
        primary key,
    name     varchar(100)   not null,
    price    decimal(10, 2) not null,
    duration int            not null comment 'Duration in minutes'
);

create table simple_appointments
(
    id         int auto_increment
        primary key,
    nume       varchar(100)                        not null,
    telefon    varchar(20)                         not null,
    service    varchar(100)                        not null,
    date       date                                not null,
    time       time                                not null,
    barber_id  int                                 not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint simple_appointments_ibfk_1
        foreign key (barber_id) references barbers (id)
            on delete cascade
);

create index barber_id
    on simple_appointments (barber_id);