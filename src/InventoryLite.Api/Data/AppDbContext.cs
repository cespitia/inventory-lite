using Microsoft.EntityFrameworkCore;
using InventoryLite.Api.Models;

namespace InventoryLite.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Product> Products => Set<Product>();
}