-- Suppression des tables existantes
DROP TABLE IF EXISTS History_alerts, Alerts, Comments, Tasks, User_team, Teams, Users;

-- Création des tables
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50),
    status ENUM('available', 'notBusy', 'busy', 'na') DEFAULT 'available',
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE Teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description TEXT,
    code VARCHAR(5) UNIQUE
);

CREATE TABLE User_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    teamId INT,
    UNIQUE KEY (userId, teamId),
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (teamId) REFERENCES Teams(id)
);

CREATE TABLE Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
    startDate DATE,
    endDate DATE DEFAULT NULL,
    estimatedTime INT,
    totalTime INT DEFAULT 0,
    isPriority BOOLEAN DEFAULT FALSE,
    teamId INT,
    userId INT,
    FOREIGN KEY (teamId) REFERENCES Teams(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT,
    taskId INT,
    userId INT,
    FOREIGN KEY (taskId) REFERENCES Tasks(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE Alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('New', 'In Progress', 'Resolved', 'Closed') DEFAULT 'New',
    taskId INT,
    teamId INT,
    userId INT,
    FOREIGN KEY (taskId) REFERENCES Tasks(id),
    FOREIGN KEY (teamId) REFERENCES Teams(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Table d'historique des alertes
CREATE TABLE History_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('New', 'In Progress', 'Resolved', 'Closed') DEFAULT 'New',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- enregistre la date et l'heure de chaque mise à jour
    alertId INT,
    userId INT,
    FOREIGN KEY (alertId) REFERENCES Alerts(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Insertion des données d'exemple
INSERT INTO Users (role, status, firstname, lastname, email, password) VALUES 
('Admin', 'available', 'John', 'Doe', 'john.doe@example.com', 'password123'),
('Member', 'busy', 'Jane', 'Smith', 'jane.smith@example.com', 'password456');

-- Ajout des équipes avec un code unique
INSERT INTO Teams (name, description, code) VALUES 
('Development', 'Development team', 'DEV12'),
('Marketing', 'Marketing team', 'MKT45');

-- Ajout des associations utilisateur-équipes
INSERT INTO User_team (userId, teamId) VALUES 
(1, 1),
(2, 2);

-- Ajout des tâches avec les dates et états
INSERT INTO Tasks (title, description, status, startDate, endDate, estimatedTime, totalTime, isPriority, teamId, userId) VALUES 
('Develop Feature A', 'Description of Feature A', 'In Progress', '2023-07-01', NULL, 8, 5, FALSE, 1, 1),
('Market Campaign X', 'Description of Campaign X', 'To Do', '2023-07-05', NULL, 10, 0, TRUE, 2, 2);

-- Ajout des commentaires
INSERT INTO Comments (text, taskId, userId) VALUES 
('Initial comment on Feature A', 1, 1),
('Initial comment on Campaign X', 2, 2);

-- Ajout des alertes
INSERT INTO Alerts (status, taskId, teamId, userId) VALUES 
('New', 1, 1, 1),
('New', 2, 2, 2);

-- Ajout de l'historique des alertes avec l'état initial de chaque alerte
INSERT INTO History_alerts (status, alertId, userId) VALUES 
('New', 1, 1),
('New', 2, 2);

-- Exemple de mise à jour du statut d'une alerte et ajout dans l'historique
UPDATE Alerts SET status = 'In Progress' WHERE id = 1;
INSERT INTO History_alerts (status, alertId, userId) VALUES ('In Progress', 1, 1);

UPDATE Alerts SET status = 'Resolved' WHERE id = 2;
INSERT INTO History_alerts (status, alertId, userId) VALUES ('Resolved', 2, 2);
