using Microsoft.EntityFrameworkCore;
using InventoryLite.Api.Models;

namespace InventoryLite.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.Products.AnyAsync())
            return;

        db.Products.AddRange(new[]
        {
            new Product { Name="USB-C Dock", Category="Accessories", Price=119.99m, Quantity=18 },
            new Product { Name="Wireless Mouse", Category="Accessories", Price=24.99m, Quantity=75 },
            new Product { Name="Mechanical Keyboard", Category="Accessories", Price=89.50m, Quantity=32 },
            new Product { Name="27\" Monitor", Category="Displays", Price=219.00m, Quantity=12 },
            new Product { Name="Laptop Stand", Category="Accessories", Price=34.95m, Quantity=40 },
            new Product { Name="Ethernet Adapter", Category="Networking", Price=14.99m, Quantity=60 },
            new Product { Name="Webcam 1080p", Category="Peripherals", Price=49.99m, Quantity=22 },
            new Product { Name="Noise-Cancel Headset", Category="Peripherals", Price=129.00m, Quantity=15 },
            new Product { Name="Portable SSD 1TB", Category="Storage", Price=99.99m, Quantity=28 },
            new Product { Name="HDMI Cable 2m", Category="Cables", Price=9.99m, Quantity=120 },
        });

        await db.SaveChangesAsync();
    }
}