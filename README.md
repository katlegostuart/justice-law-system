# Justice Law Attorneys: Law Firm Management System

A full-stack web application for managing a law firm's clients, attorneys, cases and tasks. It has an **ASP.NET Core 8 Web API** backend with a **SQL Server** database and a **React** frontend. Access is role-based, with separate experiences for **Admins**, **Attorneys** and **Clients**.

A group project for IWDV202: Web Applications Development

<!-- ![App screenshot](docs/screenshot.png) -->

---

## Features

- **Role-based access** (Admin, Attorney, Client) using ASP.NET Core Identity
- **Client management**: register and maintain client records
- **Attorney management**: maintain attorney profiles
- **Case management**: create and track legal cases by case type
- **Task management**: assign and track tasks within each case
- **Search endpoints** for finding clients, cases and more

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | ASP.NET Core 8 Web API (C#) |
| ORM | Entity Framework Core (Code-First, migrations) |
| Database | Microsoft SQL Server |
| Authentication | ASP.NET Core Identity (Admin / Attorney / Client roles) |
| Frontend | React with React-Bootstrap |
| Version control | Git and GitHub |

---

## Repository Structure

```
justice-law-system/
├── JusticeLaw.API/          # ASP.NET Core 8 Web API
└── justice-law-client/      # React frontend
```

---

## Database Design

The database is built Code-First with EF Core. The main tables are:

| Table | Purpose |
| --- | --- |
| `applicationUser` | Login accounts (extends ASP.NET Identity) |
| `client` | Client details |
| `attorney` | Attorney details |
| `caseType` | Categories of legal case |
| `legalCase` | An individual case |
| `legalTask` | A task belonging to a case |

```mermaid
erDiagram
    applicationUser ||--o| client : "is"
    applicationUser ||--o| attorney : "is"
    client ||--o{ legalCase : "has"
    attorney ||--o{ legalCase : "handles"
    caseType ||--o{ legalCase : "categorises"
    legalCase ||--o{ legalTask : "contains"
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS) and npm
- SQL Server (LocalDB, Express or full) and a tool such as SSMS or Azure Data Studio
- Visual Studio 2022 (recommended for the API) or the .NET CLI

### 1. Clone the repository

```bash
git clone https://github.com/katlegostuart/justice-law-system.git
cd justice-law-system
```

### 2. Set up the database and API

1. Open `JusticeLaw.API/appsettings.json` and set your SQL Server connection string:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=JusticeLawDb;Trusted_Connection=True;"
   }
   ```

2. Apply the migrations to create the database:

   ```bash
   cd JusticeLaw.API
   dotnet ef database update
   ```

   In Visual Studio you can instead run `Update-Database` in the Package Manager Console.

3. Start the API:

   ```bash
   dotnet run
   ```

   The API will start on the URL shown in the console (Swagger UI is available at `/swagger` if enabled).

### 3. Run the frontend

```bash
cd justice-law-client
npm install
npm run dev
```

Make sure the API base URL in the frontend config matches the URL your API is running on.

---

## Roles

| Role | What they can do |
| --- | --- |
| **Admin** | Manage users, attorneys, clients, case types and cases |
| **Attorney** | View and manage their assigned cases and tasks |
| **Client** | View their own cases and progress |

---

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Log in and receive a token |
| `GET` | `/api/clients` | List clients |
| `GET` | `/api/clients/search?query=` | Search clients |
| `GET` | `/api/cases` | List cases |
| `GET` | `/api/cases/search?query=` | Search cases |
| `GET` | `/api/tasks` | List tasks |

---

## Team

| Member | Responsibility |
| --- | --- |
| Vuyisanani | API and search endpoints |
| Katlego | Database, models, Identity and roles |
| Bandiswa | React frontend: Admin side |
| Molefi | React frontend: Attorney and Client side |

---

## What We Learned

- Designing a relational schema and building it Code-First with EF Core migrations
- Securing an API with ASP.NET Core Identity and role-based authorisation
- Collaborating as a team using Git and GitHub

---

## Future Improvements

- Document uploads for cases
- Email or in-app notifications for task deadlines
- Automated tests for the API

---

## Licence

This project was created for educational purposes.
