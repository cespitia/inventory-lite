using System.ComponentModel.DataAnnotations;

namespace InventoryLite.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [StringLength(80)]
    public string Category { get; set; } = string.Empty;

    [Range(0, 1_000_000)]
    public decimal Price { get; set; }

    [Range(0, 1_000_000)]
    public int Quantity { get; set; }

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}