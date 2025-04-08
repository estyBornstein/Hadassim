CREATE DATABASE Family_Tree2
GO
USE Family_Tree2
GO

CREATE TABLE People (
    ID INT NOT NULL,
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Gender CHAR(1) NOT NULL,
    Father_ID INT,
    Mother_ID INT,
    Spouse_ID INT,
    CONSTRAINT PK_People PRIMARY KEY (ID),
    CONSTRAINT CK_Gender CHECK (Gender IN ('M', 'F')),
    CONSTRAINT FK_Father FOREIGN KEY (Father_ID) REFERENCES People(ID),
    CONSTRAINT FK_Mother FOREIGN KEY (Mother_ID) REFERENCES People(ID),
    CONSTRAINT FK_Spouse FOREIGN KEY (Spouse_ID) REFERENCES People(ID)
);

CREATE TABLE Relationships (
    Person_ID INT NOT NULL,
    Relative_ID INT NOT NULL,
    Relationship_Type VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Relationships PRIMARY KEY (Person_ID, Relative_ID, Relationship_Type),
    CONSTRAINT FK_Relationships_Person FOREIGN KEY (Person_ID) REFERENCES People(ID),
    CONSTRAINT FK_Relationships_Relative FOREIGN KEY (Relative_ID) REFERENCES People(ID)
);

CREATE TRIGGER Add_Relationships
ON People
AFTER INSERT, UPDATE
AS
BEGIN
    BEGIN TRY
        CREATE TABLE #TempData (
            Row_Num INT IDENTITY(1,1),
            ID INT,
            Gender CHAR(1),
            Father_ID INT,
            Mother_ID INT,
            Spouse_ID INT
        );

        INSERT INTO #TempData (ID, Gender, Father_ID, Mother_ID, Spouse_ID)
        SELECT ID, Gender, Father_ID, Mother_ID, Spouse_ID
        FROM inserted;

        DECLARE @Row_Count INT = (SELECT COUNT(*) FROM #TempData);
        DECLARE @Current_Row INT = 1;

        WHILE @Current_Row <= @Row_Count
        BEGIN
            DECLARE @ID INT, @Gender CHAR(1), @Father_ID INT, @Mother_ID INT, @Spouse_ID INT;

            SELECT @ID = ID, @Gender = Gender,
                   @Father_ID = Father_ID, @Mother_ID = Mother_ID, @Spouse_ID = Spouse_ID
            FROM #TempData
            WHERE Row_Num = @Current_Row;

            -- קשרים להורים
            IF @Father_ID IS NOT NULL
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM Relationships WHERE Person_ID = @ID AND Relative_ID = @Father_ID AND Relationship_Type = 'father')
                BEGIN
                    INSERT INTO Relationships VALUES (@ID, @Father_ID, 'father');
                    INSERT INTO Relationships VALUES (@Father_ID, @ID, CASE WHEN @Gender = 'M' THEN 'son' ELSE 'daughter' END);
                END;
            END;

            IF @Mother_ID IS NOT NULL
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM Relationships WHERE Person_ID = @ID AND Relative_ID = @Mother_ID AND Relationship_Type = 'mother')
                BEGIN
                    INSERT INTO Relationships VALUES (@ID, @Mother_ID, 'mother');
                    INSERT INTO Relationships VALUES (@Mother_ID, @ID, CASE WHEN @Gender = 'M' THEN 'son' ELSE 'daughter' END);
                END;
            END;

            -- קשר זוגי
            IF @Spouse_ID IS NOT NULL
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM Relationships WHERE Person_ID = @ID AND Relative_ID = @Spouse_ID AND (Relationship_Type = 'wife' OR Relationship_Type = 'husband'))
                BEGIN
                    IF @Gender = 'M'
                    BEGIN
                        INSERT INTO Relationships VALUES (@ID, @Spouse_ID, 'wife');
                        INSERT INTO Relationships VALUES (@Spouse_ID, @ID, 'husband');
                    END
                    ELSE
                    BEGIN
                        INSERT INTO Relationships VALUES (@ID, @Spouse_ID, 'husband');
                        INSERT INTO Relationships VALUES (@Spouse_ID, @ID, 'wife');
                    END;
                END;
            END

            -- קשרי אחים ואחיות
            IF @Father_ID IS NOT NULL OR @Mother_ID IS NOT NULL
            BEGIN
                INSERT INTO Relationships (Person_ID, Relative_ID, Relationship_Type)
                SELECT @ID, p.ID,
                       CASE WHEN p.Gender = 'M' THEN 'brother' ELSE 'sister' END
                FROM People p
                WHERE p.ID != @ID
                    AND (p.Father_ID = @Father_ID OR p.Mother_ID = @Mother_ID)
                    AND NOT EXISTS (
                        SELECT 1 FROM Relationships r
                        WHERE r.Person_ID = @ID
                            AND r.Relative_ID = p.ID
                            AND r.Relationship_Type = CASE WHEN p.Gender = 'M' THEN 'brother' ELSE 'sister' END
                    );

                INSERT INTO Relationships (Person_ID, Relative_ID, Relationship_Type)
                SELECT p.ID, @ID,
                       CASE WHEN @Gender = 'M' THEN 'brother' ELSE 'sister' END
                FROM People p
                WHERE p.ID != @ID
                    AND (p.Father_ID = @Father_ID OR p.Mother_ID = @Mother_ID)
                    AND NOT EXISTS (
                        SELECT 1 FROM Relationships r
                        WHERE r.Person_ID = p.ID
                            AND r.Relative_ID = @ID
                            AND r.Relationship_Type = CASE WHEN @Gender = 'M' THEN 'brother' ELSE 'sister' END
                    );
            END;

            SET @Current_Row += 1;
        END;

        DROP TABLE #TempData;
    END TRY
    BEGIN CATCH
	     PRINT 'Error occurred: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

CREATE TRIGGER Update_Spouse_Id
ON People
AFTER INSERT, UPDATE
AS
BEGIN
    BEGIN TRY
        UPDATE p
        SET Spouse_ID = i.ID
        FROM People p
        JOIN inserted i ON p.ID = i.Spouse_ID
        WHERE p.Spouse_ID IS NULL
        AND i.Spouse_ID IS NOT NULL;
    END TRY
    BEGIN CATCH
        PRINT 'Error occurred: ' + ERROR_MESSAGE();
    END CATCH
END;
GO



INSERT INTO People (Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES
(1, 'John', 'Smith', 'M', NULL, NULL, NULL),
(2, 'Alice', 'Johnson', 'F', NULL, NULL, 1),
(3, 'Robert', 'Brown', 'M', 1, 2, NULL),
(4, 'Linda', 'Davis', 'F', NULL, NULL, NULL),
(5, 'James', 'Miller', 'M', NULL, NULL, 4);
GO

select * from People
select * from Relationships  ORDER BY Person_Id

INSERT INTO People (Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES
(6, 'Tomer', 'Smith', 'M', 1, null, NULL);

SELECT * FROM People;
SELECT * FROM Relationships ORDER BY Person_Id;

UPDATE People
SET father_id = 3
WHERE Id =5

SELECT * FROM People;
SELECT * FROM Relationships ORDER BY Person_Id;