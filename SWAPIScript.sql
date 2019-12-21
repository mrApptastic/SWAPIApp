/*
Create Database SWAPILocalDb;
*/

Use SWAPILocalDb;

Create Table SWAPIPlanet (
Id int not null identity(1,1) primary Key,
[Name] nvarchar(512),
Climate nvarchar(256),
Diameter float,
Gravity nvarchar(256),
OrbitalPeriod int,
[Population] bigint,
RotationPeriod int,
SurfaceWater int,
Terrain nvarchar(256)
);

Create Table SWAPICharacter (
Id int not null identity(1,1) primary Key,
[Name] nvarchar(512),
Height float,
[Weight] float,
Hair nvarchar(256),
Skin nvarchar(256),
Eyes nvarchar(256),
BirthYear nvarchar(256),
HomeworldId int foreign key references SWAPIPlanet(Id),
Created datetime default getdate(),
Edited datetime default getdate()
);

Create Table SWAPIMovie (
Id int not null identity(1,1) primary Key,
EpisodeId int unique,
Title nvarchar(256),
Director nvarchar(512),
Producer nvarchar(512),
OpeningCrawl nvarchar(max),
ReleaseDate date,
Created datetime default getdate(),
Edited datetime default getdate(),
CHECK (EpisodeId > 0)
);

Create Table SWAPIStarship (
Id int not null identity(1,1) primary Key,
[Name] nvarchar(256),
MGLT nvarchar(256),
CargoCapacity float,
Consumables nvarchar(256),
Crew int,
CostInCredits float,
HyperdriveRating float,
Manufacturer nvarchar(512),
MaxAtmospheringSpeed float,
Model nvarchar(256),
Passengers int,
StarshipClass nvarchar(256),
Created datetime default getdate(),
Edited datetime default getdate()
);

Create Table SWAPIVehicle (
Id int not null identity(1,1) primary Key,
[Name] nvarchar(256),
CargoCapacity float,
Consumables nvarchar(256),
Crew int,
CostInCredits float,
HyperdriveRating float,
Manufacturer nvarchar(512),
MaxAtmospheringSpeed float,
Model nvarchar(256),
Passengers int,
VehicleClass nvarchar(256),
Created datetime default getdate(),
Edited datetime default getdate()
);

Create Table SWAPISpecie (
Id int not null identity(1,1) primary Key,
[Name] nvarchar(256),
AverageHeight float,
AverageLifespan int,
Classification nvarchar(256),
Designation nvarchar(256),
EyeColors nvarchar(512),
HairColors nvarchar(512),
SkinColors nvarchar(512),
HomeworldId int foreign key references SWAPIPlanet(Id),
[Language] nvarchar(256),
Created datetime default getdate(),
Edited datetime default getdate()
);

Create Table SWAPICharacterSpecie (
CharacterId int NOT NULL foreign key references SWAPICharacter(Id),
SpecieId int NOT NULL foreign key references SWAPISpecie(Id)
);

Create Table SWAPICharacterStarship (
CharacterId int NOT NULL foreign key references SWAPICharacter(Id),
StarshipId int NOT NULL foreign key references SWAPIStarship(Id)
);

Create Table SWAPICharacterVehicle (
CharacterId int NOT NULL foreign key references SWAPICharacter(Id),
VehicleId int NOT NULL foreign key references SWAPIVehicle(Id)
);

Create Table SWAPICharacterMovie (
CharacterId int NOT NULL foreign key references SWAPICharacter(Id),
MovieId int NOT NULL foreign key references SWAPIMovie(Id)
);

Create Table SWAPIMoviePlanet (
MovieId int NOT NULL foreign key references SWAPIMovie(Id),
CharacterId int NOT NULL foreign key references SWAPICharacter(Id)
);

Create Table SWAPIMovieSpecie (
MovieId int NOT NULL foreign key references SWAPIMovie(Id),
CharacterId int NOT NULL foreign key references SWAPICharacter(Id)
);

Create Table SWAPIMovieStarship (
MovieId int NOT NULL foreign key references SWAPIMovie(Id),
StarshipId int NOT NULL foreign key references SWAPIStarship(Id)
);

Create Table SWAPIMovieVehicle (
MovieId int NOT NULL foreign key references SWAPIMovie(Id),
VehicleId int NOT NULL foreign key references SWAPIVehicle(Id)
);






