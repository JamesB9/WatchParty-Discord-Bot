/* Posts TABLE */
CREATE TABLE IF NOT EXISTS Requests
(
    Type VARCHAR(128) NOT NULL,
    Name VARCHAR(12) NOT NULL,
    Date DATE NOT NULL,

	PRIMARY KEY (Type, Name)
);
