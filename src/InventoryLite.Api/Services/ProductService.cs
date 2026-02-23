using Microsoft.EntityFrameworkCore;
using InventoryLite.Api.Data;
using InventoryLite.Api.Models;

namespace InventoryLite.Api.Services;

public class ProductService
{
    private readonly AppDbContext _db;
    public ProductService(AppDbContext db) => _db = db;

    public Task<List<Product>> GetAllAsync() =>
        _db.Products.OrderBy(p => p.Name).ToListAsync();

    public Task<Product?> GetByIdAsync(int id) =>
        _db.Products.FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Product> CreateAsync(Product p)
    {
        p.UpdatedAtUtc = DateTime.UtcNow;
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return p;
    }

    public async Task<bool> UpdateAsync(int id, Product updated)
    {
        var existing = await _db.Products.FindAsync(id);
        if (existing == null) return false;

        existing.Name = updated.Name;
        existing.Category = updated.Category;
        existing.Price = updated.Price;
        existing.Quantity = updated.Quantity;
        existing.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _db.Products.FindAsync(id);
        if (existing == null) return false;

        _db.Products.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }
}