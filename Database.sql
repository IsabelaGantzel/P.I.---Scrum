
Create Table Project{
    IdProkekt int(4) AUTO_INCREMENT;
    IdSprint int(4) AUTO_INCREMENT;
    StartDate data;
    FinisDate data;
    Nome varchar(25);
    e-mail varchar(50);
    
    Primary key(IdProkekt, IdSprint);
    Foreign key(IdSprint) REFERENCES  Sprint;
    Foreign key(IdScrumM) REFERENCES ScramMaster;
    Foreign key(IdClient) REFERENCES Client;
}

Create Table Person{
    IdPerson int(4) AUTO_INCREMENT;
    User varchar(20);
    Pass password;

    Primary key (IdPerson);
}

Create Table Person_Comment{
    IdPerson int(4) AUTO_INCREMENT;
    IdComment int(4) AUTO_INCREMENT;
    IdSprint int(4) AUTO_INCREMENT;
    Comment text not null;

    Primary key(IdPerson, IdSprint, IdComment);
    Foreign key(IdPerson) REFERENCES Person;
    Foreign key(IdComment) REFERENCES Comment;
    Foreign key(IdSprint) REFERENCES Sprint
}

Create Table ScramMaster{
    IdScrumM int(4) AUTO_INCREMENT;
    IdPerson int(4) AUTO_INCREMENT;
    
    Primary key (IdScrumM, IdPerson);
}

Create Table Client{
    IdClient int(4) AUTO_INCREMENT;
    IdPerson int(4) AUTO_INCREMENT;
    
    Primary key (IdClient, IdPerson);
}

Create Table Dev{
    IdDev int(4) AUTO_INCREMENT;
    IdPerson int(4) AUTO_INCREMENT;

    Primary key(IdDev,vIdPerson);
}

Create Table Sprint{
    IdSprint int(4) AUTO_INCREMENT;
    StartDate data;
    FinishDate data;
    Nome varchar(25);
    
    Primary key(IdSprint);
}

Create Table Dev_create_Project{
    IdProkekt int(4) AUTO_INCREMENT;
    IdDev int(4) AUTO_INCREMENT;

    Primary key (IdProkekt,IdDev);
    Foreign key (IdProkekt) REFERENCES Project;
    Foreign key (IdDev) REFERENCES Dev;
}

