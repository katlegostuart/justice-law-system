IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Attorneys] (
    [Id] uniqueidentifier NOT NULL,
    [StaffNumber] nvarchar(20) NOT NULL,
    [Name] nvarchar(50) NOT NULL,
    [Surname] nvarchar(50) NOT NULL,
    [Gender] nvarchar(20) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Specialization] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Attorneys] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CaseTypes] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_CaseTypes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Clients] (
    [Id] uniqueidentifier NOT NULL,
    [ClientNumber] nvarchar(20) NOT NULL,
    [Name] nvarchar(50) NOT NULL,
    [Surname] nvarchar(50) NOT NULL,
    [Gender] nvarchar(20) NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [HomeAddress] nvarchar(200) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [IdPassportNumber] nvarchar(20) NOT NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Cases] (
    [Id] uniqueidentifier NOT NULL,
    [CaseNumber] nvarchar(20) NOT NULL,
    [CaseName] nvarchar(100) NOT NULL,
    [CaseDescription] nvarchar(1000) NOT NULL,
    [DateOpened] datetime2 NOT NULL,
    [CaseStatus] nvarchar(20) NOT NULL,
    [CaseTypeId] uniqueidentifier NOT NULL,
    [ClientId] uniqueidentifier NOT NULL,
    [AttorneyId] uniqueidentifier NULL,
    CONSTRAINT [PK_Cases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Cases_Attorneys_AttorneyId] FOREIGN KEY ([AttorneyId]) REFERENCES [Attorneys] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Cases_CaseTypes_CaseTypeId] FOREIGN KEY ([CaseTypeId]) REFERENCES [CaseTypes] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Cases_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [Clients] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [LegalTasks] (
    [Id] uniqueidentifier NOT NULL,
    [TaskName] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [DueDate] datetime2 NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [CaseId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_LegalTasks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_LegalTasks_Cases_CaseId] FOREIGN KEY ([CaseId]) REFERENCES [Cases] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Attorneys_StaffNumber] ON [Attorneys] ([StaffNumber]);
GO

CREATE INDEX [IX_Cases_AttorneyId] ON [Cases] ([AttorneyId]);
GO

CREATE UNIQUE INDEX [IX_Cases_CaseNumber] ON [Cases] ([CaseNumber]);
GO

CREATE INDEX [IX_Cases_CaseTypeId] ON [Cases] ([CaseTypeId]);
GO

CREATE INDEX [IX_Cases_ClientId] ON [Cases] ([ClientId]);
GO

CREATE UNIQUE INDEX [IX_Clients_ClientNumber] ON [Clients] ([ClientNumber]);
GO

CREATE INDEX [IX_LegalTasks_CaseId] ON [LegalTasks] ([CaseId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261014123436_InitialCreate', N'8.0.31');
GO

COMMIT;
GO

