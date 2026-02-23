using Microsoft.AspNetCore.Mvc;
using InventoryLite.Api.Models;
using InventoryLite.Api.Services;

namespace InventoryLite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;
    public ProductsController(ProductService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var p = await _service.GetByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product p)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var created = await _service.CreateAsync(p);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Product p)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var ok = await _service.UpdateAsync(id, p);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}