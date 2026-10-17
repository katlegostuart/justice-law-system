USE [master]
GO
/****** Object:  Database [lawCRUDdb]    Script Date: 10/17/2026 3:12:00 PM ******/
IF DB_ID(N'lawCRUDdb') IS NULL
    CREATE DATABASE [lawCRUDdb];
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [lawCRUDdb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [lawCRUDdb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [lawCRUDdb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [lawCRUDdb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [lawCRUDdb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [lawCRUDdb] SET ARITHABORT OFF 
GO
ALTER DATABASE [lawCRUDdb] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [lawCRUDdb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [lawCRUDdb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [lawCRUDdb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [lawCRUDdb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [lawCRUDdb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [lawCRUDdb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [lawCRUDdb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [lawCRUDdb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [lawCRUDdb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [lawCRUDdb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [lawCRUDdb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [lawCRUDdb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [lawCRUDdb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [lawCRUDdb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [lawCRUDdb] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [lawCRUDdb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [lawCRUDdb] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [lawCRUDdb] SET  MULTI_USER 
GO
ALTER DATABASE [lawCRUDdb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [lawCRUDdb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [lawCRUDdb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [lawCRUDdb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [lawCRUDdb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [lawCRUDdb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [lawCRUDdb] SET QUERY_STORE = ON
GO
ALTER DATABASE [lawCRUDdb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [lawCRUDdb]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](450) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attorneys]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attorneys](
	[Id] [uniqueidentifier] NOT NULL,
	[StaffNumber] [nvarchar](20) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Surname] [nvarchar](50) NOT NULL,
	[Gender] [nvarchar](20) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PhoneNumber] [nvarchar](20) NOT NULL,
	[Specialization] [nvarchar](50) NOT NULL,
	[UserId] [nvarchar](max) NULL,
 CONSTRAINT [PK_Attorneys] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cases]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cases](
	[Id] [uniqueidentifier] NOT NULL,
	[CaseNumber] [nvarchar](20) NOT NULL,
	[CaseName] [nvarchar](100) NOT NULL,
	[CaseDescription] [nvarchar](1000) NOT NULL,
	[DateOpened] [datetime2](7) NOT NULL,
	[CaseStatus] [nvarchar](20) NOT NULL,
	[CaseTypeId] [uniqueidentifier] NOT NULL,
	[ClientId] [uniqueidentifier] NOT NULL,
	[AttorneyId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Cases] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CaseTypes]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CaseTypes](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_CaseTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clients]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clients](
	[Id] [uniqueidentifier] NOT NULL,
	[ClientNumber] [nvarchar](20) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Surname] [nvarchar](50) NOT NULL,
	[Gender] [nvarchar](20) NOT NULL,
	[DateOfBirth] [datetime2](7) NOT NULL,
	[HomeAddress] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PhoneNumber] [nvarchar](20) NOT NULL,
	[IdPassportNumber] [nvarchar](20) NOT NULL,
	[UserId] [nvarchar](max) NULL,
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LegalTasks]    Script Date: 10/17/2026 3:12:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LegalTasks](
	[Id] [uniqueidentifier] NOT NULL,
	[TaskName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NOT NULL,
	[DueDate] [datetime2](7) NOT NULL,
	[Status] [nvarchar](20) NOT NULL,
	[CaseId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_LegalTasks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20261014123436_InitialCreate', N'8.0.32')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20261014232942_AddIdentity', N'8.0.32')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20261015213956_AddIdentityTables', N'8.0.32')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'3e602f0f-c60d-46ff-b571-77ca15d567d1', N'Attorney', N'ATTORNEY', NULL)
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'6fb3bfca-134e-430b-9899-8edc540cc0b7', N'Admin', N'ADMIN', NULL)
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'ccea2ee9-f91e-4b84-a0f1-73002089fc23', N'Client', N'CLIENT', NULL)
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'2951060e-6f70-467e-8582-17ad8c3ef6be', N'3e602f0f-c60d-46ff-b571-77ca15d567d1')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'3f43a6bf-5cb0-4559-a2ac-1acf0f69f005', N'3e602f0f-c60d-46ff-b571-77ca15d567d1')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'97755c53-fd01-48a8-9cc4-c17b87480f07', N'3e602f0f-c60d-46ff-b571-77ca15d567d1')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'e739cf71-99a7-4dce-9b87-e3b97de5ed05', N'3e602f0f-c60d-46ff-b571-77ca15d567d1')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'5235e7f1-b715-403b-a5cd-8b5f9a8fb21a', N'6fb3bfca-134e-430b-9899-8edc540cc0b7')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'4c21ca27-f31c-4930-afef-ba48a209816e', N'ccea2ee9-f91e-4b84-a0f1-73002089fc23')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'60beeacf-ede4-41af-8b73-de6a597c2632', N'ccea2ee9-f91e-4b84-a0f1-73002089fc23')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'77a5b24c-7159-4940-9a1a-f33610d115c7', N'ccea2ee9-f91e-4b84-a0f1-73002089fc23')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'd9dbea04-9aa4-4576-9bde-66c93582feb9', N'ccea2ee9-f91e-4b84-a0f1-73002089fc23')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'fd81d0f7-73ae-4151-95f2-0395f45bf33a', N'ccea2ee9-f91e-4b84-a0f1-73002089fc23')
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'2951060e-6f70-467e-8582-17ad8c3ef6be', N'aisha.patel@justicelaw.com', N'AISHA.PATEL@JUSTICELAW.COM', N'aisha.patel@justicelaw.com', N'AISHA.PATEL@JUSTICELAW.COM', 0, N'AQAAAAIAAYagAAAAEI7hBGbinKiG7D4OIo2Wcm7a0wv7GC/bvU+/KlcDWmELGr/6mjn2Kp7AWm9YxHItOg==', N'SF2SOPIJV7WDAKZAXHA7RMNOC6HFQSUC', N'3c263a92-80ca-449b-9176-e380d5baadb1', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'3f43a6bf-5cb0-4559-a2ac-1acf0f69f005', N'pieter.vdmerwe@justicelaw.com', N'PIETER.VDMERWE@JUSTICELAW.COM', N'pieter.vdmerwe@justicelaw.com', N'PIETER.VDMERWE@JUSTICELAW.COM', 0, N'AQAAAAIAAYagAAAAEFRuMAefU6oO1kYw12wCLxeNrrYkqZlgoqPl0nWMC4qRCKMJGD5Omq2Ft8VonUGMww==', N'Y6B75DAIUNB3CTYJ3NGPIWROU35JN6AH', N'7ddd7b0c-7ca7-48f9-b52d-dbc7ec13f754', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'4c21ca27-f31c-4930-afef-ba48a209816e', N'thabo.mahlangu@gmail.com', N'THABO.MAHLANGU@GMAIL.COM', N'thabo.mahlangu@gmail.com', N'THABO.MAHLANGU@GMAIL.COM', 0, N'AQAAAAIAAYagAAAAEGif3nV1iSOIFbSrkOrVjUpgGW05ixOoIIf0AGeJweNKkGKnI947UNkjEYQua5fa3A==', N'DRXZN5VMQCSYUCE6L5JLBI7XOHZV6HF6', N'9fc524bf-2371-4559-99d0-1424c72d1926', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'5235e7f1-b715-403b-a5cd-8b5f9a8fb21a', N'admin@justicelaw.com', N'ADMIN@JUSTICELAW.COM', N'admin@justicelaw.com', N'ADMIN@JUSTICELAW.COM', 1, N'AQAAAAIAAYagAAAAEFXHYTTgiC0AZvS02fLLJyM0H91HfyeQETLHYbZtq+KxfwFrzdJeFgghZDkEIyyQCw==', N'RTLLJILLTXQTEYLLLNF7B4FFVVEA3H4X', N'708f0d02-4dd2-4baf-b4e1-7dbf3cd12a11', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'60beeacf-ede4-41af-8b73-de6a597c2632', N'johan.botha@webmail.co.za', N'JOHAN.BOTHA@WEBMAIL.CO.ZA', N'johan.botha@webmail.co.za', N'JOHAN.BOTHA@WEBMAIL.CO.ZA', 0, N'AQAAAAIAAYagAAAAEEGmQFmbCkjOdPGIwrbKm3F+wjQxnr2Dofhen9B2/IrYdlgWuI7ESOnxwbLr2vQ8wA==', N'IKM7SSJTLXT7OI4T5FFW7BNA32D6XHK3', N'b19fe875-e147-43f0-8c91-35f216e2cf62', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'77a5b24c-7159-4940-9a1a-f33610d115c7', N'fatima.moosa@gmail.com', N'FATIMA.MOOSA@GMAIL.COM', N'fatima.moosa@gmail.com', N'FATIMA.MOOSA@GMAIL.COM', 0, N'AQAAAAIAAYagAAAAEDl++Qq2Mv4w+kVyDx+LFB/kMMZFnwcXA3oJQtqYQILlaoY3yuXdUK7cKa6B/ccb/Q==', N'UZAM72SABCU5H5JSX47VVGSXN2EQKWIN', N'24089d20-4511-4eff-b439-4aeb340c74b0', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'97755c53-fd01-48a8-9cc4-c17b87480f07', N'thandi.nkosi@justicelaw.com', N'THANDI.NKOSI@JUSTICELAW.COM', N'thandi.nkosi@justicelaw.com', N'THANDI.NKOSI@JUSTICELAW.COM', 0, N'AQAAAAIAAYagAAAAEACWQ75gQJLoDYiCwxlOfjslMS8jKyENliv6ZFSteCDzJsmfGpRZvIQurDbcEKTgrg==', N'PHLFIM6OEOT2LETQFVNI3C2YCBORIZ4F', N'73b5c22a-7fef-4a94-9a40-277571ea4dce', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'd9dbea04-9aa4-4576-9bde-66c93582feb9', N'sipho.dlamini@gmail.com', N'SIPHO.DLAMINI@GMAIL.COM', N'sipho.dlamini@gmail.com', N'SIPHO.DLAMINI@GMAIL.COM', 0, N'AQAAAAIAAYagAAAAEPqCcn6sdkAYXVDFrPxmRhuuwCOulZsmsHnKvWvOLEj4Y8AzwCrNMA8RXIyziZu20Q==', N'DY7OUXC3X3KDZ6ICWBYYSG3AWLYADWVN', N'275e2807-60c1-43c9-a079-e55ce855c3a8', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'e739cf71-99a7-4dce-9b87-e3b97de5ed05', N'lwazi.mokoena@justicelaw.com', N'LWAZI.MOKOENA@JUSTICELAW.COM', N'lwazi.mokoena@justicelaw.com', N'LWAZI.MOKOENA@JUSTICELAW.COM', 0, N'AQAAAAIAAYagAAAAEO5s13Y8xIvl3tSnCoLW1cZo87hS6cZs0MIqNEBqJ7gyevmFHHupTP/lGzSLQF41ew==', N'A5AR6DOIGELZHF424DMRQZGOMU6P4HCX', N'ea709bc5-e302-45b8-b115-22738dda8896', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'fd81d0f7-73ae-4151-95f2-0395f45bf33a', N'nomsa.khumalo@outlook.com', N'NOMSA.KHUMALO@OUTLOOK.COM', N'nomsa.khumalo@outlook.com', N'NOMSA.KHUMALO@OUTLOOK.COM', 0, N'AQAAAAIAAYagAAAAEIZbRq6Uibk47aHSsvhiaG/jUGmTii0OlZUYaYLAAU/2s98EFe1KHKnnigT665oTGA==', N'R3BEUBRL7FGQ7C2QXZ5KKVYIGLLCUJVZ', N'3dd52f19-00fb-430a-8770-22234424af46', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[Attorneys] ([Id], [StaffNumber], [Name], [Surname], [Gender], [Email], [PhoneNumber], [Specialization], [UserId]) VALUES (N'a2000000-0000-0000-0000-000000000001', N'ATT001', N'Thandi', N'Nkosi', N'Female', N'thandi.nkosi@justicelaw.com', N'0823416719', N'Civil Law', N'97755c53-fd01-48a8-9cc4-c17b87480f07')
GO
INSERT [dbo].[Attorneys] ([Id], [StaffNumber], [Name], [Surname], [Gender], [Email], [PhoneNumber], [Specialization], [UserId]) VALUES (N'a2000000-0000-0000-0000-000000000002', N'ATT002', N'Pieter', N'van der Merwe', N'Male', N'pieter.vdmerwe@justicelaw.com', N'0719283746', N'Criminal Law', N'3f43a6bf-5cb0-4559-a2ac-1acf0f69f005')
GO
INSERT [dbo].[Attorneys] ([Id], [StaffNumber], [Name], [Surname], [Gender], [Email], [PhoneNumber], [Specialization], [UserId]) VALUES (N'a2000000-0000-0000-0000-000000000003', N'ATT003', N'Aisha', N'Patel', N'Female', N'aisha.patel@justicelaw.com', N'0836025514', N'Family Law', N'2951060e-6f70-467e-8582-17ad8c3ef6be')
GO
INSERT [dbo].[Attorneys] ([Id], [StaffNumber], [Name], [Surname], [Gender], [Email], [PhoneNumber], [Specialization], [UserId]) VALUES (N'a2000000-0000-0000-0000-000000000004', N'ATT004', N'Lwazi', N'Mokoena', N'Male', N'lwazi.mokoena@justicelaw.com', N'0764418203', N'Labour Law', N'e739cf71-99a7-4dce-9b87-e3b97de5ed05')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000001', N'CASE001', N'Dlamini v Cape Retail Holdings (Pty) Ltd', N'Civil claim for a refund and damages arising from a defective appliance sold under the Consumer Protection Act.', CAST(N'2026-09-01T00:00:00.0000000' AS DateTime2), N'In Progress', N'a1000000-0000-0000-0000-000000000002', N'c1000000-0000-0000-0000-000000000001', N'a2000000-0000-0000-0000-000000000001')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000002', N'CASE002', N'S v Khumalo', N'Criminal defence against a charge of theft; bail application and trial preparation.', CAST(N'2026-08-15T00:00:00.0000000' AS DateTime2), N'Open', N'a1000000-0000-0000-0000-000000000001', N'c1000000-0000-0000-0000-000000000002', N'a2000000-0000-0000-0000-000000000002')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000003', N'CASE003', N'Botha v Botha (Divorce)', N'Contested divorce: division of the joint estate, maintenance and primary residence of minor children.', CAST(N'2026-07-20T00:00:00.0000000' AS DateTime2), N'In Progress', N'a1000000-0000-0000-0000-000000000003', N'c1000000-0000-0000-0000-000000000003', N'a2000000-0000-0000-0000-000000000003')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000004', N'CASE004', N'Moosa v Coastal Logistics (Pty) Ltd', N'Unfair dismissal referral to the CCMA after termination without a fair hearing.', CAST(N'2026-09-10T00:00:00.0000000' AS DateTime2), N'Pending', N'a1000000-0000-0000-0000-000000000004', N'c1000000-0000-0000-0000-000000000004', N'a2000000-0000-0000-0000-000000000004')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000005', N'CASE005', N'Mahlangu Property Transfer', N'Registration of transfer of a residential sectional title unit at the Deeds Office.', CAST(N'2026-06-05T00:00:00.0000000' AS DateTime2), N'Closed', N'a1000000-0000-0000-0000-000000000006', N'c1000000-0000-0000-0000-000000000005', N'a2000000-0000-0000-0000-000000000001')
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000006', N'CASE006', N'Dlamini Residential Lease Dispute', N'Dispute with a landlord over early termination and the return of the lease deposit.', CAST(N'2026-10-01T00:00:00.0000000' AS DateTime2), N'Open', N'a1000000-0000-0000-0000-000000000006', N'c1000000-0000-0000-0000-000000000001', NULL)
GO
INSERT [dbo].[Cases] ([Id], [CaseNumber], [CaseName], [CaseDescription], [DateOpened], [CaseStatus], [CaseTypeId], [ClientId], [AttorneyId]) VALUES (N'ca000000-0000-0000-0000-000000000007', N'CASE007', N'Khumalo Supply Agreement Review', N'Review and amendment of a supply agreement, including breach and termination clauses.', CAST(N'2026-09-25T00:00:00.0000000' AS DateTime2), N'In Progress', N'a1000000-0000-0000-0000-000000000005', N'c1000000-0000-0000-0000-000000000002', N'a2000000-0000-0000-0000-000000000001')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000001', N'Criminal')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000002', N'Civil')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000003', N'Family')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000004', N'Labour')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000005', N'Commercial')
GO
INSERT [dbo].[CaseTypes] ([Id], [Name]) VALUES (N'a1000000-0000-0000-0000-000000000006', N'Property')
GO
INSERT [dbo].[Clients] ([Id], [ClientNumber], [Name], [Surname], [Gender], [DateOfBirth], [HomeAddress], [Email], [PhoneNumber], [IdPassportNumber], [UserId]) VALUES (N'c1000000-0000-0000-0000-000000000001', N'CLI001', N'Sipho', N'Dlamini', N'Male', CAST(N'1990-05-14T00:00:00.0000000' AS DateTime2), N'45 Church Street, Cape Town, 8001', N'sipho.dlamini@gmail.com', N'0834127765', N'9005145800082', N'd9dbea04-9aa4-4576-9bde-66c93582feb9')
GO
INSERT [dbo].[Clients] ([Id], [ClientNumber], [Name], [Surname], [Gender], [DateOfBirth], [HomeAddress], [Email], [PhoneNumber], [IdPassportNumber], [UserId]) VALUES (N'c1000000-0000-0000-0000-000000000002', N'CLI002', N'Nomsa', N'Khumalo', N'Female', CAST(N'1985-11-02T00:00:00.0000000' AS DateTime2), N'12 Florida Road, Morningside, Durban, 4001', N'nomsa.khumalo@outlook.com', N'0728836410', N'8511020346084', N'fd81d0f7-73ae-4151-95f2-0395f45bf33a')
GO
INSERT [dbo].[Clients] ([Id], [ClientNumber], [Name], [Surname], [Gender], [DateOfBirth], [HomeAddress], [Email], [PhoneNumber], [IdPassportNumber], [UserId]) VALUES (N'c1000000-0000-0000-0000-000000000003', N'CLI003', N'Johan', N'Botha', N'Male', CAST(N'1978-03-21T00:00:00.0000000' AS DateTime2), N'7 Protea Road, Brooklyn, Pretoria, 0181', N'johan.botha@webmail.co.za', N'0825570193', N'7803215127085', N'60beeacf-ede4-41af-8b73-de6a597c2632')
GO
INSERT [dbo].[Clients] ([Id], [ClientNumber], [Name], [Surname], [Gender], [DateOfBirth], [HomeAddress], [Email], [PhoneNumber], [IdPassportNumber], [UserId]) VALUES (N'c1000000-0000-0000-0000-000000000004', N'CLI004', N'Fatima', N'Moosa', N'Female', CAST(N'1993-08-09T00:00:00.0000000' AS DateTime2), N'88 Marine Drive, Nahoon, East London, 5241', N'fatima.moosa@gmail.com', N'0613092287', N'9308090275080', N'77a5b24c-7159-4940-9a1a-f33610d115c7')
GO
INSERT [dbo].[Clients] ([Id], [ClientNumber], [Name], [Surname], [Gender], [DateOfBirth], [HomeAddress], [Email], [PhoneNumber], [IdPassportNumber], [UserId]) VALUES (N'c1000000-0000-0000-0000-000000000005', N'CLI005', N'Thabo', N'Mahlangu', N'Male', CAST(N'1982-12-30T00:00:00.0000000' AS DateTime2), N'23 Jacaranda Street, Rosebank, Johannesburg, 2196', N'thabo.mahlangu@gmail.com', N'0847761054', N'8212306093082', N'4c21ca27-f31c-4930-afef-ba48a209816e')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'8c18579b-099b-4fdf-ac4b-113f9370efa7', N'Lodge transfer documents', N'Lodge the transfer documents and rates clearance certificate at the Deeds Office.', CAST(N'2026-06-20T00:00:00.0000000' AS DateTime2), N'Complete', N'ca000000-0000-0000-0000-000000000005')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'59b284c5-35ac-48e8-9a6f-41440d74184a', N'Draft settlement agreement', N'Draft the proposed division of the joint estate and maintenance terms.', CAST(N'2026-11-01T00:00:00.0000000' AS DateTime2), N'Not Started', N'ca000000-0000-0000-0000-000000000003')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'95c0286e-651a-41fd-8cff-550afc116dde', N'Research breach precedents', N'Research case law on breach and cancellation of commercial contracts.', CAST(N'2026-11-12T00:00:00.0000000' AS DateTime2), N'Not Started', N'ca000000-0000-0000-0000-000000000007')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'1bbead32-8351-45e1-9130-65e1dd587e80', N'Collect employment records', N'Obtain the dismissal letter, contract and last three payslips.', CAST(N'2026-10-30T00:00:00.0000000' AS DateTime2), N'Not Started', N'ca000000-0000-0000-0000-000000000004')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'bb3a2df6-b7b3-4a6b-84b0-857b25035bdf', N'Prepare bail affidavit', N'Prepare the client''s sworn statement for the bail application.', CAST(N'2026-10-25T00:00:00.0000000' AS DateTime2), N'In Progress', N'ca000000-0000-0000-0000-000000000002')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'0e9ea65a-b587-4f77-8e6f-ca0a92355d6a', N'Research case law', N'Research Consumer Protection Act precedents on defective goods.', CAST(N'2026-11-20T00:00:00.0000000' AS DateTime2), N'Not Started', N'ca000000-0000-0000-0000-000000000001')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'6f69ad11-8df3-4f89-83c8-d13ac142f18b', N'Draft amended agreement', N'Prepare the revised supply agreement for the client''s review.', CAST(N'2026-10-28T00:00:00.0000000' AS DateTime2), N'In Progress', N'ca000000-0000-0000-0000-000000000007')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'59f46723-161b-4419-ac53-d244a35cf8e0', N'Client consultation', N'Consult with the client to confirm the facts and collect the purchase documents.', CAST(N'2026-09-05T00:00:00.0000000' AS DateTime2), N'Complete', N'ca000000-0000-0000-0000-000000000001')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'9491c15f-ea68-464a-8124-e69e4028ed67', N'Issue divorce summons', N'Issue and serve the combined summons at the High Court.', CAST(N'2026-10-30T00:00:00.0000000' AS DateTime2), N'In Progress', N'ca000000-0000-0000-0000-000000000003')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'2aac12ce-aebd-44b9-94d9-e7adc3a3aab4', N'Initial consultation', N'Take instructions and explain the charge and bail process to the client.', CAST(N'2026-08-18T00:00:00.0000000' AS DateTime2), N'Complete', N'ca000000-0000-0000-0000-000000000002')
GO
INSERT [dbo].[LegalTasks] ([Id], [TaskName], [Description], [DueDate], [Status], [CaseId]) VALUES (N'c6968e32-8309-4e04-86ab-faaa5c75aed6', N'Draft summons and particulars', N'Draft the combined summons and particulars of claim.', CAST(N'2026-11-05T00:00:00.0000000' AS DateTime2), N'In Progress', N'ca000000-0000-0000-0000-000000000001')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetRoleClaims_RoleId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetRoleClaims_RoleId] ON [dbo].[AspNetRoleClaims]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [RoleNameIndex]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[NormalizedName] ASC
)
WHERE ([NormalizedName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserClaims_UserId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserClaims_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserLogins_UserId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserLogins_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserRoles_RoleId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserRoles_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [EmailIndex]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [EmailIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UserNameIndex]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedUserName] ASC
)
WHERE ([NormalizedUserName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Attorneys_StaffNumber]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Attorneys_StaffNumber] ON [dbo].[Attorneys]
(
	[StaffNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Cases_AttorneyId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_Cases_AttorneyId] ON [dbo].[Cases]
(
	[AttorneyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Cases_CaseNumber]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Cases_CaseNumber] ON [dbo].[Cases]
(
	[CaseNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Cases_CaseTypeId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_Cases_CaseTypeId] ON [dbo].[Cases]
(
	[CaseTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Cases_ClientId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_Cases_ClientId] ON [dbo].[Cases]
(
	[ClientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Clients_ClientNumber]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Clients_ClientNumber] ON [dbo].[Clients]
(
	[ClientNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_LegalTasks_CaseId]    Script Date: 10/17/2026 3:12:00 PM ******/
CREATE NONCLUSTERED INDEX [IX_LegalTasks_CaseId] ON [dbo].[LegalTasks]
(
	[CaseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AspNetRoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetRoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[Cases]  WITH CHECK ADD  CONSTRAINT [FK_Cases_Attorneys_AttorneyId] FOREIGN KEY([AttorneyId])
REFERENCES [dbo].[Attorneys] ([Id])
GO
ALTER TABLE [dbo].[Cases] CHECK CONSTRAINT [FK_Cases_Attorneys_AttorneyId]
GO
ALTER TABLE [dbo].[Cases]  WITH CHECK ADD  CONSTRAINT [FK_Cases_CaseTypes_CaseTypeId] FOREIGN KEY([CaseTypeId])
REFERENCES [dbo].[CaseTypes] ([Id])
GO
ALTER TABLE [dbo].[Cases] CHECK CONSTRAINT [FK_Cases_CaseTypes_CaseTypeId]
GO
ALTER TABLE [dbo].[Cases]  WITH CHECK ADD  CONSTRAINT [FK_Cases_Clients_ClientId] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Clients] ([Id])
GO
ALTER TABLE [dbo].[Cases] CHECK CONSTRAINT [FK_Cases_Clients_ClientId]
GO
ALTER TABLE [dbo].[LegalTasks]  WITH CHECK ADD  CONSTRAINT [FK_LegalTasks_Cases_CaseId] FOREIGN KEY([CaseId])
REFERENCES [dbo].[Cases] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[LegalTasks] CHECK CONSTRAINT [FK_LegalTasks_Cases_CaseId]
GO
USE [master]
GO
ALTER DATABASE [lawCRUDdb] SET  READ_WRITE 
GO
