# Azure Deployment Plan (TODO)

This project is structured to be cloud-ready. The following deployment steps are planned:

## API Deployment (Azure App Service)

1. Create Azure App Service (Linux, .NET runtime)
2. Publish using:
   dotnet publish -c Release
3. Configure environment variables:
   - ConnectionStrings__DefaultConnection
4. Enable CORS policy for production domain
5. Configure HTTPS enforcement

## Database Upgrade (Future)

Current: SQLite (local development)

Planned upgrade:
- Azure SQL Database
- Update connection string
- Apply EF Core migrations via:
  dotnet ef database update

## Frontend Deployment

Option A: Azure Static Web Apps
Option B: Azure App Service (Node runtime)
Option C: GitHub Actions CI/CD

## CI/CD (Planned Enhancement)

- GitHub Actions workflow:
  - Build API
  - Run tests
  - Deploy to Azure